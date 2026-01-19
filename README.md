# 🕌 Site Web Mosquée Bleue - CIMG Villefranche-sur-Saône

Site web officiel de la Mosquée Bleue de Villefranche-sur-Saône (CIMG - Centre Islamique de la Mosquée Bleue).

## 🚀 Démarrage rapide

**Windows :**
- Double-cliquez sur `start-server.bat` ou `start-server.ps1`

**Ligne de commande :**
```bash
npm start
```

Le site sera accessible sur : **http://localhost:3000**

---

## 📄 Pages disponibles

### 🌐 Pages publiques
- **Accueil** : http://localhost:3000
- **Nos Pôles** : http://localhost:3000/poles
  - AT (Ana Teşkilat) - Organisation des hommes adultes
  - GT (Gençlik Teşkilatı) - Organisation des jeunes hommes
  - KT (Kadın Teşkilatı) - Organisation des femmes adultes
  - KGT (Kadın Gençlik Teşkilatı) - Organisation des jeunes femmes
- **Événements & Activités** : http://localhost:3000/evenements
- **Faire un don** : http://localhost:3000/don
- **Adhésion** : http://localhost:3000/adhesion
- **Contact** : http://localhost:3000/contact
- **Mentions légales** : http://localhost:3000/mentions-legales
- **Politique de confidentialité** : http://localhost:3000/confidentialite

### 🔐 Administration
- **Connexion admin** : http://localhost:3000/admin/login
  - Identifiant : `admin`
  - Mot de passe : `mosquee2024`
- **Dashboard** : http://localhost:3000/admin/dashboard
- **Gestion des événements** : http://localhost:3000/admin/events
- **Gestion des membres** : http://localhost:3000/admin/members
- **Gestion des actualités** : http://localhost:3000/admin/news

---

## ⚙️ Installation et Configuration

### Prérequis
- **Node.js** v18+ ([télécharger](https://nodejs.org/))
- **MySQL** / **MariaDB** ([télécharger XAMPP](https://www.apachefriends.org/))
- **Git** (optionnel)

### Installation

1. **Cloner ou télécharger le projet**
```bash
git clone [url-du-repo]
cd cimg-mosquee-bleu-main
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**
   - Démarrer XAMPP (MySQL)
   - Créer une base de données nommée `mosquee_bleue`
   - Les tables seront créées automatiquement au premier lancement

4. **Configurer les variables d'environnement**
   - Éditer le fichier `.env` :
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mosquee_bleue
```

5. **Lancer le serveur**
```bash
npm start
```

Ou en mode développement (avec rechargement automatique) :
```bash
npm run dev
```

---

## 🗂️ Structure du projet

```
cimg-mosquee-bleu-main/
├── public/                # Fichiers statiques
│   ├── css/              # Feuilles de style
│   ├── js/               # Scripts JavaScript
│   └── images/           # Images et médias
├── src/
│   ├── config/           # Configuration (database, etc.)
│   ├── models/           # Modèles Sequelize (Event, Member, etc.)
│   ├── routes/           # Routes Express
│   ├── views/            # Templates EJS
│   │   ├── partials/     # Composants réutilisables
│   │   └── admin/        # Pages d'administration
│   ├── helpers/          # Fonctions utilitaires
│   ├── i18n/             # Traductions FR/TR
│   └── middleware/       # Middlewares Express
├── scripts/              # Scripts utilitaires
│   ├── check-poles.js    # Vérifier les pôles en DB
│   ├── seed-quotes-fixed.js       # Peupler citations
│   └── seed-past-events.js        # Peupler événements passés
├── server.js             # Point d'entrée du serveur
├── package.json          # Dépendances et scripts
├── .env                  # Variables d'environnement
└── README.md             # Documentation
```

---

## 🛠️ Technologies utilisées

### Backend
- **Node.js** v18+ - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM pour MySQL
- **EJS** - Moteur de templates
- **bcrypt** - Hachage des mots de passe
- **express-session** - Gestion des sessions

### Frontend
- **HTML5 / CSS3** - Structure et styles
- **JavaScript Vanilla** - Interactions dynamiques
- **Font Awesome** - Icônes
- **Google Fonts** - Typographie (Poppins, Amiri)

### Sécurité
- **helmet** - Sécurisation des en-têtes HTTP
- **express-rate-limit** - Protection contre le spam
- **express-validator** - Validation des données
- **cors** - Gestion des origines croisées

### APIs externes
- **Mawaqit API** - Horaires de prière en temps réel

---

## 🌍 Système multilingue

Le site est entièrement bilingue **Français / Turc** :
- Changement de langue via le sélecteur dans le header
- Traductions stockées dans `src/i18n/fr.json` et `src/i18n/tr.json`
- Cookie `lang` pour mémoriser le choix de l'utilisateur

---

## 🎨 Fonctionnalités principales

### ✅ Système de pôles
- **4 pôles fixes** : AT, GT, KT, KGT
- Chaque pôle a sa page dédiée avec :
  - Description détaillée (FR/TR)
  - Liens réseaux sociaux (Facebook, Instagram, TikTok)
  - Liste des membres actifs
  - Événements à venir du pôle

### ✅ Gestion des événements
- Création, modification, suppression d'événements
- Association à un pôle spécifique
- Upload d'images
- Affichage par date (à venir / passés)
- Filtrage par pôle

### ✅ Gestion des membres
- Création de profils membres
- Association à un pôle et un rôle
- Upload de photos de profil
- Liste des membres par pôle

### ✅ Autres fonctionnalités
- Actualités (News) avec auteurs
- Citations islamiques (Quotes)
- Formulaire de contact avec envoi d'email
- Formulaire d'adhésion
- Système de dons

---

## 📝 Scripts utilitaires

### Vérifier les pôles en base de données
```bash
node scripts/check-poles.js
```

### Peupler la base avec des citations
```bash
node scripts/seed-quotes-fixed.js
```

### Peupler la base avec des événements passés
```bash
node scripts/seed-past-events.js
```

---

## 🔐 Administration

### Connexion
- URL : http://localhost:3000/admin/login
- Identifiant : `admin`
- Mot de passe : `mosquee2024`

### Fonctionnalités admin
- Dashboard avec statistiques
- CRUD complet pour :
  - Événements
  - Membres
  - Actualités
  - Citations
  - Paramètres du site

---

## 🐛 Débogage

### Le serveur ne démarre pas
1. Vérifier que MySQL est démarré (XAMPP)
2. Vérifier les identifiants dans `.env`
3. Vérifier que le port 3000 est disponible

### Erreur de base de données
1. Vérifier que la base `mosquee_bleue` existe
2. Vérifier les droits de l'utilisateur MySQL
3. Consulter les logs dans la console

### Problèmes d'upload d'images
1. Vérifier les permissions du dossier `public/images/uploads/`
2. Vérifier la taille max (5 MB par défaut)

---

## 📄 Licence et Contact

**© 2026 CIMG - Mosquée Bleue de Villefranche-sur-Saône**

**Adresse :** 466 Rue Charles Sève, 69400 Villefranche-sur-Saône  
**Téléphone :** 04 74 68 00 00  
**Email :** contact@mosquee-bleue.fr  

---

## 📚 Documentation complémentaire

- **CHANGELOG.md** - Historique des modifications
- **package.json** - Liste complète des dépendances
- **.env** - Configuration des variables d'environnement
