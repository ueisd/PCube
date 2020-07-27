import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.timeline import Timeline
from ..domain.timelineFilter import TimelineFilter
from ..domain.accountRequestParams import AccountRequestParams


class TimelineRequest:

    def __init__(self, connection):
        self.connection = connection

    def insert(self, timeline_dict):
        """
        Permet d'insère une nouvelle ligne de temps dans la base de données.
        La fonctionne retourne une ligne de temps avec son nouvel identifiant.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute("insert into timeline(day_of_week,"
                           " punch_in, punch_out,"
                           " project_id, expense_account_id,"
                           " activity_id, user_id)"
                           " values(?, ?, ?, ?, ?, ?, ?)",
                           (timeline_dict["day_of_week"],
                            timeline_dict["punch_in"],
                            timeline_dict["punch_out"],
                            timeline_dict["project_id"],
                            timeline_dict["expense_account_id"],
                            timeline_dict["activity_id"],
                            timeline_dict["user_id"]))
            self.connection.commit()
            id = cursor.lastrowid
            cursor.close()
            timeline_dict["id"] = id
        except sqlite3.Error:
            timeline_dict["id"] = -999
        finally:
            return timeline_dict

    def checkUniqueConstraint(self, timeline_dict):
        cursor = self.connection.cursor()
        cursor.execute("select * from timeline where user_id = ?"
                       " and day_of_week = ? and"
                       " punch_in = ? and punch_out = ?",
                       (timeline_dict["user_id"], timeline_dict["day_of_week"],
                        timeline_dict["punch_in"], timeline_dict["punch_out"]))
        data = cursor.fetchall()
        cursor.close()
        return False if data else True

    def select_by_filter(self, timeline):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute(
            "select timeline.id, day_of_week, punch_in, punch_out,"
            " project.name as project_name,"
            " activity.name as activity_name, expense_account.name"
            " as expense_name, "
            " user.first_name as first_name, user.last_name as last_name"
            " from timeline"
            " inner join project on timeline.project_id = project.id"
            " inner join activity on timeline.activity_id = activity.id"
            " inner join expense_account on"
            " timeline.expense_account_id ="
            " expense_account.id "
            " inner join user on timeline.user_id = user.id"
            " where day_of_week LIKE ? and project.name LIKE ?"
            " and activity.name LIKE ? and "
            " (user.first_name LIKE ? or user.last_name LIKE ?)"
            " and expense_account.name LIKE ?"
            " ORDER BY day_of_week DESC",
            ('%'+timeline.day_of_week+'%', '%'+timeline.project_name+'%',
             '%'+timeline.activity_name+'%', '%'+timeline.member_name+'%',
             '%'+timeline.member_name+'%',
             '%'+timeline.expense_account_name+'%'))
        data = cursor.fetchall()
        cursor.close()
        return data

    def delete_timeline(self, timeline):
        """
        Permet de supprimer une timeline
        """
        cursor = self.connection.cursor()
        cursor.execute("delete from timeline where id = ? and day_of_week = ?"
                       " and punch_in = ? and punch_out = ?",
                       (timeline.id, timeline.day_of_week, timeline.punch_in,
                        timeline.punch_out))
        self.connection.commit()
        cursor.close()

    def get_timeline_by_id(self, id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute(
            "select * from timeline where id = ?", (id,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def get_accountTimeWithSum(self, params):

        req = []

        if params.dateDebut != '':
            req.append(" t.day_of_week >= '" + params.dateDebut + "'")
        if params.dateFin != '':
            req.append(" t.day_of_week <= '" + params.dateFin + "'")
        if params.projects:
            req.append(
                " t.project_id IN (" + ','.join(map(str, params.projects))
                + ") ")
        if params.activitys:
            req.append(" t.activity_id IN (" +
                       ','.join(map(str, params.activitys)) + ") ")
        if params.users:
            req.append(
                " t.user_id IN (" + ','.join(map(str, params.users)) + ") ")

        clauseLignes = ' AND '.join(map(str, req))

        if(clauseLignes == ''):
            clauseLignes = '1'

        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select a.*, "
                       # partie permetant la différence d'heures en sql lite
                       # (language limité...))
                       + "SUM("
                       + " CASE WHEN  (" + clauseLignes + ")"
                       + " THEN ("
                       + "     CASE WHEN  ("
                       + "         (CAST(SUBSTR(t.punch_out, 1, 2) AS INT)*"
                       + "60 + CAST(SUBSTR(t.punch_out, 4, 2) AS INT))"
                       + "         - (CAST(SUBSTR(t.punch_in, 1, 2) AS INT)*"
                       + "60 + CAST(SUBSTR(t.punch_in, 4, 2) AS INT))"
                       + "     ) > 0 "
                       + "     THEN ("
                       + "         (CAST(SUBSTR(t.punch_out, 1, 2) AS INT)"
                       + "*60 + CAST(SUBSTR(t.punch_out, 4, 2) AS INT))"
                       + "         - (CAST(SUBSTR(t.punch_in, 1, 2) AS INT)*"
                       + "60 + CAST(SUBSTR(t.punch_in, 4, 2) AS INT))"
                       + "     )"
                       + "     ELSE ("
                       + "         (24-CAST(SUBSTR(t.punch_in, 1, 2) AS INT))*"
                       + "60 + CAST(SUBSTR(t.punch_in, 4, 2) AS INT)"
                       + "         + CAST(SUBSTR(t.punch_out, 1, 2) AS INT)*"
                       + "60 + CAST(SUBSTR(t.punch_out, 4, 2) AS INT)"
                       + "     )"
                       + "     END"
                       + " ) END"
                       + ") as summline "
                       + "from expense_account a LEFT JOIN timeline t"
                       + " ON a.id = t.expense_account_id"
                       + " group by a.id"
                       )
        # "DATEDIFF(year, '2017/08/25', '2011/08/25')"
        # "STR_TO_DATE(field_name, '%H:%i:%s %b %d, %Y PDT') AS new_time"
        data = cursor.fetchall()
        cursor.close()
        return data

    def update(self, timeline):
        cursor = self.connection.cursor()
        cursor.execute("update timeline set day_of_week = ?, punch_in = ?,"
                       " punch_out = ?, project_id = ?,"
                       " expense_account_id = ?, activity_id = ?, user_id = ?"
                       " where id = ?",
                       (timeline.day_of_week, timeline.punch_in,
                        timeline.punch_out, timeline.project_id,
                        timeline.expense_account_id, timeline.activity_id,
                        timeline.user_id, timeline.id))
        self.connection.commit()
        cursor.close()
