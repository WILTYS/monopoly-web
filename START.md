# 🚀 Démarrage Rapide — Monopoly Web

## ⚡ Quick Start (3 minutes)

### 1️⃣ Lancer la base de données

```bash
# Depuis la racine du projet
docker-compose up -d
```

### 2️⃣ Lancer le backend

```bash
cd backend

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Créer fichier .env
cp .env.example .env

# Lancer serveur
uvicorn main:socket_app --reload --host 0.0.0.0 --port 8000
```

✅ Backend disponible sur: http://localhost:8000

### 3️⃣ Lancer le frontend

```bash
# Nouveau terminal
cd frontend

# Installer dépendances
npm install

# Créer fichier .env.local
cp .env.local.example .env.local

# Lancer dev server
npm run dev
```

✅ Frontend disponible sur: http://localhost:3000

## 🎮 Tester le jeu

1. Ouvrir http://localhost:3000
2. Entrer votre nom
3. Cliquer "Créer une partie"
4. Partager le code avec des amis
5. Démarrer et jouer!

## 📁 Structure du Projet

```
monopoly/
├── backend/              # API FastAPI + WebSocket
│   ├── main.py          # Point d'entrée
│   ├── models/          # Modèles Pydantic
│   ├── game/            # Logique du jeu
│   └── requirements.txt
│
├── frontend/            # Application Next.js
│   ├── app/            # Pages & routes
│   ├── components/     # Composants React
│   ├── lib/            # Utils & API
│   └── package.json
│
├── docker-compose.yml  # MongoDB + Redis
└── README.md
```

## 🔧 Commandes Utiles

### Backend
```bash
# Tests
pytest

# Linter
black .
flake8

# Type checking
mypy .
```

### Frontend
```bash
# Build production
npm run build

# Linter
npm run lint

# Type checking
npm run type-check
```

### Docker
```bash
# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reset complet
docker-compose down -v
```

## 🐛 Troubleshooting

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Tuer le processus
kill -9 <PID>
```

### MongoDB ne démarre pas
```bash
# Vérifier Docker
docker ps

# Redémarrer
docker-compose restart mongodb
```

### Erreur de connexion WebSocket
- Vérifier que le backend tourne sur :8000
- Vérifier CORS dans backend/config.py
- Vérifier .env.local dans frontend

### Dépendances manquantes
```bash
# Backend
pip install -r requirements.txt --upgrade

# Frontend
rm -rf node_modules package-lock.json
npm install
```

## 📊 Monitoring

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### WebSocket Test
```bash
# Installer wscat
npm install -g wscat

# Tester connexion
wscat -c ws://localhost:8000/socket.io/?EIO=4&transport=websocket
```

## 🎨 Personnalisation

### Changer les couleurs
Éditer `frontend/tailwind.config.ts`

### Ajouter des propriétés
Éditer `backend/game/board.py`

### Modifier les règles
Éditer `backend/game/engine.py`

## 🚀 Prochaines Étapes

1. ✅ Tester le jeu localement
2. 📝 Lire DEPLOYMENT.md pour la prod
3. 🎨 Personnaliser l'UI
4. 💰 Ajouter la monétisation
5. 📱 Optimiser pour mobile

## 💡 Tips

- Utilisez plusieurs onglets pour tester le multijoueur
- Le code room est généré automatiquement
- Les parties sont stockées en mémoire (redémarrage = reset)
- MongoDB optionnel pour le dev (données en RAM)

## 📞 Besoin d'aide ?

- Lire le README.md complet
- Consulter DEPLOYMENT.md
- Vérifier les logs backend/frontend
- Ouvrir une issue GitHub

---

**Bon jeu! 🎲**
