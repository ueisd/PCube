import os
from flask import Flask
from .main import main
from .autre_routes import test
from .auth_routes import auth
from flask_jwt_extended import JWTManager

def create_app():

    app = Flask(__name__)

    app.config.from_json(os.path.join('../resources', 'config.json'))

    jwt = JWTManager(app)

    app.register_blueprint(main)
    app.register_blueprint(test)
    app.register_blueprint(auth, url_prefix='/api')

    return app