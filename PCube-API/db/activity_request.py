import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.activity import Activity

class ActivityRequest:

    def __init__(self, connection):
        self.connection = connection

    def select_all_activity(self):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from activity")
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_activity_by_filter(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from activity where name LIKE ?", ('%'+name+'%',))
        data = cursor.fetchall()
        cursor.close()
        return data
    
    def select_one_activity(self, name):
        """
        Permet de sélectionner une activité selon son nom.
        Retourne un dictionnaire avec l'activité selon le nom des colonnes.
        """
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from activity where name = ?", (name,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def insert_activity(self, activity):
        """
        Permet d'ajouter une activité dans la base de données.
        La fonctionne retourne une activité avec son nouvel identifiant.
        """
        cursor = self.connection.cursor()
        cursor.execute("insert into activity(name) values(?)",(activity.name,))
        self.connection.commit()
        activity.id = cursor.lastrowid
        cursor.close()
        return activity

    def update_activity(self, activity, new_name):
        """
        Modifiy une activité existante et retourne une nouvelle activité
        avec l'identifiant de l'activité modifié.
        """
        cursor = self.connection.cursor()
        cursor.execute("update activity set name = ? where name = ? and id = ?", 
            (new_name, activity.name, activity.id))
        self.connection.commit()
        cursor.close()
        activity.name = new_name
        return activity

    def is_id_name_combo_exist(self, id, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from activity where id = ? and name = ?",
        (id, name))
        data = cursor.fetchone()
        cursor.close()
        return True if data else False

