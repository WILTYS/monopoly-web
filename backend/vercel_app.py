"""
Vercel Serverless adapter pour FastAPI
"""
from main import socket_app

# Vercel utilise cette variable pour les serverless functions
app = socket_app
