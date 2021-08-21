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
from ..schemas.activity_schema import (
    activity_insert_schema, activity_update_schema, activity_delete_schema)
from .db_controller import get_db
from ..db.activity_request import ActivityRequest
from ..domain.activity import Activity
from ..utility.auth import (
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
    connection = get_db().get_connection()
    query = ActivityRequest(connection)
    activities = query.select_all_activity()
    return jsonify(activities), 200


@activity.route('/filter', methods=['GET'])
@auth_required
def get_activity_by_filter():
    """
    Permet d'obtenir une liste d'activité filtré par le nom
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    activity = Activity()
    activity.name = escape(request.args.get('name', "")).upper().strip()
    activity.id = escape(request.args.get('id', "")).upper().strip()
    connection = get_db().get_connection()
    query = ActivityRequest(connection)
    activities = query.select_activity_by_filter(activity)
    return jsonify(activities), 200


@activity.route('/is-unique-activity/<name>', methods=['GET'])
@auth_required
def is_unique_activity(name):
    connection = get_db().get_connection()
    query = ActivityRequest(connection)
    isUnique = query.select_one_activity(name.upper())
    if isUnique is None:
        return jsonify(True), 200
    else:
        return jsonify(False), 200


@activity.route('', methods=['POST'])
@project_manager_required
@schema.validate(activity_insert_schema)
def add_new_activity():
    """
    Permet d'ajouter une nouvelle activité dans le système.
    """
    data = request.json
    activity = Activity()
    activity.name = escape(data['name'].upper().strip())

    connection = get_db().get_connection()
    query = ActivityRequest(connection)
    isUnique = query.select_one_activity(activity.name)

    if isUnique is not None:
        log.error("Le nom de l'activité doit être unique")
        abort(409)

    activity = query.insert_activity(activity)
    return jsonify(activity.asDictionnary()), 201


@activity.route('', methods=['PUT'])
@project_manager_required
@schema.validate(activity_update_schema)
def modify_activity():
    """
    Permet de modifier une activité dans le système.
    """
    data = request.json

    activity = Activity()
    activity.name = escape(data['name'].upper().strip())
    activity.id = escape(data['id']).strip()
    new_name = escape(data['new_name'].upper().strip())

    connection = get_db().get_connection()
    query = ActivityRequest(connection)

    isUnique = True if not query.select_one_activity(new_name) else False

    if not isUnique:
        log.error("Le nom de l'activité doit être unique")
        abort(409)

    itExist = True if query.is_id_name_combo_exist(
        activity.id, activity.name) else False

    if not itExist:
        log.error("L'activité n'existe pas")
        abort(404)

    new_activity = query.update_activity(activity, new_name)
    return jsonify(new_activity.asDictionnary()), 201


@activity.route('<id>', methods=['DELETE'])
@project_manager_required
@schema.validate(activity_delete_schema)
def delete_activity(id):
    """
    Permet de supprimer une activité.
    """
    connection = get_db().get_connection()
    query = ActivityRequest(connection)

    id = escape(id).strip()

    number = query.countTimeline(id)
    number = number['nbLignesDeTemps']
    if number > 0:
        return jsonify({'error': 'attention l\'activité a des'
                        ' lignes de temps associées'}), 412

    query.delete_activity(id)
    return jsonify(""), 200


@activity.errorhandler(JsonValidationError)
def validation_error(e):
    errors = [validation_error.message for validation_error in e.errors]
    return jsonify({'error': e.message, 'errors': errors}), 400