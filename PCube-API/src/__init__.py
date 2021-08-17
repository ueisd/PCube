import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .pcube_python.main import main
from .pcube_python.auth_routes import auth
from .pcube_python.project_routes import project
from .pcube_python.activity_routes import activity
from .pcube_python.user_routes import user
from .pcube_python.expense_account_routes import expense_account
from .pcube_python.timeline_routes import timeline
from .pcube_python.utils_routes import utils


def create_app():

    app = Flask(__name__)
    CORS(app)

    app.config.from_json(os.path.join("./resources", "config.json"))

    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(project, url_prefix="/api/project")
    app.register_blueprint(activity, url_prefix="/api/activity")
    app.register_blueprint(user, url_prefix="/api/user")
    app.register_blueprint(expense_account, url_prefix="/api/expense-account")
    app.register_blueprint(timeline, url_prefix="/api/timeline")
    app.register_blueprint(utils, url_prefix="/api/utils")

    JWTManager(app)

    return app
