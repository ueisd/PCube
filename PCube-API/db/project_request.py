import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.activity import Activity


class ProjectRequest:

    def __init__(self, connection):
        self.connection = connection

    def select_all_parent(self):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from project where parent_id = id")
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_all_project_from_parent(self, parent_id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from project where parent_id = ? and parent_id != id",
        (parent_id,))
        data = cursor.fetchall()
        cursor.close()
        return data
    
    def select_all_activity(self):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from activity")
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
        cursor.execute("select * from activity where upper(name) = upper(?)", (name,))
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

    def update_activity(self, activity, newActivity):
        """
        Modifiy une activité existante et retourne une nouvelle activité
        avec l'identifiant de l'activité modifié.
        """
        cursor = self.connection.cursor()
        cursor.execute("update activity set name = ? where name = ? and id = ?", 
            (newActivity.name, activity.name, activity.id))
        self.connection.commit()
        cursor.close()
        newActivity.id = activity.id
        return newActivity
