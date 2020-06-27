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

activity = Blueprint('activity', __name__)
app = Flask(__name__)
log = create_logger(app)


@activity.route('/get-all-activity', methods=['GET'])
#@auth_required
def get_all_activity():
    """
    Permet d'obtenir toutes les activités du système
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        #get_authenticated_user()
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        activities = request.select_all_activity()
        return jsonify(activities)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@activity.route('/is-unique-activity/<name>', methods=['GET'])
def is_unique_activity(name):
        connection = get_db().get_connection()
        request = ProjectRequest(connection)
        isUnique = request.select_one_activity(name.upper())
        if isUnique is None:
            return jsonify(True)
        else:
            return jsonify(False)
    
@activity.route('/activity', methods=['POST'])
@auth_required
def add_new_activity():
    """
    Permet d'ajouter une nouvelle activité dans le système.
    """
    try:
        get_authenticated_user()
        name = request.form.get("name", "").upper()
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

@activity.route('/activity', methods=['PUT'])
@auth_required
def modify_activity():
    """
    Permet de modifier une activité dans le système.
    """
    try:
        get_authenticated_user()
        name = request.form.get("name", "").upper()
        id = request.form.get("id", "")
        new_name = request.form.get("new_name", "").upper()
        if not name or not id or not new_name:
            log.error('Post is missing parameters')
            abort(400)

        connection = get_db().get_connection()
        aRequest = ProjectRequest(connection)
        isUnique = aRequest.select_one_activity(new_name)

        if isUnique is not None:
            log.error('The activity name is not unique')
            abort(409)

        activity = Activity(name)
        activity.id = id
        new_activity = Activity(new_name)

        new_activity = aRequest.update_activity(activity, new_activity)
        return jsonify(new_activity.asDictionnary())

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)
   