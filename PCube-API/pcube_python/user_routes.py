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
        admin_required()
        project_manager_required()
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
        admin_required()
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

@user.route('/is-unique-user/<email>', methods=['GET'])
def is_unique_user(email):
        connection = get_db().get_connection()
        request = UserRequest(connection)
        isUnique = request.select_one_user(email.upper())
        if isUnique is None:
            return jsonify(True)
        else:
            return jsonify(False)


@user.route('/user', methods=['POST'])
#@auth_required
def add_new_user():
    """
    Permet d'ajouter un utilisateur dans le système.
    """
    try:
        get_authenticated_user()
        first_name = request.form.get("first_name", "").upper()
        last_name = request.form.get("last_name", "").upper()
        email = request.form.get("email", "").upper()
        password = request.form.get("password", "").upper()
        confirm_password = request.form.get("confirm_password", "").upper()
        if not first_name or not last_name or not email or not password or not confirm_password: #Il y a une erreur a cette ligne qui bloque tout les routes utilisateurs
            log.error('Post is missing parameter')
            abort(400)

        connection = get_db().get_connection()
        aRequest = UserRequest(connection)
        isUnique = aRequest.select_one_user(email)

        if isUnique is not None:
            log.error('The email is not unique')
            abort(409)

        user = User()
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.password = password

        user = aRequest.insert_user(user)
        return jsonify(user.asDictionnary())

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)


@user.route('/user', methods=['PUT'])
#@auth_required
def add_new_user():
    """
    Permet de modifier un utilisateur dans le système.
    """
    try:
        get_authenticated_user()
        user_id = request.args.get('user_id', "").upper()
        email = request.args.get('email', "").upper()
        new_first_name = request.form.get("new_first_name", "").upper()
        new_last_name = request.form.get("new_last_name", "").upper()
        new_password = request.form.get("new_password", "").upper()
        if not user_id or not email or not  new_first_name or not new_last_name or not new_password 
            log.error('Post is missing parameter')
            abort(400)

        connection = get_db().get_connection()
        aRequest = UserRequest(connection)
        isUnique = aRequest.select_one_user(email)

        if isUnique is not None:
            log.error('The email is not unique')
            abort(409)

        user = User()
        user.user_id = user_id
        user.email = email
        user.first_name = new_first_name
        user.last_name = new_last_name
        user.password = new_password

        user = aRequest.update_user(user)
        return jsonify(user.asDictionnary())

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)
