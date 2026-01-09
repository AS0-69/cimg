# Guide d'intégration CRUD avec MySQL - Mosquée Bleue

## Pourquoi MySQL au lieu de MongoDB ?

✅ **MySQL** (SQL - relationnel) : Structure tabulaire, relations claires, idéal pour données structurées
✅ **MongoDB** (NoSQL) : Documents JSON, flexible mais moins de garanties de cohérence

Pour ce projet, **MySQL est un excellent choix** car les événements ont une structure fixe.

## Installation et Configuration

### Étape 1 : Installation des dépendances

```bash
npm install mysql2 sequelize
```

**Sequelize** = ORM pour MySQL (équivalent de Mongoose pour MongoDB)

### Étape 2 : Configuration de la connexion

Créer `src/config/database.js` :
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mosquee_bleue',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Désactiver les logs SQL en production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test de connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connecté avec succès');
  } catch (error) {
    console.error('❌ Erreur MySQL:', error);
  }
}

module.exports = { sequelize, testConnection };
```

### Étape 3 : Créer le modèle Event

Créer `src/models/Event.js` :
```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('event', 'activity'),
    allowNull: false,
    defaultValue: 'event'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  time: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '/images/default-event.jpg'
  }
}, {
  tableName: 'events',
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  indexes: [
    {
      name: 'date_index',
      fields: ['date']
    }
  ]
});

module.exports = Event;
```

### Étape 4 : Initialiser la base de données

Dans `server.js`, ajouter :
```javascript
const { sequelize, testConnection } = require('./src/config/database');

// Tester la connexion et créer les tables
async function initDatabase() {
  await testConnection();
  
  // Synchroniser les modèles (créer les tables si elles n'existent pas)
  await sequelize.sync({ alter: true });
  console.log('✅ Tables synchronisées');
}

// Appeler au démarrage
initDatabase();
```

### Étape 5 : Adapter le module data/events.js

Modifier `src/data/events.js` :
```javascript
const Event = require('../models/Event');
const { Op } = require('sequelize');

/**
 * Récupère tous les événements
 */
async function getAllEvents() {
  return await Event.findAll({
    order: [['date', 'DESC']]
  });
}

/**
 * Récupère tous les événements triés par date (plus récent en premier)
 */
async function getEventsSortedByDate() {
  return await Event.findAll({
    order: [['date', 'DESC']]
  });
}

/**
 * Récupère les N événements les plus récents
 */
async function getRecentEvents(count = 3) {
  return await Event.findAll({
    order: [['date', 'DESC']],
    limit: count
  });
}

/**
 * Récupère un événement par son ID
 */
async function getEventById(id) {
  return await Event.findByPk(id);
}

/**
 * Récupère les événements par type
 */
async function getEventsByType(type) {
  return await Event.findAll({
    where: { type },
    order: [['date', 'DESC']]
  });
}

/**
 * Crée un nouvel événement
 */
async function createEvent(eventData) {
  return await Event.create(eventData);
}

/**
 * Met à jour un événement
 */
async function updateEvent(id, eventData) {
  const event = await Event.findByPk(id);
  if (!event) {
    throw new Error('Événement non trouvé');
  }
  return await event.update(eventData);
}

/**
 * Supprime un événement
 */
async function deleteEvent(id) {
  const event = await Event.findByPk(id);
  if (!event) {
    throw new Error('Événement non trouvé');
  }
  await event.destroy();
  return true;
}

module.exports = {
  getAllEvents,
  getEventsSortedByDate,
  getRecentEvents,
  getEventById,
  getEventsByType,
  createEvent,
  updateEvent,
  deleteEvent
};
```

### Étape 6 : Routes Admin (identiques)

Les routes dans `src/routes/admin.js` restent **exactement les mêmes** ! L'abstraction via `src/data/events.js` fait que le code ne change pas.

### Étape 7 : Script de migration des données

Créer `scripts/migrate-events-mysql.js` :
```javascript
const { sequelize, testConnection } = require('../src/config/database');
const Event = require('../src/models/Event');

