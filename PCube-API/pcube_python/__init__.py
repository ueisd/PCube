import os
from flask import Flask
from .main import main
from .auth_routes import auth
from .project_routes import project
from .activity_routes import activity
from .user_routes import user
from flask_jwt_extended import JWTManager
from .expense_account_routes import expense_account
from .timeline_routes import timeline


def create_app():

    app = Flask(__name__)

    app.config.from_json(os.path.join('../resources', 'config.json'))

    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(project, url_prefix='/api/project')
    app.register_blueprint(activity, url_prefix='/api/activity')
    app.register_blueprint(user, url_prefix='/api/user')
    app.register_blueprint(expense_account, url_prefix='/api/expense-account')
    app.register_blueprint(timeline, url_prefix='/api/timeline')

    JWTManager(app)

    return app