from flask import Flask
from flask import request
from flask import abort
from flask import make_response
from flask import jsonify
from flask import Blueprint
from flask import escape
from flask.logging import create_logger
from ..utility.auth import (
    auth_required, auth_refresh_required, AuthenticationError,
    admin_required, project_manager_required, member_required
)
import base64
import yaml
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

utils = Blueprint('utils', __name__)
app = Flask(__name__)
log = create_logger(app)

# On cherche le fichier de configuration
try:
    stream = open('config.yaml', 'r')
except IOError as e:
    print("Erreur avec le fichier en lecture : ", e.strerror)
content = yaml.load(stream, Loader=yaml.FullLoader)

@utils.route('/contact-us', methods=['POST'])
@auth_required
def email_comment():
    """
    Permet d'envoyer un courriel avec un commentaire.
    """
    data = request.json
    last_name = escape(data['last_name'].strip())
    first_name = escape(data['first_name'].strip())
    email = escape(data['email'].strip())
    comment = data['comment'].strip()

    if last_name is None:
        log.error("Le nom de famille est manquant!")
        abort(404)
    if first_name is None:
        log.error("Le prenom est manquant!")
        abort(404)
    if email is None:
        log.error("L'adresse courriel est manquant!")
        abort(404)
    if comment is None:
        log.error("Le commentaire est manquant!")
        abort(404)

    send_email(last_name, first_name, email, comment)
    return jsonify(last_name, first_name, email, comment)

def send_email(last_name, first_name, email, comment):
    username = content['accounts']['gmail']['username']
    password = content['accounts']['gmail']['password']

    source = username
    destination = username
    subject = "Commentaire Utilisateur"
    body = "Utilisateur: "
    body += first_name
    body += ", "
    body += last_name
    body += " ("
    body += email
    body += ")"
    body += "\n\nCommentaire : \n"
    body += comment

    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = source
    msg['To'] = destination
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com:587')
    server.ehlo()
    server.starttls()
    server.login(username, password)
    text = msg.as_string()

    server.sendmail(source, destination, text)
    server.quit()