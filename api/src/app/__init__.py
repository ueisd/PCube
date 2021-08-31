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
from .routes.db_controller import get_db
from .db.database_preset import DatabasePreset


def create_app():
    initialize_flask_server_debugger_if_needed()

    app = Flask(__name__)
    CORS(app)
    app.config.from_json(os.path.join("./resources", "config.json"))
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    databasePassword = os.getenv("DATATBASE_PASSWORD")
    if databasePassword is not None and not not databasePassword:
        app.config["DATATBASE_PASSWORD"] = databasePassword

    databaseUser = os.getenv("DATABASE_USER")
    if databaseUser is not None and not not databaseUser:
        app.config["DATABASE_USER"] = databaseUser

    databaseHost = os.getenv("DATABASE_HOST")
    if databaseHost is not None and not not databaseHost:
        app.config["DATABASE_URL"] = databaseHost

    databaseDb = os.getenv("DATABASE_DB")
    if databaseDb is not None and not not databaseDb:
        app.config["DATABASE"] = databaseDb

    @app.before_first_request
    def activate_job():
        connection = get_db().get_connection()
        query = DatabasePreset(connection)

        if not query.getTables():
            query.executeFileSqL("/app/database/database.init.sql")
            if query.getTables():
                query.executeFileSqL("/app/database/database_data.init.sql")
                roles = query.getRoles()

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
