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
from ..schemas.expense_account_schema import (
    expense_account_insert_schema, expense_account_update_schema,
    expense_account_delete_schema)
from .db_controller import get_db
from ..db.expense_account_request import ExpenseAccountRequest
from ..domain.expense_account import ExpenseAccount
from ..utility.auth import (
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

    """
    connection = get_db().get_connection()
    request = ExpenseAccountRequest(connection)
    expense_accounts = request.select_all_parent()
    return jsonify(expense_accounts), 200


@expense_account.route('/get-sub-parents/<parent_id>', methods=['GET'])
@auth_required
def get_all_sub_parent_expense_account(parent_id):
    """
    Permet d'obtenir tout les sous-comptes de dépenses d'un parent.

    """
    connection = get_db().get_connection()
    request = ExpenseAccountRequest(connection)
    expense_accounts = request.select_all_expense_account_from_parent(
        parent_id)
    return jsonify(expense_accounts), 200


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

    """
    connection = get_db().get_connection()
    request = ExpenseAccountRequest(connection)
    parents_dict = request.select_all_parent()

    for expense_account in parents_dict:
        expense_account['child'] = find_all_child(expense_account['id'])

    return jsonify(parents_dict), 200


# @param id: l'identifiant du noeud de la racine du sous-arbre à ne pas inclure
def construireArbreSansSousArbre(comptes, parent, id):
    if (parent is None or parent['id'] == id):
        return []

    parent['child'] = [child for child in comptes
                       if child['parent_id'] == parent['id']
                       and child['parent_id'] != child['id']
                       and child['id'] != id
                       ]
    for child in parent['child']:
        child = construireArbreSansSousArbre(comptes, child, id)
    return parent


@expense_account.route('/getApparentable/<_id>', methods=['GET'])
@auth_required
def getApparentable(_id):
    """
    Permet d'obtenir la liste des comptes de dépense auquels le compte peut
    s'aparenter sans circularité
    """
    id = escape(_id).strip()
    id = int(id)
    connection = get_db().get_connection()
    request = ExpenseAccountRequest(connection)
    comptes = request.select_all()

    parents = [x for x in comptes if x['id'] == x['parent_id']]
    for parent in parents:
        parent = construireArbreSansSousArbre(comptes, parent, id)
    return jsonify(parents), 200


@expense_account.route('/filter', methods=['GET'])
@auth_required
def get_expense_account_by_filter():
    """
    Construit l'arbre des comptes de dépense.
    """
    expense_account = ExpenseAccount()
    expense_account.name = escape(request.args.get('name', "")).upper().strip()
    connection = get_db().get_connection()
    query = ExpenseAccountRequest(connection)
    parents_dict = query.select_all_parent_by_filter(expense_account)
    for expense_account in parents_dict:
        expense_account['child'] = find_all_child(expense_account['id'])

    return jsonify(parents_dict), 200


@expense_account.route('/is-unique/<name>', methods=['GET'])
@auth_required
def is_expense_account_unique(name):
    """
    Sert à modifier l'information d'un compte de dépense
    """
    connection = get_db().get_connection()
    request = ExpenseAccountRequest(connection)
    isUnique = request.select_one_expense_account(name.upper())
    if isUnique is None:
        return jsonify(True), 200
    else:
        return jsonify(False), 200


@expense_account.route('/filter/one-level', methods=['GET'])
@auth_required
def get_one_level_expense_account_by_filter():
    """
    Permet de trouver des comptes de dépense selon leur nom et/ou identifiant
    """
    account = ExpenseAccount()
    account.name = escape(request.args.get('name', "")).upper().strip()
    account.id = escape(request.args.get('id', "")).upper().strip()
    connection = get_db().get_connection()
    query = ExpenseAccountRequest(connection)
    accounts = query.select_expense_account_one_level_filter(account)

    return jsonify(accounts), 200


@expense_account.route('/autocomplete/<name>', methods=['GET'])
@auth_required
def expense_account_autocomplete(name):
    """
    Permet d'obtenir une liste de compte de dépense pour l'autocomplete.
    """
    connection = get_db().get_connection()
    request = ExpenseAccountRequest(connection)
    expense_accounts = request.select_expense_account_name_like(name.upper())
    return jsonify(expense_accounts), 200


@expense_account.route('', methods=['DELETE'])
@auth_required
@schema.validate(expense_account_delete_schema)
def delete_expense_account():
    """
    Permet de supprimer un compte de dépense.
    """
    data = request.json

    connection = get_db().get_connection()
    query = ExpenseAccountRequest(connection)

    id = escape(data['id']).upper().strip()
    name = escape(data['name']).upper().strip()

    if not query.is_id_name_combo_exist(id, name):
        log.error("La combinaison id-nom est erronée.")
        abort(404)
    if query.has_child(id, name):
        log.error("Le compte a un enfant")
        abort(412)
    if query.is_in_timeline_table(id):
        log.error("Le compte est dans la table Timeline")
        abort(412)

    query.delete_expense_account(id, name)
    return jsonify(""), 200


@expense_account.route('/is-deletable/<id>/<name>', methods=['GET'])
@auth_required
def is_expense_account_deletable(id, name):
    """
    Permet de vérifier si un compte de dépense est supprimable.
    """

    connection = get_db().get_connection()
    query = ExpenseAccountRequest(connection)

    id = id.upper().strip()
    name = name.upper().strip()
    isDeletable = True

    if not query.is_id_name_combo_exist(id, name):
        isDeletable = False
    if query.has_child(id, name):
        isDeletable = False
    if query.is_in_timeline_table(id):
        isDeletable = False

    return jsonify(isDeletable), 200


@expense_account.route('', methods=['PUT'])
@auth_required
@schema.validate(expense_account_update_schema)
def update_expense_account():
    """
    Permet de modifier un compte de dépense dans le système.
    """
    data = request.json
    expenseAcount = ExpenseAccount()
    expenseAcount.id = escape(data['id']).strip()
    expenseAcount.parent_id = escape(data['parent_id']).strip()
    expenseAcount.name = escape(data['name']).strip()

    connection = get_db().get_connection()
    query = ExpenseAccountRequest(connection)

    expenseAcount = query.update_expense_account_std(expenseAcount)

    return jsonify(expenseAcount.asDictionary()), 200


@expense_account.route('', methods=['POST'])
@project_manager_required
@schema.validate(expense_account_insert_schema)
def create_expense_account():
    """
    Création d'un nouveau compte de dépense
    """
    data = request.json
    expense_account = ExpenseAccount()
    expense_account.name = escape(data['name'].upper().strip())
    expense_account.parent_id = data['parent_id']
    connection = get_db().get_connection()
    query = ExpenseAccountRequest(connection)

    if expense_account.parent_id != -1:
        parent = query.select_one_expense_account_by_id(
                 expense_account.parent_id)
        if parent:
            expense_account.parent_name = parent['name']
        else:
            log.error("Le parent n'existe pas")
            abort(404)

    expense_account = query.create_expense_account_by_parent_id(
                      expense_account)
    return jsonify(expense_account.asDictionary()), 201


@expense_account.errorhandler(JsonValidationError)
def validation_error(e):
    errors = [validation_error.message for validation_error in e.errors]
    return jsonify({'error': e.message, 'errors': errors}), 400
