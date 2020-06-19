class Project:

    def __init__(self,):
        self.id = -1
        self.name = ""
        self.parent_id = -1
        

    def asDictionnary(self):
        return {
            "id": self.id,
            "name": self.name,            
            "parent_id": self.parent_id,          
        }
