import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.activity import Activity

class UserRequest:

    def __init__(self, connection):
        self.connection = connection

    def select_all_user(self):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select first_name, last_name, email, role_id from user")
        data = cursor.fetchall()
        cursor.close()
        return data
