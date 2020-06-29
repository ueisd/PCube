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
from ..schemas.expense_account_schema import (expense_account_insert_schema)
from .db_controller import get_db
from ..db.expense_account_request import ExpenseAccountRequest
from ..domain.expense_account import ExpenseAccount
from ..utility.auth import (
                    get_authenticated_user,
                    auth_required, auth_refresh_required, AuthenticationError,
                    admin_required, project_manager_required, member_required
                    )

expense_account = Blueprint('expense_account', __name__)
app = Flask(__name__)
log = create_logger(app)
schema = JsonSchema(app)

@expense_account.route('/get-parents', methods=['GET'])
@auth_required
def get_all_parent_expense_account():
    """
    Permet d'obtenir tout les comptes de dépense parents.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ExpenseAccountRequest(connection)
        expense_accounts = request.select_all_parent()
        return jsonify(expense_accounts)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@expense_account.route('/get-sub-parents/<parent_id>', methods=['GET'])
@auth_required
def get_all_sub_parent_expense_account(parent_id):
    """
    Permet d'obtenir tout les sous-comptes de dépenses d'un parent.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ExpenseAccountRequest(connection)
        expense_accounts = request.select_all_expense_account_from_parent(parent_id)
        return jsonify(expense_accounts)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

def find_all_child(parent_id):

    connection = get_db().get_connection()
    request = ExpenseAccountRequest(connection)

    childs_dict = request.select_all_expense_account_from_parent(parent_id)

    if not childs_dict:
        return {}

    for expense_account in childs_dict:
        expense_account['child'] = find_all_child(expense_account['id'])

    return childs_dict


@expense_account.route('', methods=['GET'])
@auth_required
def get_all_expense_account():
    """
    Construit l'arbre des comptes de dépense.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ExpenseAccountRequest(connection)
        parents_dict = request.select_all_parent()

        for expense_account in parents_dict:
            expense_account['child'] = find_all_child(expense_account['id'])

        return jsonify(parents_dict)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)


@expense_account.route('/is-unique/<name>', methods=['GET'])
@auth_required
def is_expense_account_unique(name):
    """
    Sert à modifier l'information d'un compte de dépense
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ExpenseAccountRequest(connection)
        isUnique = request.select_one_expense_account(name.upper())
        if isUnique is None:
            return jsonify(True)
        else:
            return jsonify(False)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@expense_account.route('/autocomplete/<name>', methods=['GET'])
@auth_required
def expense_account_autocomplete(name):
    """
    Permet d'obtenir une liste de compte de dépense pour l'autocomplete.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ExpenseAccountRequest(connection)
        expense_accounts = request.select_expense_account_name_like(name.upper())
        return jsonify(expense_accounts)
        
    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@expense_account.errorhandler(JsonValidationError)
def validation_error(e):
    errors = [validation_error.message for validation_error in e.errors]
    return jsonify({'error': e.message, 'errors': errors}), 400
        