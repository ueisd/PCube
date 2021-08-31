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
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(("SELECT role_name FROM role " "WHERE id = %s"), (id))
        role = cursor.fetchall()
        return role[0]

    def select_user(self, email):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("select * from user where email = %s", (email,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def select_role(self, role_id):
        """
        Permet d'obtenir le nom de l'accès
        """
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("select * from role where id = %s", (role_id,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def get_all_roles(self):
        """
        Permet d'obtenir tous les roles.
        """
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select * from role",
        )
        data = cursor.fetchall()
        cursor.close()
        return data
