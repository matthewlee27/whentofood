from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fooddata.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Define the database model
class FoodRating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    food_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

# Ensure database tables are created
with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return jsonify({"message": "Backend is running!"})

# API to submit a food rating
@app.route("/submit", methods=["POST"])

def submit_rating():
    try:
        data = request.json
        food_name = data.get("food_name")
        rating = data.get("rating")

        if not food_name or rating is None:
            return jsonify({"error": "Missing food name or rating"}), 400
        
        if (int(rating) <  1) or (int(rating) > 10):
            print("RECEIVED:", rating)
            return jsonify({"error": "Rating must be between 1-10"}), 400
        
        print("NOT RECEIVED:", rating)
        new_rating = FoodRating(food_name=food_name, rating=rating)
        db.session.add(new_rating)
        db.session.commit()

        return jsonify({"message": "Rating submitted!", "food_name": food_name, "rating": rating}), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Something went wrong"}), 500  # Return a proper error response
    
def remove_rating():


# API to get all food ratings
@app.route("/get-ratings", methods=["GET"])
def get_ratings():
    ratings = FoodRating.query.all()
    return jsonify({"ratings": [{"id": r.id, "food_name": r.food_name, "rating": r.rating} for r in ratings]})

if __name__ == "__main__":
    print("Starting Flask server...")
    print("Registered routes:", app.url_map)  # Debugging: Prints all active routes
    app.run(debug=True, port=5001)