// Données actuelles
const events = [
  {
    type: 'event',
    title: 'Conférence : Les valeurs islamiques',
    date: '2026-01-15',
    time: '20h00 - 22h00',
    location: 'Salle principale',
    category: 'Conférence',
    description: 'Conférence sur l\'importance des valeurs islamiques dans la vie quotidienne.',
    image: '/images/image-exemple1.jpg'
  },
  {
    type: 'activity',
    title: 'Cours d\'arabe pour débutants',
    date: '2026-01-20',
    time: '18h30 - 19h30',
    location: 'Salle 2',
    category: 'Cours',
    description: 'Démarrage d\'un nouveau cycle de cours d\'arabe pour les débutants.',
    image: '/images/image-exemple3.jpg'
  },
  {
    type: 'activity',
    title: 'Activité jeunesse : Sortie éducative',
    date: '2026-01-25',
    time: '14h00 - 18h00',
    location: 'Départ mosquée',
    category: 'Jeunesse',
    description: 'Sortie éducative pour les jeunes avec visite culturelle et activités.',
    image: '/images/image-exemple4.jpg'
  },
  {
    type: 'event',
    title: 'Conférence Ramadan 2026',
    date: '2026-02-10',
    time: '19h30 - 21h30',
    location: 'Salle principale',
    category: 'Conférence',
    description: 'Préparation spirituelle pour le mois béni de Ramadan.',
    image: '/images/image-exemple2.jpg'
  },
  {
    type: 'activity',
    title: 'Cours de Tajweed',
    date: '2026-02-15',
    time: '17h00 - 18h30',
    location: 'Salle 3',
    category: 'Cours',
    description: 'Perfectionnez votre récitation du Coran avec nos cours de Tajweed.',
    image: '/images/image-exemple1.jpg'
  }
];

async function migrate() {
  try {
    // Connexion
    await testConnection();
    
    // Créer/recréer les tables
    await sequelize.sync({ force: true });
    console.log('✅ Tables créées');
    
    // Insérer les données
    await Event.bulkCreate(events);
    console.log(`✅ ${events.length} événements migrés`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

migrate();
```

Exécuter : `node scripts/migrate-events-mysql.js`

## Configuration MySQL

### Installation de MySQL (si pas déjà installé)

**Windows** :
1. Télécharger MySQL : https://dev.mysql.com/downloads/installer/
2. Installer avec MySQL Workbench
3. Créer la base : `CREATE DATABASE mosquee_bleue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

**Alternative : XAMPP** (plus simple)
1. Télécharger XAMPP : https://www.apachefriends.org/
2. Démarrer MySQL via le panneau XAMPP
3. Accéder à phpMyAdmin : http://localhost/phpmyadmin
4. Créer la base `mosquee_bleue`

### Fichier .env pour la configuration

Créer `.env` à la racine :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mosquee_bleue
PORT=3000
NODE_ENV=development
```

## Comparaison MongoDB vs MySQL

| Critère | MongoDB | MySQL |
|---------|---------|-------|
| **Type** | NoSQL (documents) | SQL (relationnel) |
| **Structure** | Flexible, JSON | Fixe, tables |
| **Relations** | Références manuelles | Clés étrangères natives |
| **Requêtes** | find(), aggregate() | SELECT, JOIN |
| **Installation** | Service MongoDB | XAMPP ou MySQL |
| **Hébergement** | MongoDB Atlas (gratuit) | Beaucoup d'options |
| **Pour ce projet** | ✅ Bien | ✅ **Mieux** |

## Checklist d'intégration MySQL

- [ ] Installer MySQL (XAMPP recommandé)
- [ ] Installer les dépendances : `npm install mysql2 sequelize`
- [ ] Créer `src/config/database.js`
- [ ] Créer le modèle `src/models/Event.js`
- [ ] Créer la base de données `mosquee_bleue`
- [ ] Configurer `.env` avec les identifiants
- [ ] Modifier `server.js` pour initialiser la DB
- [ ] Adapter `src/data/events.js` (code fourni ci-dessus)
- [ ] Mettre à jour les routes (async/await déjà fait)
- [ ] Créer le script de migration
- [ ] Exécuter la migration : `node scripts/migrate-events-mysql.js`
- [ ] Tester l'ajout d'un événement via admin
- [ ] Vérifier l'affichage sur l'accueil
- [ ] Vérifier l'affichage sur /evenements
- [ ] Tester modification et suppression

## Avantages de MySQL pour ce projet

1. ✅ **Structure claire** : Les événements ont toujours les mêmes champs
2. ✅ **Hébergement facile** : Tous les hébergeurs supportent MySQL
3. ✅ **Outils graphiques** : phpMyAdmin, MySQL Workbench
4. ✅ **Backup simple** : Export SQL standard
5. ✅ **Performance** : Excellent pour ce type de données
6. ✅ **Pas de service externe** : Tourne avec XAMPP localement

## Migration future vers MongoDB

Si vous voulez changer plus tard, c'est facile ! Il suffit de :
1. Remplacer `src/config/database.js` par la connexion MongoDB
2. Remplacer `src/models/Event.js` par le schéma Mongoose
3. Adapter légèrement `src/data/events.js`

Le reste du code (routes, vues) **ne change pas** ! 🎯

## Notes importantes

- **Les routes admin ne changent pas** grâce à l'abstraction
- **Sequelize gère les migrations** automatiquement
- **Les types SQL sont stricts** (meilleure validation)
- **XAMPP** est la solution la plus simple pour débuter
- **Le code fourni est production-ready**
