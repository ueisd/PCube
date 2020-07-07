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

    def select_all_parent_by_filter(self, expense_account):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from accounting_time_category where parent_id = id and name LIKE ?",
        ('%'+expense_account.name+'%',))
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_expense_account_name_like(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from accounting_time_category where name like ? limit 20", ('%' + name + '%',))
        data = cursor.fetchall()
        cursor.close()
        return data
    

    def select_all_expense_account_from_parent(self, parent_id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from accounting_time_category where parent_id = ? and parent_id != id",
        (parent_id,))
        data = cursor.fetchall()
        cursor.close()
        return data
    
    def select_one_expense_account(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from accounting_time_category where name = ?",
        (name,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def create_expense_account(self, expense_account):
        cursor = self.connection.cursor()
        isSelfReference = expense_account.name == expense_account.parent_name

        if (isSelfReference):
            cursor.execute("Insert into accounting_time_category(name, parent_id) "
                           "Values(?, ?) ", (expense_account.name, None))
        else:
            cursor.execute("Insert into accounting_time_category(name, parent_id) "
                           "Values(?, ?) ", (expense_account.name, expense_account.parent_id))
        self.connection.commit()
        expense_account.id = cursor.lastrowid
        cursor.close

        if (isSelfReference):
            new_expense_account = ExpenseAccount()
            new_expense_account.parent_id = expense_account.id
            new_expense_account.name = expense_account.name
            new_expense_account.parent_name = expense_account.parent_name
            expense_account = self.update_expense_account(expense_account, new_expense_account)

        return expense_account

    def update_expense_account(self, expense_account, new_expense_account):
        """
        Modifiy un projet existante et retourne un nouveau projet
        avec l'identifiant de l'activité modifié.
        """
        cursor = self.connection.cursor()
        cursor.execute("update accounting_time_category set name = ?, parent_id = ? where name = ? and id = ?",
                       (new_expense_account.name, new_expense_account.parent_id, expense_account.name, expense_account.id))
        self.connection.commit()
        cursor.close()
        new_expense_account.id = expense_account.id
        return new_expense_account
