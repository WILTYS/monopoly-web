# 🎲 Monopoly Web — Full Stack SaaS

## 🚀 Vision

Jeu Monopoly multijoueur en ligne avec:
- ⚡ Temps réel (WebSocket)
- 🎨 UX moderne & animations fluides
- 📱 Mobile + Desktop responsive
- 💰 Monétisable (skins, premium rooms)
- 🤖 IA optionnelle

## 🏗️ Architecture

```
Frontend (Next.js 15 + React)
    ↓
WebSocket Layer
    ↓
Game Engine (FastAPI)
    ↓
MongoDB
```

## 📦 Stack Technique

### Frontend
- **Next.js 15** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Socket.io Client** — WebSocket

### Backend
- **FastAPI** — API moderne Python
- **Socket.io** — Temps réel
- **MongoDB** — Database
- **Pydantic** — Validation
- **Redis** (optionnel) — Cache & pub/sub

## 🎮 Features

### Phase 1 — MVP
- [x] Plateau interactif
- [x] Déplacement joueurs
- [x] Tour par tour
- [x] Lancer de dés

### Phase 2 — Gameplay
- [ ] Achat propriétés
- [ ] Gestion argent
- [ ] Loyers
- [ ] Cartes Chance/Communauté
- [ ] Prison

### Phase 3 — Multiplayer
- [ ] Lobby & rooms
- [ ] Code room
- [ ] Reconnect auto
- [ ] Chat

### Phase 4 — Premium
- [ ] Skins plateau
- [ ] Avatars custom
- [ ] Statistiques
- [ ] Leaderboard

## 🚀 Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### MongoDB
```bash
docker run -d -p 27017:27017 --name monopoly-mongo mongo:latest
```

## 📁 Structure

```
monopoly/
├── frontend/           # Next.js app
│   ├── app/           # Pages & routes
│   ├── components/    # React components
│   ├── lib/           # Utils & game logic
│   └── public/        # Assets
│
├── backend/           # FastAPI server
│   ├── main.py       # Entry point
│   ├── models/       # Pydantic models
│   ├── game/         # Game engine
│   ├── routes/       # API routes
│   └── websocket/    # Socket handlers
│
└── README.md
```

## 🎯 Game Engine

### Entités principales
- `Game` — État partie
- `Player` — Joueur
- `Board` — Plateau
- `Property` — Propriété
- `Dice` — Dés
- `Turn` — Tour

### Loop principale
```python
roll_dice() → move_player() → trigger_case() → handle_action() → next_turn()
```

## 💸 Monétisation

- **Free** — 5 parties/jour
- **Premium** ($9.99/mois)
  - Parties illimitées
  - Skins exclusifs
  - Rooms privées
  - Stats avancées

## 📱 Responsive

- Desktop: Plateau central + sidebar
- Mobile: Plateau plein écran + bottom sheet

## 🔒 Légal

Version "inspirée" du Monopoly avec:
- Noms de propriétés custom
- Design original
- Règles adaptées

## 🎨 Design System

- **Colors**: Tailwind palette
- **Typography**: Inter font
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📊 Metrics

- Temps moyen partie: 30-45min
- Joueurs: 2-6
- Cases: 40
- Propriétés: 28

---

**Built with ❤️ for modern web gaming**
