class Timeline:

    def __init__(self):
        self.id = ""
        self.day_of_week = ""
        self.punch_in = ""
        self.punch_out = ""
        self.project_id = ""
        self.accounting_time_category_id = ""
        self.activity_id = ""
        self.user_id = ""

    def asDictionary(self):
        return {
            "id": self.id,
            "day_of_week": self.day_of_week,
            "punch_in": self.punch_in,
            "punch_out": self.punch_out,
            "project_id": self.project_id,
            "accounting_time_category_id": self.accounting_time_category_id,
            "activity_id": self.activity_id,
            "user_id": self.user_id
        }