import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.project import Project


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

    def select_all(self):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from project")
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_all_parent_by_filter(self, project):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select p.*, count(t.id) as nbLignesDeTemps"
                       " from project p LEFT JOIN timeline t"
                       " ON p.id = t.project_id where p.parent_id = p.id"
                       " and p.name LIKE ? GROUP BY p.id",
                       ('%'+project.name+'%',))
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_project_name_like(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from project where name like ",
                       ('%' + name + '%',))
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_project_one_level_filter(self, project):
        """
        Permet de trouver les projects selon un filtre.
        Retourne un dictionnaire des correspondances.
        """
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from project where name LIKE ? and id LIKE ?"
                       " and parent_id LIKE ?",
                       ('%'+project.name+'%', '%'+project.id+'%',
                        '%'+project.parent_id+'%'))
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_all_project_from_parent(self, parent_id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select p.*, count(t.id) as nbLignesDeTemps from"
                       " project p LEFT JOIN timeline t"
                       " ON p.id = t.project_id  where p.parent_id = ?"
                       " and p.parent_id != p.id GROUP BY p.id",
                       (parent_id,))
        data = cursor.fetchall()
        cursor.close()
        return data

    def select_one_project(self, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from project where name = ?",
                       (name,))
        data = cursor.fetchone()
        cursor.close()
        return data

    def insert_project(self, project):
        """
        Permet d'ajouter une projet dans la base de données.
        La fonctionne retourne un projet avec son nouvel identifiant.
        """
        cursor = self.connection.cursor()

        isSelfRef = True if project.name == project.parent_name else False

        if(isSelfRef):
            cursor.execute("insert into project(name, parent_id)"
                           " values(?, ?)",
                           (project.name, None))
        else:
            cursor.execute("insert into project(name, parent_id)"
                           " values(?, ?)",
                           (project.name, project.parent_id))

        self.connection.commit()
        project.id = cursor.lastrowid
        cursor.close()

        if(isSelfRef):
            newProject = Project()
            newProject.parent_id = project.id
            newProject.name = project.name
            newProject.parent_name = project.parent_name
            project = self.update_project(project, newProject)

        return project

    def update_project(self, project, newProject):
        """
        Modifiy un projet existante et retourne un nouveau projet
        avec l'identifiant de l'activité modifié.
        """
        cursor = self.connection.cursor()
        cursor.execute("update project set name = ?, parent_id = ?"
                       " where name = ? and id = ?",
                       (newProject.name, newProject.parent_id, project.name,
                        project.id))
        self.connection.commit()
        cursor.close()
        newProject.id = project.id
        return newProject

    def is_id_name_combo_exist(self, id, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute(
            "select * from project where id = ? and name = ?",
            (id, name))
        data = cursor.fetchone()
        cursor.close()
        return True if data else False

    def update_project_std(self, project):
        """
        Modifiy un projet existante et retourne un nouveau projet
        avec l'identifiant de l'activité modifié.
        """
        cursor = self.connection.cursor()
        cursor.execute("update project set name = ?, parent_id = ?"
                       " where id = ?",
                       (project.name, project.parent_id, project.id))
        self.connection.commit()
        cursor.close()
        return project

    def delete_project(self, project_id, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute(
            "delete from project where id = ? and name = ?",
            (project_id, name))
        self.connection.commit()
        cursor.close()

    def has_child(self, id, name):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from project where parent_id = ?"
                       " and name != ?", (id, name,))
        data = cursor.fetchone()
        cursor.close()
        return True if data else False

    def is_in_timeline_table(self, id):
        self.connection.row_factory = dict_factory
        cursor = self.connection.cursor()
        cursor.execute("select * from timeline where project_id = ?",
                       (id,))
        data = cursor.fetchone()
        cursor.close()
        return True if data else False
