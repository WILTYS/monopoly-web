# 🚀 Déploiement Vercel Monorepo — Guide Simple

## 📦 Architecture Simplifiée

```
monopoly/
├── frontend/          → Next.js
├── api/              → Backend FastAPI (Serverless)
└── vercel.json       → Configuration
```

**Tout sur Vercel** = 1 commande! 🎉

---

## ✅ Ce Qui a Été Modifié

### Backend
- ✅ Retiré Socket.IO (WebSocket)
- ✅ Créé `main_vercel.py` (FastAPI pur REST)
- ✅ API endpoints pour polling
- ✅ Stockage en mémoire (RAM)

### Frontend
- ✅ Créé `polling.ts` (remplace WebSocket)
- ✅ Interroge l'API toutes les 2 secondes
- ✅ Mise à jour automatique de l'état du jeu

### Configuration
- ✅ `vercel.json` pour monorepo
- ✅ `api/index.py` pour Vercel Functions
- ✅ Requirements simplifiés

---

## 🚀 Déploiement en 3 Étapes

### 1. Préparer le Projet

```bash
# S'assurer que tout est committé
git add .
git commit -m "Prêt pour Vercel"
git push
```

### 2. Déployer sur Vercel

#### Option A: Via Dashboard (Recommandé)

1. Va sur https://vercel.com
2. Clique **"Add New Project"**
3. Importe ton repo GitHub/GitLab
4. Vercel détecte automatiquement Next.js
5. **Configuration**:
   - Framework Preset: **Next.js**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Clique **"Deploy"** 🚀

#### Option B: Via CLI

```bash
# Depuis la racine du projet
vercel

# Suivre les prompts
# Deploy? Yes
# Scope? [Ton compte]
# Link? No
# Name? monopoly-web
# Directory? ./

# Déploiement production
vercel --prod
```

### 3. Configurer les Variables d'Environnement

Dans le dashboard Vercel:

1. Va dans **Settings** → **Environment Variables**
2. Ajoute:
   ```
   NEXT_PUBLIC_API_URL = /api
   ```
3. Redéploie si nécessaire

---

## 🎮 Utilisation

Une fois déployé:

1. **Partage le lien**: `https://ton-app.vercel.app`
2. **Joueur 1** crée une partie → Code `ABC123`
3. **Autres joueurs** rejoignent avec le code
4. **Jouez ensemble!** 🎲

---

## 🔧 Comment Ça Fonctionne

### Polling HTTP (Remplace WebSocket)

```typescript
// Frontend interroge l'API toutes les 2 secondes
setInterval(() => {
  fetch('/api/games/ABC123')
    .then(res => res.json())
    .then(data => updateGameState(data))
}, 2000)
```

**Avantages:**
- ✅ Fonctionne sur Vercel
- ✅ Pas de WebSocket nécessaire
- ✅ Simple et fiable

**Inconvénients:**
- ⚠️ Légère latence (2 secondes max)
- ⚠️ Moins fluide que WebSocket

---

## 📊 Comparaison

| Feature | Avec WebSocket | Avec Polling |
|---------|---------------|--------------|
| Latence | Instantané | 0-2 secondes |
| Déploiement | 2 services | 1 service |
| Coût | Gratuit | Gratuit |
| Setup | Moyen | Simple |

---

## 🐛 Troubleshooting

### Build échoue

```bash
# Nettoyer et rebuild
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### API ne répond pas

Vérifier dans Vercel Dashboard:
- Functions → Logs
- Voir les erreurs Python

### Polling ne fonctionne pas

```typescript
// Vérifier dans la console navigateur
console.log('Polling...', gameId)
```

---

## 💡 Améliorations Futures

Si tu veux passer au WebSocket plus tard:

1. Déployer le backend sur Railway
2. Modifier frontend pour utiliser WebSocket
3. Garder frontend sur Vercel

---

## 📝 Checklist Déploiement

- [ ] Code committé et pushé
- [ ] Projet créé sur Vercel
- [ ] Build réussi
- [ ] Variables d'env configurées
- [ ] Test création partie
- [ ] Test multijoueur
- [ ] Partage le lien! 🎉

---

## 🎯 Commandes Rapides

```bash
# Déployer
vercel --prod

# Voir logs
vercel logs

# Rollback
vercel rollback

# Domaine custom
vercel domains add monopoly.ton-domaine.com
```

---

**Ton Monopoly Web sera live en 5 minutes!** 🚀🎲
