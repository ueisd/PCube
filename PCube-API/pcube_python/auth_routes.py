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


@auth.route('/auth/login', methods=['GET'])
def login_user(id):
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
   