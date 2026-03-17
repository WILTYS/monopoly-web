# 🚀 Déploiement Vercel Monorepo — Frontend + Backend

## 📦 Architecture

```
monopoly/
├── frontend/          → Next.js (Vercel)
├── backend/           → FastAPI (Vercel Serverless Functions)
└── vercel.json        → Configuration monorepo
```

**Tout sur Vercel** = 1 seul déploiement! 🎉

---

## ⚠️ Limitation WebSocket

**IMPORTANT**: Vercel Serverless Functions **ne supportent PAS** les WebSockets persistants.

### Solutions:

#### Option 1: Utiliser Vercel + Railway (Recommandé)
- **Frontend** → Vercel (gratuit)
- **Backend** → Railway (gratuit 500h/mois)
- ✅ WebSocket fonctionne
- ✅ Temps réel OK
- ✅ Multijoueur OK

#### Option 2: Tout sur Vercel SANS WebSocket
- Remplacer WebSocket par **polling HTTP**
- Frontend interroge l'API toutes les 2 secondes
- ⚠️ Moins fluide mais fonctionne
- ✅ Tout gratuit sur Vercel

#### Option 3: Utiliser Vercel Edge Functions (Beta)
- Edge Functions supportent WebSocket
- ⚠️ Encore en beta
- Documentation: https://vercel.com/docs/functions/edge-functions

---

## 🎯 Déploiement Recommandé

### Architecture Hybride (Meilleure)

```
Frontend (Vercel)  ←→  Backend (Railway)
  Next.js               FastAPI + WebSocket
  Gratuit               Gratuit 500h/mois
```

### Commandes

```bash
# 1. Backend sur Railway
cd backend
railway up
# URL: https://monopoly-backend.railway.app

# 2. Frontend sur Vercel
cd frontend
vercel --prod
# URL: https://monopoly-web.vercel.app
```

---

## 🔧 Si Tu Veux VRAIMENT Tout sur Vercel

### Adapter pour Polling (Sans WebSocket)

1. **Modifier le frontend** pour utiliser polling:

```typescript
// frontend/lib/polling.ts
export const pollGameState = async (gameId: string) => {
  const response = await fetch(`/api/games/${gameId}`)
  return response.json()
}

// Interroger toutes les 2 secondes
setInterval(() => pollGameState(gameId), 2000)
```

2. **Simplifier le backend** (retirer Socket.IO):

```python
# backend/main.py
# Retirer socketio
# Garder seulement FastAPI REST
```

3. **Déployer**:

```bash
vercel --prod
```

---

## 💡 Comparaison

| Feature | Vercel Seul | Vercel + Railway |
|---------|-------------|------------------|
| WebSocket | ❌ Non | ✅ Oui |
| Temps réel | ⚠️ Polling | ✅ Instantané |
| Coût | 💰 Gratuit | 💰 Gratuit |
| Setup | 🟢 Simple | 🟡 Moyen |
| Performance | 🟡 OK | 🟢 Excellent |

---

## 🚀 Déploiement Vercel Monorepo (REST Only)

Si tu acceptes de retirer WebSocket:

```bash
# Racine du projet
vercel --prod

# Vercel détecte automatiquement:
# - frontend/ → Next.js
# - backend/ → Python API
```

### Configuration

```json
// vercel.json
{
  "builds": [
    { "src": "frontend/package.json", "use": "@vercel/next" },
    { "src": "backend/main.py", "use": "@vercel/python" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/main.py" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```

---

## 🎮 Ma Recommandation

**Pour la meilleure expérience multijoueur:**

1. ✅ **Frontend sur Vercel** (gratuit, rapide)
2. ✅ **Backend sur Railway** (gratuit, WebSocket OK)
3. ✅ **Temps réel fluide** avec Socket.IO
4. ✅ **Déploiement en 5 minutes**

**Pour tout sur Vercel:**

1. ⚠️ Retirer WebSocket
2. ⚠️ Utiliser polling HTTP
3. ⚠️ Expérience moins fluide
4. ✅ Mais ça fonctionne!

---

## 📝 Choix à Faire

**Quelle option préfères-tu?**

### A) Vercel + Railway (Recommandé)
```bash
# Backend
cd backend && railway up

# Frontend  
cd frontend && vercel --prod
```

### B) Tout sur Vercel (Sans WebSocket)
```bash
# Racine
vercel --prod
```

---

**Dis-moi ce que tu préfères et je t'aide à déployer!** 🚀
