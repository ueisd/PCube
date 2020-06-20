# coding=utf-8
from flask import Flask
from flask import jsonify
from flask import Blueprint
from flask_json_schema import JsonSchema
from flask_json_schema import JsonValidationError
from ..db.auth_request import AuthRequest

from .db_controller import get_db

main = Blueprint('main', __name__)

@main.route('/')
def start_page():
    """
    Route pour la page d'accueil.
    """
    return '<h1>Accueil</h1>' 


@main.route('/api/role/<id>', methods=['GET'])
def get_role(id):
    """
    Retourne un rôle avec un identifiant.
    """
    connection = get_db().get_connection()
    request = AuthRequest(connection)
    role = request.get_role(id)
    return jsonify(role)


@main.route('/api/role', methods=['GET'])
def get_roles():
    """
    Retourne un rôle avec un identifiant.
    """
    connection = get_db().get_connection()
    request = AuthRequest(connection)
    role = request.get_all_roles()
    return jsonify(role)
