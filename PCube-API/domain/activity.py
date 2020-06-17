class Activity:

    def __init__(self, name):
        self.id = -1
        self.name = name
        

    def asDictionnary(self):
        return {
            "id": self.id,
            "name": self.name,                   
        }
