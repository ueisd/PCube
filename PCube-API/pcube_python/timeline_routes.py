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
from ..schemas.timeline_schema import (timeline_insert_schema, timeline_delete_schema, timeline_update_schema)
from ..db.timeline_request import TimelineRequest
from ..domain.timeline import Timeline
from ..domain.timelineFilter import TimelineFilter
from ..domain.treeGenerationParam import ChampsArbreParam
from ..domain.accountRequestParams import AccountRequestParams
from ..schemas.report_request_schema import report_request_schema
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

@timeline.route('', methods=['PUT'])
@auth_required
@schema.validate(timeline_update_schema)
def update_timeline_from_json_dict():
    """
    Reçois une ligne de temps en format JSON et update celle-ci avec les nouvelles informations.
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        data = request.json
        
        timeline = Timeline()
        timeline.id = escape(data["id"]).strip()
        timeline.punch_in = escape(data["punch_in"]).strip()
        timeline.punch_out = escape(data["punch_out"]).strip()
        timeline.project_id = escape(data["project_id"]).strip()
        timeline.activity_id = escape(data["activity_id"]).strip()
        timeline.accounting_time_category_id = escape(data["accounting_time_category_id"]).strip()
        timeline.user_id = escape(data["user_id"]).strip()
        timeline.day_of_week = escape(data["day_of_week"]).strip()

        get_authenticated_user()
        connection = get_db().get_connection()
        query = TimelineRequest(connection)
        query.update(timeline)


        return jsonify(""), 200

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
        timeline = TimelineFilter()
        timeline.day_of_week = escape(request.args.get('day_of_week', "")).upper().strip()
        timeline.accounting_time_category_name = escape(request.args.get('expense_name', "")).upper().strip()
        timeline.activity_name = escape(request.args.get('activity_name', "")).upper().strip()
        timeline.member_name = escape(request.args.get('member_name', "")).upper().strip()
        timeline.project_name = escape(request.args.get('project_name', "")).upper().strip()

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

## NE PAS SUPPRIMER CAR PERMET UN GAIN DE PERFORMANCE ET PERMET DE LIMITER L'ÉCRITURE DE REQUÊTE
##  FAVORISE L'EFFICACITÉ DE LA MAINTENANCE EN PERMETANT UNE PLUS GRANDE FACTORISATION DU CODE DE REQUETES COMPLEXES
def construireArbre(listeNoeuds, parent, champsParams):
    c =  champsParams
    if (parent == None or parent[c.id] == id): 
        return []
        
    parent[c.childs] = [node for node in listeNoeuds 
        if node[c.parentId] == parent[c.id]  
        and node[c.parentId] != node[c.id]
    ]
    for enfant in parent[c.childs]:
        enfant = construireArbre(listeNoeuds, enfant, c)
    return parent

def sommationAscendante(listeNoeuds, parent):
    parent['sumTotal'] = parent['summline']
    for enfant in parent['child']:
        enfant = sommationAscendante(listeNoeuds, enfant)
        if not parent['sumTotal']:
            parent['sumTotal'] = 0     
        if enfant['sumTotal']:
            parent['sumTotal'] = parent['sumTotal'] + enfant['sumTotal']
    return parent


@timeline.route('/testsum', methods=['POST'])
@auth_required
@schema.validate(report_request_schema)
def testsum():
    """
    Permet de tester la sommation de lignes de temps
    AuthenticationError : Si l'authentification de l'utilisateur échoue.
    """
    try:
        data = request.json
        params = AccountRequestParams()
        params.projects = data.get('projects')
        params.activitys = data.get('activitys')
        params.users = data.get('users')
        params.dateDebut = str(escape(data.get('dateDebut')).strip())
        params.dateFin = str(escape(data.get('dateFin')).strip())

        connection = get_db().get_connection()
        query = TimelineRequest(connection)
        timeline = query.get_accountTimeWithSum(params)

        if timeline:
            parents = [x for x in timeline if x['id'] == x['parent_id']]
            for parent in parents:
                parent = construireArbre(timeline, parent, ChampsArbreParam());
            for parent in parents:
                parent = sommationAscendante(parents, parent)
            return jsonify(parents), 200
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