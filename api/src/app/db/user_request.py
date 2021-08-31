from .database import Database
from ..domain.user import User


class UserRequest:
    def __init__(self, connection):
        self.connection = connection

    def select_all_user(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select user.id, first_name, last_name, email,"
            " role_id, isActive, role_name, access_level "
            "from user "
            "inner join role on user.role_id = role.id "
            "where isActive = 1"
        )
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_user_by_filter(self, user, role_name):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select user.id, first_name, last_name, email,"
            " role_id, isActive, role_name, access_level "
            "from user "
            "inner join role on user.role_id = role.id "
            "where isActive = 1 and user.id LIKE %s "
            "and first_name LIKE %s and last_name LIKE %s "
            "and email LIKE %s and role_name LIKE %s",
            (
                "%" + user.id + "%",
                "%" + user.first_name + "%",
                "%" + user.last_name + "%",
                "%" + user.email + "%",
                "%" + role_name + "%",
            ),
        )
        data = cursor.fetchall()
        cursor.close()
        return data

    def delete_user(self, user_id, email):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "update user set isActive = %s where id = %s and email = %s",
            (
                False,
                user_id,
                email,
            ),
        )
        self.connection.commit()
        cursor.close()

    def select_one_user(self, user):
        """
        Permet de sélectionner un utilisateur actif soit par son email ou son
        identifiant.
        """

        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select user.id, first_name, last_name, email,"
            " role_name from user "
            "inner join role on user.role_id = role.id where"
            " email = %s or user.id = %s and isActive = 1",
            (
                user.email,
                user.id,
            ),
        )
        data = cursor.fetchone()
        cursor.close()
        return data

    def is_id_email_combo_exist(self, id, email):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select * from user where email = %s and id = %s",
            (
                email,
                id,
            ),
        )
        data = cursor.fetchone()
        cursor.close()
        return True if data else False

    def email_in_use(self, id, email):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select * from user where email = %s",
            (email,),
        )
        data = cursor.fetchone()
        cursor.close()
        return data

    def update_user(self, user, new_email):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "update user set first_name = %s, last_name = %s, "
            "email = %s, role_id = %s where id = %s and email = %s",
            (
                user.first_name,
                user.last_name,
                new_email,
                user.role_id,
                user.id,
                user.email,
            ),
        )
        self.connection.commit()
        cursor.close()
        user.email = new_email
        return user

    def insert_user(self, user, hashed_password, salt):
        """
        Permet d'Insère un nouvel utilisateur dans la base de données.
        La fonctionne retourne un utilisateur avec son nouvel identifiant.
        """
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "insert into user(first_name, last_name, email,"
            " hashed_password, salt, isActive, role_id)"
            " values(%s, %s, %s, %s, %s, %s, %s)",
            (
                user.first_name,
                user.last_name,
                user.email,
                hashed_password,
                salt,
                True,
                user.role_id,
            ),
        )
        self.connection.commit()
        id = cursor.lastrowid
        cursor.close()
        user.id = id
        return user

    def get_public_user_info(self, email):
        """
        Permet d'obtenir les informations d'un utilisateur non sensible.
        """
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select first_name, last_name, email from user where email = %s",
            (email,),
        )
        data = cursor.fetchone()
        cursor.close()
        return data
