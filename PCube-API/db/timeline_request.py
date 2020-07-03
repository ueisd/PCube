import sqlite3
from .database import Database
from .dict_factory import dict_factory
from ..domain.timeline import Timeline

class TimelineRequest:

    def __init__(self, connection):
        self.connection = connection