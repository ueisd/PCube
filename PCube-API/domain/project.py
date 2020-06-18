class Project:

    def __init__(self, id, name, parent_id):
        self.id = id
        self.name = name
        self.parent_id = parent_id
        self.child = {}
        

    def asDictionary(self):
        return {
            "id": self.id,
            "name": self.name,            
            "parent_id": self.parent_id,
            "childs": self.child       
        }
