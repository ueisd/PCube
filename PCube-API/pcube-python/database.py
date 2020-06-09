# coding=utf-8

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
            self.connection = sqlite3.connect('db/pcube.db')
        return self.connection

    def disconnect(self):
        """
        Déconnecte la connection à la base de données.
        """
        if self.connection is not None:
            self.connection.close()

    def get_role(self, id):
        """
        Recherche un rôle avec un identfiant.

        Paramètres
        ----------
        id : integer
            L'identifiant du rôle
        """
        cursor = self.get_connection().cursor()
        cursor.execute(("SELECT role_name FROM role "
                        "WHERE id = ?"), 
                       (id))
        role = cursor.fetchall()
        return role[0]