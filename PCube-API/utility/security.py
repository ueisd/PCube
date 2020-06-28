import os
from base64 import b64encode
from flask import Flask
from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)

def generate_salt():
    salt = os.urandom(16)
    return b64encode(salt).decode('utf-8')

def encrypt_password(password, salt):
    """
    Permet de d'encrypter un mot de passe
    """
    return bcrypt.generate_password_hash(password + salt).decode('utf-8')

def is_password_valid(hashed_pass, password, salt):
    """
    Permet de valider le hash d'un mot de passe.
    """
    return bcrypt.check_password_hash(hashed_pass, password + salt)