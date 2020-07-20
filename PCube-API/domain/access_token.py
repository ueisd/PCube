class AccessToken:

    def __init__(self,):
        self.token = ""
        self.refresh_token = ""
        self.user_id = ""
        self.token_expire = ""
        self.refresh_expire = ""
        self.id = -1

    def asDictionnary(self):
        return {
            "id": self.id,
            "token": self.token,
            "refresh_token": self.refresh_token,
            "user_id": self.user_id,
            "refresh_expire": self.refresh_expire,
            "token_expire": self.token_expire,
        }
