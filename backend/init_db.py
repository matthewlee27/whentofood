from app import db, app

# Force database creation inside the application context
with app.app_context():
    db.create_all()

print("✅ Database initialized successfully!")