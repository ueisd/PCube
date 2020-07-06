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
    
    def select_by_filter(self, timeline):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute(
        "select timeline.id, day_of_week, punch_in, punch_out, project.name as project_name," 
        " activity.name as activity_name, accounting_time_category.name as expense_name, " 
        " user.first_name as first_name, user.last_name as last_name"
        " from timeline inner join project on timeline.project_id = project.id"
        " inner join activity on timeline.activity_id = activity.id"
        " inner join accounting_time_category on timeline.accounting_time_category_id = accounting_time_category.id "
        " inner join user on timeline.user_id = user.id"
        " where day_of_week LIKE ? ORDER BY day_of_week DESC LIMIT 25",
        ('%'+timeline.day_of_week+'%',))
        data = cursor.fetchall()
        cursor.close()
        return data