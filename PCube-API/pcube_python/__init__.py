import os
from flask import Flask
from .main import main
from .autre_routes import test

def create_app():

    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY='/B3o-p8-9iua`3421~FS',
        DATABASE=os.path.join(app.instance_path, 'db/database/pcube.db'),
        JSON_AS_ASCII=False,
        JSON_SORT_KEYS=False
    )

    app.register_blueprint(main)
    app.register_blueprint(test)

    return app