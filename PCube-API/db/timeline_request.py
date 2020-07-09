import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.timeline import Timeline
from ..domain.timelineFilter import TimelineFilter

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
        " user.first_name as first_name, user.last_name as last_name from timeline" 
        " inner join project on timeline.project_id = project.id"
        " inner join activity on timeline.activity_id = activity.id"
        " inner join accounting_time_category on timeline.accounting_time_category_id = accounting_time_category.id "
        " inner join user on timeline.user_id = user.id"
        " where day_of_week LIKE ? and project.name LIKE ? and activity.name LIKE ? and "
        " (user.first_name LIKE ? or user.last_name LIKE ?) and accounting_time_category.name LIKE ? ORDER BY day_of_week DESC LIMIT 25",
        ('%'+timeline.day_of_week+'%', '%'+timeline.project_name+'%', '%'+timeline.activity_name+'%', 
        '%'+timeline.member_name+'%', '%'+timeline.member_name+'%', '%'+timeline.accounting_time_category_name+'%'))
        data = cursor.fetchall()
        cursor.close()
        return data

    def delete_timeline(self, timeline):
        """
        Permet de supprimer une timeline
        """
        cursor = self.connection.cursor()
        cursor.execute("delete from timeline where id = ? and day_of_week = ? and punch_in = ? and punch_out = ?", 
        (timeline.id, timeline.day_of_week, timeline.punch_in, timeline.punch_out))
        self.connection.commit()
        cursor.close()

    def get_timeline_by_id(self, id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute(
        "select * from timeline where id = ?",(id,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def update(self, timeline):
        cursor = self.connection.cursor()
        cursor.execute("update timeline set day_of_week = ?, punch_in = ?, punch_out = ?, project_id = ?," 
        " accounting_time_category_id = ?, activity_id = ?, user_id = ? where id = ?", 
                        (timeline.day_of_week, timeline.punch_in, timeline.punch_out, timeline.project_id,
                        timeline.accounting_time_category_id, timeline.activity_id, timeline.user_id, timeline.id))
        self.connection.commit()
        cursor.close()