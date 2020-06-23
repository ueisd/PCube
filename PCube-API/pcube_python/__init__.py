import os
from flask import Flask
from .main import main
from .autre_routes import test
from .auth_routes import auth
from .project_routes import project
from .activity_routes import activity
from .user_routes import user
from flask_jwt_extended import JWTManager


def create_app():

    app = Flask(__name__)

    app.config.from_json(os.path.join('../resources', 'config.json'))

    app.register_blueprint(main)
    app.register_blueprint(test)
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(project, url_prefix='/api/project')
    app.register_blueprint(activity, url_prefix='/api/activity')
    app.register_blueprint(user, url_prefix='/api/user')

    JWTManager(app)

    return app