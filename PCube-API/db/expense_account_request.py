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
        cursor.execute("select * from expense_account where parent_id = id")
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_all(self):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from expense_account")
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_all_parent_by_filter(self, expense_account):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select a.*, count(t.id) as nbLignesDeTemps"
                       " from expense_account a  LEFT JOIN timeline t"
                       " ON a.id = t.expense_account_id"
                       " where a.parent_id = a.id and a.name LIKE ?"
                       " GROUP BY a.id",
                       ('%'+expense_account.name+'%',))
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_expense_account_one_level_filter(self, expense_account):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from expense_account where name"
                       " LIKE ? and id LIKE ?",
                       ('%'+expense_account.name+'%',
                        '%'+expense_account.id+'%'))
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_expense_account_name_like(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute(
            "select * from expense_account where name like ?",
            ('%' + name + '%',))
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_all_expense_account_from_parent(self, parent_id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select a.*, count(t.id) as nbLignesDeTemps"
                       " from expense_account a  LEFT JOIN timeline t"
                       " ON a.id = t.expense_account_id"
                       " where a.parent_id = ? and a.parent_id != a.id"
                       " GROUP BY a.id",
                       (parent_id,))

        data = cursor.fetchall()
        cursor.close()
        return data

    def select_one_expense_account(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from expense_account where name = ?",
                       (name,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def select_one_expense_account_by_id(self, id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from expense_account where id = ?",
                       (id,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def delete_expense_account(self, id, name):
        """
        Permet de supprimer un compte de dépense
        """
        cursor = self.connection.cursor()
        cursor.execute("delete from expense_account where id = ? and name = ?",
                       (id, name,))
        self.connection.commit()
        cursor.close()

    def is_id_name_combo_exist(self, id, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from expense_account where name = ?"
                       " and id = ?", (name, id,))
        data = cursor.fetchone()
        cursor.close()
        return True if data else False

    def has_child(self, id, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from expense_account where parent_id = ?"
                       " and name != ?",
                       (id, name,))
        data = cursor.fetchone()
        cursor.close()
        return True if data else False

    def is_in_timeline_table(self, id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from timeline where expense_account_id = ?",
                       (id,))
        data = cursor.fetchone()
        cursor.close()
        return True if data else False

    def create_expense_account_by_parent_id(self, expense_account):
        cursor = self.connection.cursor()
        if(expense_account.parent_id >0):
            cursor.execute("Insert into expense_account(name, parent_id) "
                           "Values(?, ?) ", (expense_account.name, expense_account.parent_id))
            self.connection.commit()
            expense_account.id = cursor.lastrowid
        else:
            cursor.execute("Insert into expense_account(name, parent_id) "
                           "Values(?, ?) ", (expense_account.name, None))
            self.connection.commit()
            expense_account.id = cursor.lastrowid
            expense_account.parent_id = expense_account.id
            cursor.execute("update expense_account set parent_id = ? where id = ?",
                       (expense_account.parent_id, expense_account.id))
            self.connection.commit()
        cursor.close

        return expense_account

    def update_expense_account(self, expense_account, new_expense_account):
        """
        Modify un compte de dépense existante et retourne un nouveau compte
        avec l'identifiant de l'activité modifié.
        """
        cursor = self.connection.cursor()
        cursor.execute("update expense_account set name = ?, parent_id = ?"
                       " where name = ? and id = ?",
                       (new_expense_account.name,
                        new_expense_account.parent_id, expense_account.name,
                        expense_account.id))
        self.connection.commit()
        cursor.close()
        new_expense_account.id = expense_account.id
        return new_expense_account

    def update_expense_account_std(self, accountTime):
        """
        Modifiy un compte de dépense et retourne le compte de dépense modifié
        avec l'identifiant de l'activité modifié.
        """
        cursor = self.connection.cursor()
        cursor.execute("update expense_account set name = ?, parent_id = ?"
                       " where id = ?",
                       (accountTime.name, accountTime.parent_id,
                        accountTime.id))
        self.connection.commit()
        cursor.close()
        return accountTime
