# coding=utf-8
from flask import Flask
from flask import jsonify
from flask import Blueprint
from flask_json_schema import JsonSchema
from flask_json_schema import JsonValidationError
from ..db.auth_request import AuthRequest

from .db_controller import get_db

test = Blueprint('test', __name__)


@test.route('/api/test/<id>', methods=['GET'])
def get_role(id):
    """
    Retourne un rôle avec un identifiant.
    """
    connection = get_db().get_connection()
    request = AuthRequest(connection)
    role = request.get_role(id)
    return jsonify(role)
   