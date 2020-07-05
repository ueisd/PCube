import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.timeline import Timeline

class TimelineRequest:

    def __init__(self, connection):
        self.connection = connection

    def insert(self, timeline_dict):
        """
        Permet d'insère une nouvelle ligne de temps dans la base de données.
        La fonctionne retourne une ligne de temps avec son nouvel identifiant.
        """
        
        cursor = self.connection.cursor()
        cursor.execute("insert into timeline(day_of_week, punch_in, punch_out, project_id, accounting_time_category_id, activity_id, user_id)"
                       " values(?, ?, ?, ?, ?, ?, ?)",
                       (timeline_dict["day_of_week"], timeline_dict["punch_in"], timeline_dict["punch_out"], timeline_dict["project_id"], timeline_dict["accounting_time_category_id"], timeline_dict["activity_id"], timeline_dict["user_id"]))
        self.connection.commit()
        id = cursor.lastrowid
        cursor.close()
        timeline_dict["id"] = id
        return timeline_dict