# coding=utf-8
from flask import Flask
from flask import request
from flask import abort
from flask import make_response
from flask import jsonify
from flask import Blueprint
from flask.logging import create_logger
from ..db.auth_request import AuthRequest
from ..utility.auth import (authenticate_user, deauthenticate_user,
                    refresh_authentication, get_authenticated_user,
                    auth_required, auth_refresh_required, AuthenticationError)

from .db_controller import get_db

auth = Blueprint('auth', __name__)
app = Flask(__name__)
log = create_logger(app)


@auth.route('/auth/login', methods=['POST'])
def login_user():
    """
    Login user
    """
    try:
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        access_token, refresh_token = authenticate_user(username, password)
        return make_response(jsonify({
            'accessToken': access_token,
            'refreshToken': refresh_token
        }))
    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)


@auth.route('/auth/info', methods=['GET'])
@auth_required
def login_info_api():
    """
    Get informaiton about currently logged in user
    """
    try:
        user = get_authenticated_user()
        return make_response(jsonify({
            'username': user['username'],
            'enabled': user['enabled'],
            'isAdmin': user['is_admin']
        }))
    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)


@app.route('/auth/logout', methods=['POST'])
@auth_refresh_required
def logout_api():
    """
    Log user out
    """
    deauthenticate_user()
    return make_response()


@app.route('/auth/refresh', methods=['POST'])
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
   