# coding=utf-8
import json
from flask import Flask
from flask import request
from flask import abort
from flask import make_response
from flask import jsonify
from flask import Blueprint
from flask import escape
from flask_json_schema import JsonSchema
from flask_json_schema import JsonValidationError
from flask.logging import create_logger
from ..schemas.auth_schema import (auth_login_schema)
from ..db.auth_request import AuthRequest
from ..domain.user import User
from ..utility.auth import (authenticate_user, deauthenticate_user,
                            refresh_authentication, get_authenticated_user,
                            auth_required, auth_refresh_required,
                            AuthenticationError, admin_required,
                            project_manager_required, member_required
                            )

auth = Blueprint('auth', __name__)
app = Flask(__name__)
log = create_logger(app)
schema = JsonSchema(app)


@auth.route('/login', methods=['POST'])
@schema.validate(auth_login_schema)
def login_user():
    """
    Login user
    """
    try:
        data = request.json

        email = escape(data['email']).upper().strip()
        password = escape(data['password']).strip()
        access_token, refresh_token = authenticate_user(email, password)
        return make_response(jsonify({
            'accessToken': access_token,
            'refreshToken': refresh_token
        }))
    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)


@auth.route('/info', methods=['GET'])
@auth_required
def login_info_api():
    """
    Get informaiton about currently logged in user
    """
    try:
        user = get_authenticated_user()
        return make_response(jsonify({
            'email': user['email'],
            'role': user['role'],
            'level': user['access_level'],
            'first_name': user['first_name'],
            'last_name': user['last_name']
        }))
    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(401)


@auth.route('/logout', methods=['DELETE'])
@auth_refresh_required
def logout_api():
    """
    Log user out
    """
    deauthenticate_user()
    return jsonify({"msg": "Successfully logged out"}), 200


@auth.route('/refresh', methods=['POST'])
@auth_refresh_required
def refresh_api():
    """
    Get a fresh access token from a valid refresh token
    """
    try:
        access_token = refresh_authentication()
        return make_response(jsonify({
            'accessToken': access_token
        }))
    except AuthenticationError as error:
        log.error('authentication error %s', error)
        abort(403)


@auth.route('admin-check', methods=['GET'])
@admin_required
def admin_check():
    return json.dumps(True)


@auth.route('project-manager-check', methods=['GET'])
@project_manager_required
def project_manager_check():
    return json.dumps(True)


@auth.route('member-check', methods=['GET'])
@member_required
def member_check():
    return json.dumps(True)


@auth.errorhandler(JsonValidationError)
def validation_error(e):
    errors = [validation_error.message for validation_error in e.errors]
    return jsonify({'error': e.message, 'errors': errors}), 400
