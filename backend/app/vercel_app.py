"""
Vercel-compatible entry point for FastAPI backend
"""
from app.main import app

# Vercel requires the app to be named 'app' or exported
handler = app
