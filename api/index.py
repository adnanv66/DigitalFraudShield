import sys
import os

# Add backend directory to sys.path for Vercel serverless function handler
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.main import app
