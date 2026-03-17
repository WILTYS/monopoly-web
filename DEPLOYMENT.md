# 🚀 Déploiement Monopoly Web

## 📋 Prérequis

- Python 3.11+
- Node.js 18+
- MongoDB
- Redis (optionnel)

## 🔧 Installation Locale

### Backend

```bash
cd backend

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Configurer .env
cp .env.example .env
# Éditer .env avec vos valeurs

# Lancer serveur
uvicorn main:socket_app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

# Installer dépendances
npm install

# Configurer .env
cp .env.local.example .env.local
# Éditer .env.local

# Lancer dev server
npm run dev
```

### Base de données (Docker)

```bash
# Depuis la racine du projet
docker-compose up -d
```

## 🌐 Déploiement Production

### Backend (Railway / Render)

1. **Railway**
   ```bash
   railway login
   railway init
   railway add
   railway up
   ```

2. **Variables d'environnement**
   - `MONGODB_URL`: URL MongoDB Atlas
   - `SECRET_KEY`: Clé secrète forte
   - `CORS_ORIGINS`: URLs frontend autorisées

### Frontend (Vercel / Netlify)

1. **Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Variables d'environnement**
   - `NEXT_PUBLIC_API_URL`: URL backend
   - `NEXT_PUBLIC_WS_URL`: URL WebSocket

### MongoDB Atlas

1. Créer cluster sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist IP (0.0.0.0/0 pour dev)
3. Créer utilisateur DB
4. Copier connection string

## 📊 Monitoring

### Logs Backend
```bash
# Railway
railway logs

# Render
render logs
```

### Logs Frontend
```bash
# Vercel
vercel logs
```

## 🔒 Sécurité Production

- [ ] Changer `SECRET_KEY`
- [ ] Configurer CORS strictement
- [ ] Activer HTTPS
- [ ] Rate limiting
- [ ] Validation inputs
- [ ] Sanitization données

## ⚡ Performance

### Backend
- Utiliser Redis pour cache
- Connection pooling MongoDB
- Compression responses
- CDN pour assets

### Frontend
- Next.js Image optimization
- Code splitting
- Lazy loading
- Service Worker

## 🧪 Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## 📈 Scaling

### Horizontal
- Load balancer (Nginx)
- Multiple instances backend
- Redis pub/sub pour WebSocket

### Vertical
- Augmenter RAM/CPU
- Optimiser queries DB
- Caching agressif

## 🔄 CI/CD

### GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: railway up
      - name: Deploy Frontend
        run: vercel --prod
```

## 📱 Mobile

- PWA ready
- Responsive design
- Touch optimized
- Offline mode (future)

## 💰 Monétisation

### Stripe Integration

```bash
pip install stripe
npm install @stripe/stripe-js
```

### Features Premium
- Skins exclusifs
- Rooms privées
- Stats avancées
- Pas de pub

## 🐛 Debug

### Backend
```bash
# Logs détaillés
uvicorn main:socket_app --log-level debug
```

### Frontend
```bash
# Mode debug
NEXT_PUBLIC_DEBUG=true npm run dev
```

## 📞 Support

- Email: support@monopoly-web.com
- Discord: [Lien serveur]
- GitHub Issues: [Lien repo]

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2024
