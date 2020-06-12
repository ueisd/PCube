# coding=utf-8
from flask import Flask
from flask import jsonify
from flask import Blueprint
from flask_json_schema import JsonSchema
from flask_json_schema import JsonValidationError
from ..db.auth_request import AuthRequest
from .db_controller import get_db
from ..utility.auth import (
                    admin_required
                    )

test = Blueprint('test', __name__)


@test.route('/api/admin-sample', methods=['GET'])
@admin_required
def get_role():
    """
    Retourne un rôle avec un identifiant.
    """
    return {}
   