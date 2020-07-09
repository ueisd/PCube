class Activity:

    def __init__(self):
        self.id = ""
        self.name = ""
        

    def asDictionnary(self):
        return {
            "id": self.id,
            "name": self.name,                   
        }
