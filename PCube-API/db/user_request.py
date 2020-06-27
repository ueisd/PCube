import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.user import User

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

    def is_id_email_combo_exist(self, id, email):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from user where email = ? and id = ?",
        (email, id))
        data = cursor.fetchone()
        cursor.close()
        return True if data else False

    def update_user(self, user, new_email):
        cursor = self.connection.cursor()
        cursor.execute("update user set first_name = ?, last_name = ?,"
                        "email = ?, role_id = ? where id = ? and email = ?", 
                        (user.first_name, user.last_name, new_email, user.role_id, user.id, user.email))
        self.connection.commit()
        cursor.close()
        user.email = new_email
        return user


    def insert_user(self, user, hashed_password, salt):
        """
        Permet d'Insère un nouvel utilisateur dans la base de données.
        La fonctionne retourne un utilisateur avec son nouvel identifiant.
        """
        
        cursor = self.connection.cursor()
        cursor.execute("insert into user(first_name, last_name, email, hashed_password, salt, isActive, role_id)"
                       " values(?, ?, ?, ?, ?, ?, ?)",
                       (user.first_name, user.last_name, user.email, hashed_password, salt, True, user.role_id))
        self.connection.commit()
        id = cursor.lastrowid
        cursor.close()
        user.id = id
        return user

