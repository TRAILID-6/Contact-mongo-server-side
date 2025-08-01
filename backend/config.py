from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from flask_caching import Cache
import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__)
# Correctly configure CORS to allow requests from your frontend's URL
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Configure the cache
app.config["CACHE_TYPE"] = "simple"  # Use a simple in-memory cache
app.config["CACHE_DEFAULT_TIMEOUT"] = 300  # Cache for 300 seconds (5 minutes)
cache = Cache(app)  # Initialize the cache

# Get the MongoDB URI from the environment variable
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)

# Select the database and collection
db = client["contacts_db"]
contacts_col = db["contacts"]
