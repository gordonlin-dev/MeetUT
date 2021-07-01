from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

uri = os.getenv("DATABASE_URL")  # postgres -> postgresql workaround for Heroku
if uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri
db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'  # set the redirect route for login required routes
login_manager.login_message = ""  # Don't show a message

bcrypt = Bcrypt(app)

from flaskapp import routes  # Late import for initialization
