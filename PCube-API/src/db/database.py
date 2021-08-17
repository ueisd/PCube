import sqlite3


class Database:
    """
    Classe pour représenter la base de données.

    ...

    Méthodes
    --------
    get_connection(self)
        Retourne la connection à la base de données
    disconnect(self)
        Déconnecte la connection à la base de données
    """

    def __init__(self):
        self.connection = None

    def get_connection(self):
        """
        Retourne la connection à la base de données.
        """
        if self.connection is None:
            self.connection = sqlite3.connect('src/db/database/pcube.db')
        return self.connection

    def disconnect(self):
        """
        Déconnecte la connection à la base de données.
        """
        if self.connection is not None:
            self.connection.close()
