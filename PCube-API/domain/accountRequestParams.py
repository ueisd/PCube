class AccountRequestParams:
    
    def __init__(self):
        self.projects = []
        self.dateDebut = ""
        self.dateFin = ""
        self.activitys = []
        self.users = []
        

    def asDictionnary(self):
        return {
            "projects": self.projects,
            "dateDebut": self.dateDebut,
            "dateFin": self.dateFin,
            "activitys": self.activitys,
            "users" : self.users,               
        }
