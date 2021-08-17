"""
Authentication Functions
"""

from functools import wraps
from flask import Flask
from flask import abort
from flask.logging import create_logger
from flask_jwt_extended import (
    JWTManager, jwt_required, get_raw_jwt,
    create_access_token, create_refresh_token, get_jwt_identity,
    verify_jwt_in_request, verify_jwt_refresh_token_in_request
)
from .security import (
    is_password_valid, generate_salt, encrypt_password
)

from ..db.auth_request import AuthRequest
from ..domain.access_token import AccessToken
from ..pcube_python.db_controller import get_db

app = Flask(__name__)
log = create_logger(app)

app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
jwt = JWTManager(app)
blacklist = set()


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist


class AuthenticationError(Exception):
    """Base Authentication Exception"""

    def __init__(self, msg=None):
        self.msg = msg

    def __str__(self):
        return self.__class__.__name__ + '(' + str(self.msg) + ')'


class InvalidCredentials(AuthenticationError):
    """Invalid username/password"""


class AccountInactive(AuthenticationError):
    """Account is disabled"""


class AccessDenied(AuthenticationError):
    """Access is denied"""


class UserNotFound(AuthenticationError):
    """User identity not found"""


def authenticate_user(email, password):
    """
    Authenticate a user
    Errors :
    raise InvalidCredentials(email) : Lorsque les informations sont erronés
    raise AccountInactive(email) : Lorsque le compte est suspendu
    """

    connection = get_db().get_connection()
    request = AuthRequest(connection)
    user = request.select_user(email)

    if user is None or not is_password_valid(user['hashed_password'],
                                             password, user['salt']):
        raise InvalidCredentials(email)
    elif not user['isActive']:
        raise AccountInactive(email)
    else:
        return (
            create_access_token(identity=email),
            create_refresh_token(identity=email),
        )


def get_authenticated_user():
    """
    Get authentication token user identity and verify account is active
    Errors:
    raise UserNotFound(identity) : Si l'identité n'existe pas.
    raise AccountInactive() : Si le compte est suspendu.
    """

    connection = get_db().get_connection()
    request = AuthRequest(connection)
    identity = get_jwt_identity()

    user = request.select_user(identity)

    if user is None:
        raise UserNotFound(identity)
    elif not user['isActive']:
        raise AccountInactive(identity)

    role = request.select_role(user['role_id'])

    if role is None:
        raise AccountInactive()

    return {
        'email': user['email'],
        'role': role['role_name'],
        'access_level': str(role['access_level']),
        'first_name': user['first_name'],
        'last_name': user['last_name']
    }


def deauthenticate_user():
    """
    Log user out
    in a real app, set a flag in user database requiring login, or
    implement token revocation scheme
    """
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)


def refresh_authentication():
    """
    Refresh authentication, issue new access token
    """
    user = get_authenticated_user()
    return create_access_token(identity=user['email'])


def auth_required(func):
    """
    View decorator - require valid access token
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        try:
            get_authenticated_user()
            return func(*args, **kwargs)
        except (UserNotFound, AccountInactive) as error:
            log.error('authorization failed: %s', error)
            abort(403)
    return wrapper


def auth_refresh_required(func):
    """
    View decorator - require valid refresh token
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_refresh_token_in_request()
        try:
            get_authenticated_user()
            return func(*args, **kwargs)
        except (UserNotFound, AccountInactive) as error:
            log.error('authorization failed: %s', error)
            abort(403)
    return wrapper


def admin_required(func):
    """
    View decorator - required valid access token and admin access
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        try:
            user = get_authenticated_user()

            if int(user['access_level']) == 1:
                return func(*args, **kwargs)
            else:
                log.error('Access Denied')
                abort(403)
        except (UserNotFound, AccountInactive) as error:
            log.error('authorization failed: %s', error)
            abort(403)
    return wrapper


def project_manager_required(func):
    """
    View decorator - required valid access token and project manager access
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        try:
            user = get_authenticated_user()
            if int(user['access_level']) <= 2:
                return func(*args, **kwargs)
            else:
                log.error('Access Denied')
                abort(403)
        except (UserNotFound, AccountInactive) as error:
            log.error('authorization failed: %s', error)
            abort(403)
    return wrapper


def member_required(func):
    """
    View decorator - required valid access token and member access
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        try:
            user = get_authenticated_user()
            if int(user['access_level']) <= 3:
                return func(*args, **kwargs)
            else:
                log.error('Access Denied')
                abort(403)
        except (UserNotFound, AccountInactive) as error:
            log.error('authorization failed: %s', error)
            abort(403)
    return wrapper