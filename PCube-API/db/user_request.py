import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.activity import Activity

class UserRequest:

    def __init__(self, connection):
        self.connection = connection

    def select_all_user(self):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select first_name, last_name, email, role_id, isActive from user")
        data = cursor.fetchall()
        cursor.close()
        return data

    def delete_user(self, user_id, email):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("update user set isActive = false where id = ? and email = ?", (user_id, email,))
        cursor.execute("select first_name, last_name, email, role_id, isActive from user where id = ? and email = ?", (user_id, email,))
        data = cursor.fetchall()
        cursor.close()
        return data
def select_one_user(self, email):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select first_name, last_name, email, role_id, isActive from user where email = ?",
        (email,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def insert_user(self, user):
		 """
        Permet d'Insère un nouvel utilisateur dans la base de données.
        La fonctionne retourne un utilisateur avec son nouvel identifiant.
        """
        
        cursor = self.connexion.cursor()
        cursor.execute("insert into user(prenom, nom,"
                       " email, mot_de_passe, salt)"
                       " values(?, ?, ?, ?, ?)",
                       (user.prenom, user.nom, user.email,
                        user.mot_de_passe, user.salt))
        self.connexion.commit()
        id = cursor.lastrowid
        cursor.close()
        user.id = id
        return user

