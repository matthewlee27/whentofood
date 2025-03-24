#methods of assigning weights to different scores

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class FoodRating(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    food_name = db.Column(db.String(100), nullable = False)
    rating = db.Column(db.Integer, nullable = False)
    time_submitted = db.Column(db.DateTime, nullable = False)