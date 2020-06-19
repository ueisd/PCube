from flask import Flask
from flask import request
from flask import abort
from flask import make_response
from flask import jsonify
from flask import Blueprint
from flask.logging import create_logger
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
        project['child'] = find_all_child(project['id'])

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
            project['child'] = find_all_child(project['id'])

        return jsonify(parents_dict)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('', methods=['POST'])
@auth_required
def create_project():
    """
    Création d'un nouveau projet
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()

        name = request.form.get("name", "").upper()
        parent_name = request.form.get("parent_name", "").upper()
        if not name or not parent_name:
            log.error('Post is missing parameter')
            abort(400)

        project = Project()
        project.name = name
        project.parent_name = parent_name

        connection = get_db().get_connection()
        aRequest = ProjectRequest(connection)
        
        if(name != parent_name):
            project.parent_id = aRequest.select_one_project(parent_name)['id']

        project = aRequest.insert_project(project)

        return jsonify(project.asDictionary())

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
        