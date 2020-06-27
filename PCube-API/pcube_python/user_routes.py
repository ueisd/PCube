# coding=utf-8
from flask import Flask
from flask import abort
from flask import jsonify
from flask import make_response
from flask import Blueprint
from flask import request
from flask import escape
from flask_json_schema import JsonSchema
from flask_json_schema import JsonValidationError
from .db_controller import get_db
from flask.logging import create_logger
from ..schemas.user_schema import (user_update_schema, user_insert_schema, user_delete_schema)
from ..db.user_request import UserRequest
from ..domain.user import User
from ..utility.security import (generate_salt, encrypt_password)
from ..utility.auth import (get_authenticated_user,
                    auth_required, auth_refresh_required, AuthenticationError,
                    admin_required, project_manager_required, member_required
                    )

user = Blueprint('user', __name__)
app = Flask(__name__)
log = create_logger(app)
schema = JsonSchema(app)

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
@schema.validate(user_delete_schema)
def delete_user():
    """
    Permet de supprimer un utilisateur.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        data = request.json

        connection = get_db().get_connection()
        query = UserRequest(connection)

        id = escape(data['id']).strip()
        email = escape(data['email']).strip()

        if not query.is_id_email_combo_exist(id, email):
            log.error("L'utilisateur n'existe pas")
            abort(404)

        query.delete_user(id, email)
        return "",200

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


@user.route('', methods=['POST'])
@auth_required
@schema.validate(user_insert_schema)
def add_new_user():
    """
    Permet d'ajouter un utilisateur dans le système.
    """
    try:
        data = request.json
        user = User()
        user.first_name = escape(data['first_name']).strip()
        user.last_name = escape(data['last_name']).strip()
        user.email = escape(data['email']).strip()
        user.role_id = escape(data['role_id']).strip()

        connection = get_db().get_connection()
        query = UserRequest(connection)
        isUnique = query.select_one_user(user.email)

        if isUnique is not None:
            log.error('The email is not unique')
            abort(409)

        if data['password_confirmed'] != data['password']:
            log.error('Échec de la validation du mot de passe!')
            abort(400)

        salt = generate_salt()
        hashed_password = encrypt_password(data['password'], salt)

        user = query.insert_user(user,hashed_password, salt)
        return jsonify(user.asDictionary()), 201

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)


@user.route('', methods=['PUT'])
@auth_required
@schema.validate(user_update_schema)
def update_user():
    """
    Permet de modifier un utilisateur dans le système.
    """
    try:
        data = request.json
        user = User()
        user.first_name = escape(data['first_name']).strip()
        user.last_name = escape(data['last_name']).strip()
        user.id = escape(data['id']).strip()
        user.email = escape(data['email']).strip()
        user.role_id = escape(data['role_id']).strip()

        connection = get_db().get_connection()
        query = UserRequest(connection)

        if not query.is_id_email_combo_exist(user.id, user.email):
            log.error("L'utilisateur n'existe pas")
            abort(404)

        user = query.update_user(user, data['new_email'])

        return jsonify(user.asDictionary()), 200

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@user.errorhandler(JsonValidationError)
def validation_error(e):
    errors = [validation_error.message for validation_error in e.errors]
    return jsonify({'error': e.message, 'errors': errors}), 400