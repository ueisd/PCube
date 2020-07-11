class ExpenseAccount:

    def __init__(self):
        self.id = -1
        self.name = ""
        self.parent_id = -1
        self.parent_name = ""
        self.child = {}
        

    def asDictionary(self):
        return {
            "id": self.id,
            "name": self.name,            
            "parent_id": self.parent_id,
            "parent_name": self.parent_name,
            "childs": self.child       
        }
