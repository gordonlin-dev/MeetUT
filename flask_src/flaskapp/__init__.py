from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")  # key for cookies
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///memory.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

from flaskapp import routes  # Late import for initialization
