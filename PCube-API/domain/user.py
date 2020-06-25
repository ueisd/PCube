class User:

    def __init__(self):
        self.user_id = -1
        self.first_name = ""
        self.last_name = ""
        self.email = ""
        self.isActive = false
        self.role_id = -1

    def asDictionary(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "isActive": self.isActive,
            "role_id": self.role_id
        }
