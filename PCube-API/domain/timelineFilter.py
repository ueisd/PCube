class TimelineFilter:

    def __init__(self):
        self.day_of_week = ""
        self.project_name = ""
        self.expense_account_name = ""
        self.activity_name = ""
        self.member_name = ""

    def asDictionary(self):
        return {
            "day_of_week": self.day_of_week,
            "project_name": self.project_name,
            "expense_account_name": self.expense_account_name,
            "activity_name": self.activity_name,
            "member_name": self.member_name
        }
