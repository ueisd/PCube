import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .routes.main import main
from .routes.auth_routes import auth
from .routes.project_routes import project
from .routes.activity_routes import activity
from .routes.user_routes import user
from .routes.expense_account_routes import expense_account
from .routes.timeline_routes import timeline
from .routes.utils_routes import utils
from .debugger import initialize_flask_server_debugger_if_needed


def create_app():
    initialize_flask_server_debugger_if_needed()

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
