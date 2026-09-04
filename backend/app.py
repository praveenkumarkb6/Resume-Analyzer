import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from routes.analyze import analyze_bp

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = BASE_DIR / "uploads"
MAX_UPLOAD_SIZE = 5 * 1024 * 1024


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_SIZE
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

    allowed_origins = os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    CORS(app, origins=[origin.strip() for origin in allowed_origins])
    app.register_blueprint(analyze_bp)

    @app.errorhandler(413)
    def request_too_large(_error):
        return jsonify({
            "status": "error",
            "message": "File size must be less than 5 MB",
        }), 413

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({
            "status": "error",
            "message": "Endpoint not found",
        }), 404

    @app.errorhandler(500)
    def internal_server_error(_error):
        return jsonify({
            "status": "error",
            "message": "Internal server error",
        }), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
