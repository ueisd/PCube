from flask import Flask
from flask import request
from flask import abort
from flask import make_response
from flask import jsonify
from flask import Blueprint
from flask.logging import create_logger
from .db_controller import get_db
from ..db.project_request import ProjectRequest
from ..domain.activity import Activity
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

@project.route('/get-all-activity', methods=['GET'])
@auth_required
def get_all_activity():
    """
    Permet d'obtenir toutes les activités du système
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        get_authenticated_user()
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        activities = request.select_all_activity()
        return jsonify(activities)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@project.route('/is-unique-activity/<name>', methods=['GET'])
def is_unique_activity(name):
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        isUnique = request.select_one_activity(name)
        if isUnique is None:
            return jsonify(True)
        else:
            return jsonify(False)
    
@project.route('/add-new-activity', methods=['POST'])
@auth_required
def add_new_activity():
    """
    Permet d'ajouter une nouvelle activité dans le système.
    """
    try:
        get_authenticated_user()
        name = request.form.get("name", "")
        if not name:
            log.error('Post is missing parameter name')
            abort(400)

        connection = get_db().get_connection()
        aRequest = ProjectRequest(connection)
        isUnique = aRequest.select_one_activity(name)

        if isUnique is not None:
            log.error('The activity name is not unique')
            abort(409)

        activity = Activity(name)

        activity = aRequest.insert_activity(activity)
        return jsonify(activity.asDictionnary())

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)
   