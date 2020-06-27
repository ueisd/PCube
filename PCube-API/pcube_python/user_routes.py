# coding=utf-8
from flask import Flask
from flask import abort
from flask import jsonify
from flask import make_response
from flask import Blueprint
from flask import request
from .db_controller import get_db
from flask.logging import create_logger
from ..db.user_request import UserRequest
from ..utility.auth import (get_authenticated_user,
                    auth_required, auth_refresh_required, AuthenticationError,
                    admin_required, project_manager_required, member_required
                    )

user = Blueprint('user', __name__)
app = Flask(__name__)
log = create_logger(app)

@user.route('', methods=['GET'])
@auth_required
def get_all_user():
    """
    Permet d'obtenir la liste de tout les utilisateurs.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        query = UserRequest(connection)
        users = query.select_all_user()
        return jsonify(users)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)


@user.route('', methods=['DELETE'])
@auth_required
def delete_user():
    """
    Permet de supprimer un utilisateur.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        user_id = request.args.get('user_id', None)
        email = request.args.get('email', None)
        connection = get_db().get_connection()
        query = UserRequest(connection)
        user = query.delete_user(user_id, email)
        connection.commit()
        if not bool(user):
            return "user does not exist in database", 404
        else:
            return jsonify(user)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)
