import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.expense_account import ExpenseAccount


class ExpenseAccountRequest:

    def __init__(self, connection):
        self.connection = connection

    def select_all_parent(self):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from accounting_time_category where parent_id = id")
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_account_name_like(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from accounting_time_category where name like ? limit 20", ('%' + name + '%',))
        data = cursor.fetchall()
        cursor.close()
        return data
    

    def select_all_account_from_parent(self, parent_id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from accounting_time_category where parent_id = ? and parent_id != id",
        (parent_id,))
        data = cursor.fetchall()
        cursor.close()
        return data
    
    def select_one_account(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from accounting_time_category where name = ?",
        (name,))
        data = cursor.fetchone()
        cursor.close()
        return data