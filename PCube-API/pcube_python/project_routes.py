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
from ..schemas.project_schema import (project_insert_schema)
from .db_controller import get_db
from ..db.project_request import ProjectRequest
from ..domain.project import Project
from ..utility.auth import (
                    get_authenticated_user,
                    auth_required, auth_refresh_required, AuthenticationError,
                    admin_required, project_manager_required, member_required
                    )

project = Blueprint('project', __name__)
app = Flask(__name__)
log = create_logger(app)
schema = JsonSchema(app)

@project.route('/get-parents', methods=['GET'])
@auth_required
def get_all_parent_project():
    """
    Permet d'obtenir tout les projets parents.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        projects = request.select_all_parent()
        return jsonify(projects)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('/get-sub-parents/<parent_id>', methods=['GET'])
@auth_required
def get_all_sub_parent_project(parent_id):
    """
    Permet d'obtenir tout les sous-projets d'un parent.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        projects = request.select_all_project_from_parent(parent_id)
        return jsonify(projects)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

def find_all_child(parent_id):

    connection = get_db().get_connection()
    request = ProjectRequest(connection)

    childs_dict = request.select_all_project_from_parent(parent_id)

    if not childs_dict:
        return {}

    for project in childs_dict:
        project['child_project'] = find_all_child(project['id'])

    return childs_dict


@project.route('', methods=['GET'])
@auth_required
def get_all_project():
    """
    Construit l'abre des projets.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        parents_dict = request.select_all_parent()

        for project in parents_dict:
            project['child_project'] = find_all_child(project['id'])

        return jsonify(parents_dict)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('/filter', methods=['GET'])
@auth_required
def get_project_by_filter():
    """
    Construit l'abre des projets.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        project = Project()
        project.name = escape(request.args.get('name', "")).upper().strip()
        connection = get_db().get_connection()
        query = ProjectRequest(connection)
        parents_dict = query.select_all_parent_by_filter(project)
        for project in parents_dict:
            project['child_project'] = find_all_child(project['id'])

        return jsonify(parents_dict)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('/filter/one-level', methods=['GET'])
@auth_required
def get_one_level_project_by_filter():
    """
    Permet de trouver des projets selon leur nom et/ou identifiant
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        project = Project()
        project.name = escape(request.args.get('name', "")).upper().strip()
        project.id = escape(request.args.get('id', "")).upper().strip()
        connection = get_db().get_connection()
        query = ProjectRequest(connection)
        projects = query.select_project_one_level_filter(project)

        return jsonify(projects)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('', methods=['POST'])
@auth_required
@schema.validate(project_insert_schema)
def create_project():
    """
    Création d'un nouveau projet
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        data = request.json
        project = Project()
        project.name = escape(data['name'].upper().strip())
        project.parent_name = escape(data['parent_name'].upper().strip())

        connection = get_db().get_connection()
        query = ProjectRequest(connection)

        if(project.name != project.parent_name):
            parent = query.select_one_project(project.parent_name)
            if parent:
                project.parent_id = parent['id']
            else:
                log.error("Le parent n'existe pas")
                abort(404)

        project = query.insert_project(project)

        return jsonify(project.asDictionary()),201

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('', methods=['PUT'])
@auth_required
def modify_project():
    """
    Sert à modifier l'information d'un projet
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        #get_authenticated_user()
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        parents_dict = request.select_all_parent()

        for project in parents_dict:
            project['child'] = find_all_child(project['id'])

        return jsonify(parents_dict)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('/is-unique/<name>', methods=['GET'])
@auth_required
def is_project_unique(name):
    """
    Sert à modifier l'information d'un projet
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        isUnique = request.select_one_project(name.upper())
        if isUnique is None:
            return jsonify(True)
        else:
            return jsonify(False)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('/autocomplete/<name>', methods=['GET'])
@auth_required
def project_autocomplte(name):
    """
    Permet d'obtenir une liste de projet pour l'autocomplete.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        projects = request.select_project_name_like(name.upper())
        return jsonify(projects)
        
    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.errorhandler(JsonValidationError)
def validation_error(e):
    errors = [validation_error.message for validation_error in e.errors]
    return jsonify({'error': e.message, 'errors': errors}), 400
        