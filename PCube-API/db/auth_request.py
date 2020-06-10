import sqlite3
from .database import Database 

class AuthRequest:

    def __init__(self, connection):
        self.connection = connection

    def get_role(self, id):
        """
        Recherche un rôle avec un identfiant.

        Paramètres
        ----------
        id : integer
            L'identifiant du rôle
        """
        cursor = self.connection.cursor()
        cursor.execute(("SELECT role_name FROM role "
                        "WHERE id = ?"), 
                        (id))
        role = cursor.fetchall()
        return role[0]