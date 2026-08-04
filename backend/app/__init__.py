import os

from flask import Flask
from flask_cors import CORS

from .extensions import db


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
        app.instance_path, "expenses.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    CORS(app)

    from .routes import expenses_bp

    app.register_blueprint(expenses_bp)

    with app.app_context():
        db.create_all()

    return app
