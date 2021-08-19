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
    e = 1234;
    return '<h1>Accueil</h1>', 200


@main.route('/api/role/<id>', methods=['GET'])
def get_role(id):
    """
    Retourne un rôle avec un identifiant.
    """
    connection = get_db().get_connection()
    request = AuthRequest(connection)
    role = request.get_role(id)
    return jsonify(role), 200


@main.route('/api/roles', methods=['GET'])
def get_roles():
    """
    Retourne tous les roles.
    """
    connection = get_db().get_connection()
    request = AuthRequest(connection)
    role = request.get_all_roles()
    return jsonify(role), 201
