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

@project.route('/get-all-project', methods=['GET'])
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
            childs_dict = request.select_all_project_from_parent(project['id'])
            project['childs'] = childs_dict

        return jsonify(parents_dict)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)