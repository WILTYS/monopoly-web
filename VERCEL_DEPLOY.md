# 🚀 Déploiement Vercel — Monopoly Web

## 📦 Frontend sur Vercel

### Option 1: Via CLI (Recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer depuis le dossier frontend
cd frontend
vercel

# Suivre les prompts:
# - Set up and deploy? Yes
# - Which scope? [Ton compte]
# - Link to existing project? No
# - Project name? monopoly-web
# - Directory? ./
# - Override settings? No

# Déploiement production
vercel --prod
```

### Option 2: Via Dashboard Vercel

1. **Aller sur** https://vercel.com/new
2. **Importer** le repo GitHub/GitLab
3. **Configuration**:
   - Framework Preset: **Next.js**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Variables d'environnement**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
   ```

5. **Déployer** 🚀

---

## 🔧 Backend sur Railway

Le backend FastAPI doit être déployé séparément sur Railway, Render ou similaire.

### Déploiement Railway (Recommandé)

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Créer nouveau projet
cd backend
railway init

# Déployer
railway up

# Ajouter variables d'environnement
railway variables set MONGODB_URL="mongodb+srv://..."
railway variables set SECRET_KEY="votre-secret-key-production"
railway variables set CORS_ORIGINS="https://monopoly-web.vercel.app"

# Obtenir l'URL
railway domain
```

### Configuration Backend pour Production

1. **MongoDB Atlas**:
   - Créer cluster sur https://cloud.mongodb.com
   - Whitelist IP: `0.0.0.0/0`
   - Créer utilisateur
   - Copier connection string

2. **Variables Railway**:
   ```
   MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/monopoly
   DATABASE_NAME=monopoly
   SECRET_KEY=super-secret-key-change-me
   CORS_ORIGINS=https://monopoly-web.vercel.app,https://monopoly-web-*.vercel.app
   ```

3. **Procfile** (déjà créé):
   ```
   web: uvicorn main:socket_app --host 0.0.0.0 --port $PORT
   ```

---

## 🔄 Workflow Complet

### 1. Déployer Backend d'abord
```bash
cd backend
railway up
# Noter l'URL: https://monopoly-backend.railway.app
```

### 2. Configurer Frontend avec URL Backend
```bash
cd frontend
# Mettre à jour .env.production
echo "NEXT_PUBLIC_API_URL=https://monopoly-backend.railway.app" > .env.production
echo "NEXT_PUBLIC_WS_URL=https://monopoly-backend.railway.app" >> .env.production
```

### 3. Déployer Frontend
```bash
vercel --prod
# Noter l'URL: https://monopoly-web.vercel.app
```

### 4. Mettre à jour CORS Backend
```bash
railway variables set CORS_ORIGINS="https://monopoly-web.vercel.app"
```

---

## ✅ Vérification Post-Déploiement

### Frontend
- [ ] Page d'accueil charge
- [ ] Pas d'erreurs console
- [ ] Animations fonctionnent
- [ ] Responsive mobile

### Backend
- [ ] API accessible: `https://backend-url/health`
- [ ] WebSocket connecté
- [ ] CORS configuré
- [ ] MongoDB connecté

### Full Stack
- [ ] Création de partie fonctionne
- [ ] Join room fonctionne
- [ ] Multijoueur temps réel OK
- [ ] Gameplay complet

---

## 🐛 Troubleshooting

### Erreur CORS
```bash
# Vérifier CORS_ORIGINS inclut toutes les URLs Vercel
railway variables set CORS_ORIGINS="https://monopoly-web.vercel.app,https://monopoly-web-*.vercel.app"
```

### WebSocket ne connecte pas
- Vérifier que backend supporte WSS (HTTPS)
- Railway/Render supportent automatiquement

### Build échoue
```bash
# Nettoyer cache
vercel --force

# Vérifier logs
vercel logs
```

---

## 💰 Coûts

- **Vercel**: Gratuit (Hobby plan)
- **Railway**: $5/mois (500h gratuit/mois)
- **MongoDB Atlas**: Gratuit (M0 tier)

**Total**: ~$0-5/mois pour commencer

---

## 🔒 Sécurité Production

- [ ] Changer `SECRET_KEY` en production
- [ ] Utiliser variables d'environnement
- [ ] Activer HTTPS (automatique sur Vercel/Railway)
- [ ] Rate limiting sur API
- [ ] Validation stricte inputs

---

## 📊 Monitoring

### Vercel Analytics
```bash
# Activer dans dashboard Vercel
# Analytics > Enable
```

### Railway Logs
```bash
railway logs
```

### MongoDB Atlas Monitoring
- Dashboard > Metrics
- Alertes configurables

---

## 🚀 Commandes Rapides

```bash
# Déployer frontend
cd frontend && vercel --prod

# Déployer backend
cd backend && railway up

# Voir logs frontend
vercel logs

# Voir logs backend
railway logs

# Variables backend
railway variables

# Rollback
vercel rollback
railway rollback
```

---

## 📝 Checklist Finale

Avant de partager l'app:

- [ ] Backend déployé et accessible
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] MongoDB connecté
- [ ] Tests multijoueur OK
- [ ] Mobile responsive vérifié
- [ ] Domaine custom (optionnel)

---

**Ton app Monopoly Web sera live! 🎲🌐**

Pour un domaine custom: `vercel domains add monopoly.votredomaine.com`
