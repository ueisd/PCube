from .database import Database


class DatabasePreset:
    def __init__(self, connection):
        self.connection = connection

    def getTables(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("SHOW TABLES")
        result = cursor.fetchall()
        cursor.close()
        return result

    def getRoles(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM role")
        result = cursor.fetchall()
        cursor.close()
        return result

    def executeFileSqL(self, filename):
        """
        Execute les requêtes d'un fichier SQL

        Paramètres
        ----------
        filename : string
            l'adresse du fichier
        """
        with self.connection.cursor(dictionary=True) as cursor:
            with open(filename, "r") as f:
                results = cursor.execute(f.read(), multi=True)
                for cur in results:
                    print("cursor:", cur)
                    if cur.with_rows:
                        print("result:", cur.fetchall())
                # connexion.commit()
        self.connection.commit()
        cursor.close()
