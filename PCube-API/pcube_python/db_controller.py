from flask import Flask
from flask import g
from ..db.database import Database

app = Flask(__name__)

def get_db():
    """
    Cherche la base de données.
    """
    db = getattr(g, '_database', None)
    if db is None:
        g._database = Database()
    return g._database


@app.teardown_appcontext
def close_connection(exception):
    """
    Ferme la connection de la base de données.
    """
    db = getattr(g, '_database', None)
    if db is not None:
        db.disconnect()