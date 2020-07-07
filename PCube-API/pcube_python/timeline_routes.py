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
from ..schemas.timeline_schema import (timeline_insert_schema, timeline_delete_schema)
from ..db.timeline_request import TimelineRequest
from ..domain.timeline import Timeline
from ..utility.auth import (get_authenticated_user,
                    auth_required, auth_refresh_required, AuthenticationError,
                    admin_required, project_manager_required, member_required
                    )

timeline = Blueprint('timeline', __name__)
app = Flask(__name__)
log = create_logger(app)
schema = JsonSchema(app)

@timeline.route('', methods=['POST'])
@auth_required
@schema.validate(timeline_insert_schema)
def create_timeline_from_json_dict():
    """
    Cette route reçois une liste JSON de ligne de temps et l'ajoute à la base de données
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        data = request.json
        timelines = data['timelines']
        
        get_authenticated_user()
        connection = get_db().get_connection()
        query = TimelineRequest(connection)

        for timeline in timelines:
            timeline = query.insert(timeline)


        return jsonify({"timelines":timelines}), 201

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@timeline.route('', methods=['DELETE'])
@auth_required
@schema.validate(timeline_delete_schema)
def delete_timeline():
    """
    Supprimer une ligne de temps de la BD.
    Les champs id, day_of_week, punch_in, punch_out doivent être présent pour confirmer la suppression.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        data = request.json
        timeline = Timeline()
        timeline.id = data["id"]
        timeline.day_of_week = data["day_of_week"]
        timeline.punch_out = data["punch_out"]
        timeline.punch_in = data["punch_in"]

        get_authenticated_user()
        connection = get_db().get_connection()
        query = TimelineRequest(connection)

        query.delete_timeline(timeline)

        return jsonify(""), 200

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@timeline.route('/filter', methods=['GET'])
@auth_required
def get_all_user():
    """
    Permet de faire une recherche selon des filtres pour trouver les éléments correspondants.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        timeline = Timeline()

        connection = get_db().get_connection()
        query = TimelineRequest(connection)
        data = query.select_by_filter(timeline)

        return jsonify(data), 200

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@timeline.route('/<id>', methods=['GET'])
@auth_required
def get_timeline_by_id(id):
    """
    Permet de faire une recherche selon des filtres pour trouver les éléments correspondants.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
    
        if not id or not id.isnumeric():
            log.error("L'identifiant n'est pas valide")
            abort(400)

        connection = get_db().get_connection()
        query = TimelineRequest(connection)
        timeline = query.get_timeline_by_id(id)

        if timeline:
            return jsonify(timeline), 200
        else:
            log.error("La ressource n'existe pas.")
            abort(404)

    except AuthenticationError as error:
        log.error('authentication error: %s', error)
        abort(403)

@timeline.errorhandler(JsonValidationError)
def validation_error(e):
    errors = [validation_error.message for validation_error in e.errors]
    return jsonify({'error': e.message, 'errors': errors}), 400