from flask import current_app
import mysql.connector
from mysql.connector import errorcode


class Database:
    """
    Classe pour représenter la base de données.
    """

    def __init__(self):
        self.connection = None

    def connect(self):
        host = current_app.config["DATABASE_URL"]
        usr = current_app.config["DATABASE_USER"]
        pwd = current_app.config["DATATBASE_PASSWORD"]
        db = current_app.config["DATABASE"]
        try:
            cnx = mysql.connector.connect(
                host=host,
                user=usr,
                password=pwd,
                database=db,
            )
            return cnx
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_BAD_DB_ERROR:
                try:
                    # @toto : vérifier que la création de bd fonctionne
                    print("Database does not exist")
                    connection = mysql.connector.connect(
                        host=host, user=usr, password=pwd
                    )
                    connection.cursor().execute(
                        "CREATE DATABASE IF NOT EXISTS %s", (db)
                    )
                    connection.close()
                    return self.connect()
                except:
                    print(err)
                    print("Cannot create the DB")
                    cnx.close()
                    return None
            else:
                print(err)
        else:
            cnx.close()

    def get_connection(self):
        """
        Retourne la connection à la base de données.
        """
        if self.connection is None:
            self.connection = self.connect()
        return self.connection

    def disconnect(self):
        """
        Déconnecte la connection à la base de données.
        """
        if self.connection is not None:
            self.connection.close()
