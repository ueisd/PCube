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
from ..domain.activity import Activity
from ..schemas.activity_schema import (activity_insert_schema, activity_update_schema, activity_delete_schema)
from .db_controller import get_db
from ..db.activity_request import ActivityRequest
from ..domain.activity import Activity
from ..utility.auth import (
                    get_authenticated_user,
                    auth_required, auth_refresh_required, AuthenticationError,
                    admin_required, project_manager_required, member_required
                    )

activity = Blueprint('activity', __name__)
app = Flask(__name__)
log = create_logger(app)
schema = JsonSchema(app)


@activity.route('/get-all-activity', methods=['GET'])
@auth_required
def get_all_activity():
    """
    Permet d'obtenir toutes les activités du système
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        #get_authenticated_user()
        connection = get_db().get_connection()
        query = ActivityRequest(connection)
        activities = query.select_all_activity()
        return jsonify(activities)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@activity.route('/filter', methods=['GET'])
@auth_required
def get_activity_by_filter():
    """
    Permet d'obtenir une liste d'activité filtré par le nom
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        name = escape(request.args.get('name', "")).upper().strip()
        connection = get_db().get_connection()
        query = ActivityRequest(connection)
        activities = query.select_activity_by_filter(name) 
        return jsonify(activities)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@activity.route('/is-unique-activity/<name>', methods=['GET'])
def is_unique_activity(name):
        connection = get_db().get_connection()
        query = ActivityRequest(connection)
        isUnique = query.select_one_activity(name.upper())
        if isUnique is None:
            return jsonify(True)
        else:
            return jsonify(False)
    
@activity.route('', methods=['POST'])
@auth_required
@schema.validate(activity_insert_schema)
def add_new_activity():
    """
    Permet d'ajouter une nouvelle activité dans le système.
    """
    try:
        data = request.json
        activity = Activity(escape(data['name'].upper().strip()))

        connection = get_db().get_connection()
        query = ActivityRequest(connection)
        isUnique = query.select_one_activity(activity.name)

        if isUnique is not None:
            log.error("Le nom de l'activité doit être unique")
            abort(409)

        activity = query.insert_activity(activity)
        return jsonify(activity.asDictionnary()), 201

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@activity.route('', methods=['PUT'])
@auth_required
@schema.validate(activity_delete_schema)
def modify_activity():
    """
    Permet de modifier une activité dans le système.
    """
    try:
        data = request.json

        activity = Activity(escape(data['name'].upper().strip()))
        activity.id = escape(data['id']).strip()
        new_name = escape(data['new_name'].upper().strip())

        connection = get_db().get_connection()
        query = ActivityRequest(connection)

        isUnique = True if not query.select_one_activity(new_name) else False

        if not isUnique:
            log.error("Le nom de l'activité doit être unique")
            abort(409)

        itExist = True if query.is_id_name_combo_exist(activity.id, activity.name) else False

        if not itExist:
            log.error("L'activité n'existe pas")
            abort(404)

        new_activity = query.update_activity(activity, new_name)
        return jsonify(new_activity.asDictionnary())

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@activity.route('<id>', methods=['DELETE'])
@auth_required
@schema.validate(activity_delete_schema)
def delete_activity(id):
    """
    Permet de supprimer une activité.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        data = request.json

        print(data)

        connection = get_db().get_connection()
        query = ActivityRequest(connection)

        id = escape(id).strip()


        query.delete_activity(id)
        return jsonify(""),200

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)
   
@activity.errorhandler(JsonValidationError)
def validation_error(e):
    errors = [validation_error.message for validation_error in e.errors]
    return jsonify({'error': e.message, 'errors': errors}), 400