import sqlite3
from .database import Database
from .dict_factory import dict_factory

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

    def select_user(self, email):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from user where email = ?",
                       (email,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def select_role(self, role_id):
        """
        Permet d'obtenir le nom de l'accès
        """
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from role where id = ?",
                        (role_id,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def get_all_roles(self):
        """
        Permet d'obtenir le nom de l'accès
        """
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from role",
                        )
        data = cursor.fetchall()
        cursor.close()
        return data