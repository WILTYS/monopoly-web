"""
Vercel Serverless Function pour le backend FastAPI
"""
import sys
import os
from mangum import Mangum

# Ajouter le dossier backend au path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from main_vercel import app

# Handler Mangum pour Vercel
handler = Mangum(app, lifespan="off")
