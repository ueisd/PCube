import sqlite3
from .database import Database
from .dict_factory import dict_factory


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
        cursor.execute("select * from project where parent_id = ?",
        (parent_id,))
        data = cursor.fetchall()
        cursor.close()
        return data