import os

from flaskapp import db

# Resets and creates a fresh DB
db.drop_all()
db.create_all()
db.session.commit()
