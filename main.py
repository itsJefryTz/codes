from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
LOG_FILE = BASE_DIR / "logs" / "requests.log"
LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

def log_post(data: dict):
    timestamp = datetime.datetime.utcnow().isoformat()
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"{timestamp} - {data}\n")

@app.route("/api/v1/", methods=["POST"])
def receive_post():
    data = request.get_json()
    if not data:
        return jsonify({"error": "no JSON data received"}), 400

    log_post(data)
    return jsonify({"message": "post data logged"}), 201

if __name__ == "__main__":
    app.run(port=5000, debug=True)