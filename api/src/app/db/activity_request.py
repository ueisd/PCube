from .database import Database
from ..domain.activity import Activity


class ActivityRequest:
    def __init__(self, connection):
        self.connection = connection

    def select_all_activity(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select activity.*, count(timeline.id) as nbLignesDeTemps"
            " from activity LEFT JOIN timeline ON activity.id ="
            " timeline.activity_id GROUP BY activity.id"
        )
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_activity_by_filter(self, activity):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select activity.*, count(timeline.id) as"
            " nbLignesDeTemps from activity  LEFT JOIN"
            " timeline ON activity.id = timeline.activity_id"
            " WHERE activity.name LIKE %s and activity.id"
            " LIKE %s GROUP BY activity.id",
            ("%" + activity.name + "%", "%" + activity.id + "%"),
        )
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_one_activity(self, name):
        """
        Permet de sélectionner une activité selon son nom.
        Retourne un dictionnaire avec l'activité selon le nom des colonnes.
        """
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("select * from activity where name = %s", (name,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def countTimeline(self, id):
        """
        Permet de compter le nombre de lignes de temps associé à l'activité
        Retourne un chiffre
        """
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select count(timeline.id) as nbLignesDeTemps from timeline"
            " where timeline.activity_id = %s",
            (id,),
        )
        data = cursor.fetchone()
        cursor.close()
        return data

    def insert_activity(self, activity):
        """
        Permet d'ajouter une activité dans la base de données.
        La fonctionne retourne une activité avec son nouvel identifiant.
        """
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "insert into activity(name) values(%s)", (activity.name,)
        )
        self.connection.commit()
        activity.id = cursor.lastrowid
        cursor.close()
        return activity

    def update_activity(self, activity, new_name):
        """
        Modifiy une activité existante et retourne une nouvelle activité
        avec l'identifiant de l'activité modifié.
        """
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "update activity set name = %s" " where name = %s and id = %s",
            (new_name, activity.name, activity.id),
        )
        self.connection.commit()
        cursor.close()
        activity.name = new_name
        return activity

    def delete_activity(self, activity_id):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "delete from activity where id = %s",
            (activity_id,),
        )
        self.connection.commit()
        cursor.close()

    def is_id_name_combo_exist(self, id, name):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select * from activity where id = %s and name = %s", (id, name)
        )
        data = cursor.fetchone()
        cursor.close()
        return True if data else False
