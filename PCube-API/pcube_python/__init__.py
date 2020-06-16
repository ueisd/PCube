import os
from flask import Flask
from .main import main
from .autre_routes import test
from .auth_routes import auth
from .project_routes import project
from flask_jwt_extended import JWTManager

def create_app():

    app = Flask(__name__)

    app.config.from_json(os.path.join('../resources', 'config.json'))

    app.register_blueprint(main)
    app.register_blueprint(test)
    app.register_blueprint(auth, url_prefix='/api')
    app.register_blueprint(project, url_prefix='/api')

    JWTManager(app)

    return app