class Role:

    def __init__(self):
        self.id = -1
        self.role_name = ""
        self.access_level = -1

    def asDictionary(self):
        return {
            "id": self.id,
            "role_name": self.role_name,
            "access_level": self.access_level
        }
