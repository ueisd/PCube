"""
Authentication Functions
"""

from functools import wraps
from flask import Flask
from flask import abort
from flask.logging import create_logger
from flask_jwt_extended import (
    create_access_token, create_refresh_token, get_jwt_identity,
    verify_jwt_in_request, verify_jwt_refresh_token_in_request
)
from .security import (
    is_password_valid, generate_salt, encrypt_password
)

from ..db.auth_request import AuthRequest
from ..pcube_python.db_controller import get_db

app = Flask(__name__)
log = create_logger(app)

USERS = [
    {
        'username': 'admin',
        'password': 'admin',
        'enabled': True,
        'is_admin': True
    },
    {
        'username': 'user',
        'password': 'user',
        'enabled': True,
        'is_admin': False
    }
]


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
    
    salt = generate_salt()
    print("salt : " + salt)
    print("pass : " + encrypt_password(password, salt))

    if user is None or not is_password_valid(user['hashed_password'], password, user['salt']):
        raise InvalidCredentials(email)
    else:
        return (
            create_access_token(identity=email),
            create_refresh_token(identity=email)
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

    role = request.get_access_level(user['role_id'])

    if role is None:
        raise AccountInactive()

    return {
        'email' : user['email'],
        'role' : role
    }


def deauthenticate_user():
    """
    Log user out
    in a real app, set a flag in user database requiring login, or
    implement token revocation scheme
    """
    identity = get_jwt_identity()
    log.debug('logging user "%s" out', identity)


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
            if user['is_admin']:
                return func(*args, **kwargs)
            else:
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
            if user['is_admin']:
                return func(*args, **kwargs)
            else:
                abort(403)
        except (UserNotFound, AccountInactive) as error:
            log.error('authorization failed: %s', error)
            abort(403)
    return wrapper
