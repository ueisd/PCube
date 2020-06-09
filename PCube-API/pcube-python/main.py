# coding=utf-8
from flask import Flask
from flask import g
from flask import jsonify
from flask import Blueprint
from flask_json_schema import JsonSchema
from flask_json_schema import JsonValidationError

from .database import Database

main = Blueprint('main', __name__)


def get_db():
    """
    Cherche la base de données.
    """
    db = getattr(g, '_database', None)
    if db is None:
        g._database = Database()
    return g._database


@main.teardown_app_request
def close_connection(exception):
    """
    Ferme la connection de la base de données.
    """
    db = getattr(g, '_database', None)
    if db is not None:
        db.disconnect()


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
    role = get_db().get_role(id)
    return jsonify(role)
   