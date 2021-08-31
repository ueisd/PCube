from .database import Database
from ..domain.timeline import Timeline
from ..domain.timelineFilter import TimelineFilter
from ..domain.accountRequestParams import AccountRequestParams


class TimelineRequest:
    def __init__(self, connection):
        self.connection = connection

    def insertMany(self, timeline_dict):
        """
        Permet d'insère les lignes de temps dans la base de données.
        La fonctionne retourne une ligne de temps avec son nouvel identifiant.
        """
        insertParams = []
        for timeline in timeline_dict:
            insertParams = insertParams + [
                timeline["day_of_week"],
                timeline["punch_in"],
                timeline["punch_out"],
                timeline["project_id"],
                timeline["expense_account_id"],
                timeline["activity_id"],
                timeline["user_id"],
            ]
        cursor = self.connection.cursor(dictionary=True)
        insertions = ["(%s, %s, %s, %s, %s, %s, %s)"] * len(timeline_dict)
        insertions = ", ".join(insertions)

        cursor.execute(
            "INSERT INTO timeline ("
            "day_of_week, punch_in, punch_out, project_id, expense_account_id, activity_id, user_id"
            ") VALUES " + insertions,
            insertParams,
        )
        self.connection.commit()
        cursor.close()

    def update(self, timelines):
        if len(timelines) > 0:
            insertParams = []
            for timeline in timelines:
                insertParams = insertParams + [
                    timeline.id,
                    timeline.day_of_week,
                    timeline.punch_in,
                    timeline.punch_out,
                    timeline.project_id,
                    timeline.expense_account_id,
                    timeline.activity_id,
                    timeline.user_id,
                ]
            insertions = ["(%s, %s, %s, %s, %s, %s, %s, %s)"] * len(timelines)
            insertions = ", ".join(insertions)
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(
                "INSERT INTO timeline("
                "   id, day_of_week, punch_in, punch_out, project_id, expense_account_id, activity_id, user_id"
                ") VALUES"
                + insertions
                + " ON CONFLICT(id) DO UPDATE SET day_of_week = EXCLUDED.day_of_week, "
                " punch_in = EXCLUDED.punch_in, punch_out = EXCLUDED.punch_out, "
                " project_id = EXCLUDED.project_id, expense_account_id = EXCLUDED.expense_account_id, "
                " activity_id = EXCLUDED.activity_id, user_id = EXCLUDED.user_id ",
                (insertParams),
            )

            self.connection.commit()
            cursor.close()

    def checkUniqueConstraint(self, timeline_dict):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "select * from timeline where user_id = %s"
            " and day_of_week = %s and"
            " punch_in = %s and punch_out = %s",
            (
                timeline_dict["user_id"],
                timeline_dict["day_of_week"],
                timeline_dict["punch_in"],
                timeline_dict["punch_out"],
            ),
        )
        data = cursor.fetchall()
        cursor.close()
        return False if data else True

    def select_by_filter(self, timeline):
        cursor = self.connection.cursor(dictionary=True)
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
            " where day_of_week LIKE %s and project.name LIKE %s"
            " and activity.name LIKE %s and "
            " (user.first_name LIKE %s or user.last_name LIKE %s)"
            " and expense_account.name LIKE %s"
            " ORDER BY day_of_week DESC",
            (
                "%" + timeline.day_of_week + "%",
                "%" + timeline.project_name + "%",
                "%" + timeline.activity_name + "%",
                "%" + timeline.member_name + "%",
                "%" + timeline.member_name + "%",
                "%" + timeline.expense_account_name + "%",
            ),
        )
        data = cursor.fetchall()
        cursor.close()
        return data

    def delete_timelines(self, timelinesIds):
        """
        Permet de supprimer une timeline
        """
        insertions = ["%s"] * len(timelinesIds)
        insertions = "(" + ", ".join(insertions) + ")"
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "DELETE FROM timeline WHERE id IN " + insertions, timelinesIds
        )
        self.connection.commit()
        cursor.close()

    def get_timeline_by_id(self, id):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("select * from timeline where id = %s", (id,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def fetchClauseFromReqParams(self, params):
        req = []

        if params.dateDebut != "":
            req.append(" t.day_of_week >= '" + params.dateDebut + "'")
        if params.dateFin != "":
            req.append(" t.day_of_week <= '" + params.dateFin + "'")
        if params.projects:
            req.append(
                " t.project_id IN ("
                + ",".join(map(str, params.projects))
                + ") "
            )
        if params.activitys:
            req.append(
                " t.activity_id IN ("
                + ",".join(map(str, params.activitys))
                + ") "
            )
        if params.users:
            req.append(
                " t.user_id IN (" + ",".join(map(str, params.users)) + ") "
            )

        clauseLignes = " AND ".join(map(str, req))

        if clauseLignes == "":
            clauseLignes = "1"
        return clauseLignes

    def get_timelines(self, params):
        clauseLignes = self.fetchClauseFromReqParams(params)
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("select t.* from timeline t where " + clauseLignes)
        data = cursor.fetchall()
        cursor.close()
        return data

    def get_accountTimeWithSum(self, params):

        clauseLignes = self.fetchClauseFromReqParams(params)
        cursor = self.connection.cursor(dictionary=True)

        getPunchin = (
            "CAST(TIME_TO_SEC(STR_TO_DATE(t.punch_in,'%H:%i'))/60 AS SIGNED)"
        )

        getPunchout = (
            "CAST(TIME_TO_SEC(STR_TO_DATE(t.punch_out,'%H:%i'))/60 AS SIGNED)"
        )

        punchDiff = getPunchout + " - " + getPunchin
        punchDiffInv = f"(1440-{getPunchin}) + {getPunchout}"

        cursor.execute(
            ""
            + f" select a.*, "
            + f" CAST(SUM("
            + f"  CASE"
            + f"    WHEN {clauseLignes}"
            + f"    THEN ("
            + f"      CASE "
            + f"        WHEN ({punchDiff} >0) THEN {punchDiff}"
            + f"        ELSE {punchDiffInv}"
            + f"      END"
            + f"    )"
            + f"  END"
            + f" ) AS SIGNED) as summline "
            + f" FROM expense_account a "
            + f" LEFT JOIN timeline t"
            + f"  ON a.id = t.expense_account_id"
            + f"  group by a.id"
        )
        data = cursor.fetchall()
        cursor.close()
        return data
