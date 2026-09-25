# Guide de Déploiement sur Render (Zero-Error Deployment Guide)

Cette application full-stack (React + Express + WebSockets + SQLite/sql.js + Moteur Médico-Légal) est entièrement préconfigurée pour un déploiement direct et sans erreur sur [Render.com](https://render.com).

---

## 🚀 Méthode 1 : Déploiement Automatique via Blueprint (`render.yaml`) - Recommandé

Le dépôt inclut un fichier `render.yaml` à la racine qui automatise toute la configuration de Render :

1. Poussez votre code sur votre compte **GitHub** ou **GitLab**.
2. Rendez-vous sur votre tableau de bord [Render.com](https://dashboard.render.com).
3. Cliquez sur **New +** puis sélectionnez **Blueprint**.
4. Connectez votre dépôt GitHub.
5. Render détecte automatiquement `render.yaml` et configure tous les paramètres :
   - **Nom du service** : `verifdiplome-cameroun`
   - **Runtime** : `Node` (version 22 via `.node-version`)
   - **Région** : `Frankfurt` (ou modifiable)
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start` (exécute `node dist/server.cjs`)
   - **Health Check Path** : `/api/health`
   - **Variables d'environnement** :
     - `NODE_ENV` = `production`
     - `PORT` = `10000` (Render mappe automatiquement le port externe)
     - `JWT_SECRET` = généré aléatoirement de façon sécurisée par Render (`generateValue: true`)
6. Cliquez sur **Apply** : le déploiement se lance automatiquement.

---

## 🛠️ Méthode 2 : Déploiement Manuel via l'Interface Render

Si vous préférez créer le Web Service manuellement :

1. Sur Render, cliquez sur **New +** > **Web Service**.
2. Choisissez votre dépôt Git.
3. Remplissez les champs de configuration :
   - **Name** : `verifdiplome-cameroun`
   - **Language / Runtime** : `Node`
   - **Branch** : `main` (ou votre branche de production)
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free` (ou Starter)
4. Dans la section **Advanced** > **Environment Variables**, ajoutez :
   | Clé | Valeur | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Active le mode production et la distribution des fichiers statiques |
   | `PORT` | `10000` | Port d'écoute interne de Render (le serveur s'adapte automatiquement) |
   | `JWT_SECRET` | *(chaîne secrète aléatoire)* | Clé pour signer les sessions et tokens agents |
   | `GEMINI_API_KEY` | *(votre clé API Google AI Studio)* | Optionnel : analyse visuelle par IA Gemini (sinon moteur heuristique autonome actif) |
5. Dans **Health Check Path**, entrez : `/api/health`.
6. Cliquez sur **Create Web Service**.

---

## 🔍 Points Clés & Garanties Anti-Erreurs Intégrés

1. **Prise en charge dynamique du port (`$PORT`)** :
   Le serveur lit `process.env.PORT` avec repli automatique sur le port local `3000`. Cela évite l'erreur classique Render `Port scan timeout`.
2. **Build unifié & bundle production** :
   La commande `npm run build` compile simultanément l'interface client React (Vite) dans `dist/` et le backend Express dans `dist/server.cjs` via `esbuild`.
3. **Dépendances de build sécurisées** :
   `esbuild` et `tsx` sont inclus directement dans les dépendances de production (`dependencies`) pour éviter les erreurs d'outils manquants même si `NODE_ENV=production` est injecté avant `npm install`.
4. **WebSockets natifs** :
   Le flux d'alertes en temps réel (`/ws/alerts`) s'adapte automatiquement au protocole sécurisé `wss://` sur Render sans aucune configuration supplémentaire.
5. **Stockage SQLite résilient** :
   Le moteur `sql.js` détecte les permissions du système de fichiers et bascule automatiquement sur `/tmp/data` si le répertoire courant est en lecture seule.
