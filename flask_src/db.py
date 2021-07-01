import os

from flaskapp import db
from flaskapp.models import User

db.create_all()
db.session.commit()
