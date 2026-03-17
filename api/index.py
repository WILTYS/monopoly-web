"""
Vercel Serverless Function pour le backend
"""
import sys
import os

# Ajouter le dossier backend au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main_vercel import app

# Handler pour Vercel
def handler(request, context):
    return app(request, context)
