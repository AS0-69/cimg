# Guide d'intégration CRUD - Mosquée Bleue

## Architecture actuelle

### Structure des données
Les événements sont actuellement stockés dans `src/data/events.js` qui exporte plusieurs fonctions utilitaires :
- `getAllEvents()` : Récupère tous les événements
- `getEventsSortedByDate()` : Récupère les événements triés par date (plus récent en premier)
- `getRecentEvents(count)` : Récupère les N événements les plus récents
- `getEventById(id)` : Récupère un événement par ID
- `getEventsByType(type)` : Filtre par type ('event' ou 'activity')

### Pages utilisant les données d'événements
1. **Page d'accueil** (`src/routes/index.js`) : Affiche les 3 événements les plus récents
2. **Page événements** (`src/routes/evenements.js`) : Affiche tous les événements et activités

### Structure d'un événement
```javascript
{
  id: 1,
  type: 'event' | 'activity',  // Type d'événement
  title: 'Titre de l\'événement',
  date: '2026-01-15',  // Format ISO YYYY-MM-DD
  time: '20h00 - 22h00',
  location: 'Salle principale',
  category: 'Conférence',
  description: 'Description complète...',
  image: '/images/image-exemple1.jpg'
}
```

## Prochaines étapes pour l'intégration CRUD

### Étape 1 : Configuration de la base de données

#### Installation de MongoDB et Mongoose
```bash
npm install mongoose
```

#### Création du modèle Event
Créer `src/models/Event.js` :
```javascript
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'activity'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour tri par date
eventSchema.index({ date: -1 });

module.exports = mongoose.model('Event', eventSchema);
```

#### Configuration de la connexion MongoDB
Dans `server.js`, ajouter :
```javascript
const mongoose = require('mongoose');

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mosquee-bleue', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('❌ Erreur MongoDB:', err));
```

### Étape 2 : Mise à jour du module data

Modifier `src/data/events.js` pour utiliser MongoDB :
```javascript
const Event = require('../models/Event');

/**
 * Récupère tous les événements depuis la base de données
 */
async function getAllEvents() {
  return await Event.find();
}

/**
 * Récupère tous les événements triés par date (plus récent en premier)
 */
async function getEventsSortedByDate() {
  return await Event.find().sort({ date: -1 });
}

/**
 * Récupère les N événements les plus récents
 */
async function getRecentEvents(count = 3) {
  return await Event.find().sort({ date: -1 }).limit(count);
}

/**
 * Récupère un événement par son ID
 */
async function getEventById(id) {
  return await Event.findById(id);
}

/**
 * Récupère les événements par type
 */
async function getEventsByType(type) {
  return await Event.find({ type }).sort({ date: -1 });
}

/**
 * Crée un nouvel événement
 */
async function createEvent(eventData) {
  const event = new Event(eventData);
  return await event.save();
}

/**
 * Met à jour un événement
 */
async function updateEvent(id, eventData) {
  eventData.updatedAt = new Date();
  return await Event.findByIdAndUpdate(id, eventData, { new: true });
}

/**
 * Supprime un événement
 */
async function deleteEvent(id) {
  return await Event.findByIdAndDelete(id);
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

### Étape 3 : Mise à jour des routes (async/await)

Les routes doivent être modifiées pour gérer les promesses :

**`src/routes/index.js`** :
```javascript
router.get('/', async (req, res) => {
  try {
    const recentEvents = await getRecentEvents(3);
    res.render('index', { 
      title: 'Accueil - Mosquée Bleue',
      actualites,
      events: recentEvents,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});
```

**`src/routes/evenements.js`** :
```javascript
router.get('/', async (req, res) => {
  try {
    const allEvents = await getEventsSortedByDate();
    const upcomingEvents = allEvents.filter(e => e.type === 'event');
    const activities = allEvents.filter(e => e.type === 'activity');

    res.render('evenements', {
      title: 'Événements & Activités - Mosquée Bleue',
      currentPath: req.path,
      events: upcomingEvents,
      activities: activities,
      allItems: allEvents
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});
```

### Étape 4 : Création des routes CRUD admin

#### Installation de multer pour les uploads d'images
```bash
npm install multer
```

#### Configuration de multer
Créer `src/config/multer.js` :
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/events/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (JPEG, JPG, PNG, WEBP)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

module.exports = upload;
```

#### Routes CRUD dans admin.js
Ajouter dans `src/routes/admin.js` :
```javascript
const { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../data/events');
const upload = require('../config/multer');

// Liste des événements
router.get('/events', isAuthenticated, async (req, res) => {
  try {
    const events = await getAllEvents();
    res.render('admin/events-list', { 
      title: 'Gestion des événements',
      events,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});

// Formulaire de création
router.get('/events/new', isAuthenticated, (req, res) => {
  res.render('admin/event-form', {
    title: 'Nouvel événement',
    event: null,
    currentPath: req.path
  });
});

// Créer un événement
router.post('/events', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const eventData = {
      type: req.body.type,
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      category: req.body.category,
      description: req.body.description,
      image: req.file ? `/images/events/${req.file.filename}` : '/images/default-event.jpg'
    };

    await createEvent(eventData);
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur lors de la création');
  }
});

// Formulaire d'édition
router.get('/events/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) {
      return res.status(404).send('Événement non trouvé');
    }
    res.render('admin/event-form', {
      title: 'Modifier l\'événement',
      event,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});

// Mettre à jour un événement
router.post('/events/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const eventData = {
      type: req.body.type,
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      category: req.body.category,
      description: req.body.description
    };

    // Si une nouvelle image est uploadée
    if (req.file) {
      eventData.image = `/images/events/${req.file.filename}`;
    }

    await updateEvent(req.params.id, eventData);
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur lors de la mise à jour');
  }
});

// Supprimer un événement
router.post('/events/:id/delete', isAuthenticated, async (req, res) => {
  try {
    await deleteEvent(req.params.id);
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur lors de la suppression');
  }
});
```

### Étape 5 : Création des vues admin

#### Liste des événements (`src/views/admin/events-list.ejs`)
```html
<%- include('../partials/head') %>
<body>
  <%- include('../partials/header') %>
  
  <div class="admin-container">
    <h1>Gestion des événements</h1>
    <a href="/admin/events/new" class="btn btn-primary">
      <i class="fas fa-plus"></i> Ajouter un événement
    </a>
    
    <table class="admin-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Titre</th>
          <th>Date</th>
          <th>Catégorie</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <% events.forEach(event => { %>
        <tr>
          <td><%= event.type === 'event' ? 'Événement' : 'Activité' %></td>
          <td><%= event.title %></td>
          <td><%= new Date(event.date).toLocaleDateString('fr-FR') %></td>
          <td><%= event.category %></td>
          <td>
            <a href="/admin/events/<%= event._id %>/edit" class="btn btn-sm">Modifier</a>
            <form method="POST" action="/admin/events/<%= event._id %>/delete" style="display:inline;">
              <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Supprimer cet événement ?')">
                Supprimer
              </button>
            </form>
          </td>
        </tr>
        <% }); %>
      </tbody>
    </table>
  </div>
  
  <%- include('../partials/footer') %>
  <%- include('../partials/foot') %>
</body>
</html>
```

#### Formulaire événement (`src/views/admin/event-form.ejs`)
```html
<%- include('../partials/head') %>
<body>
  <%- include('../partials/header') %>
  
  <div class="admin-container">
    <h1><%= event ? 'Modifier' : 'Nouvel' %> événement</h1>
    
    <form method="POST" action="<%= event ? `/admin/events/${event._id}` : '/admin/events' %>" enctype="multipart/form-data">
      <div class="form-group">
        <label>Type</label>
        <select name="type" required>
          <option value="event" <%= event && event.type === 'event' ? 'selected' : '' %>>Événement</option>
          <option value="activity" <%= event && event.type === 'activity' ? 'selected' : '' %>>Activité</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Titre</label>
        <input type="text" name="title" value="<%= event ? event.title : '' %>" required>
      </div>
      
      <div class="form-group">
        <label>Date</label>
        <input type="date" name="date" value="<%= event ? event.date.toISOString().split('T')[0] : '' %>" required>
      </div>
      
      <div class="form-group">
        <label>Horaire</label>
        <input type="text" name="time" value="<%= event ? event.time : '' %>" placeholder="20h00 - 22h00" required>
      </div>
      
      <div class="form-group">
        <label>Lieu</label>
        <input type="text" name="location" value="<%= event ? event.location : '' %>" required>
      </div>
      
      <div class="form-group">
        <label>Catégorie</label>
        <input type="text" name="category" value="<%= event ? event.category : '' %>" required>
      </div>
      
      <div class="form-group">
        <label>Description</label>
        <textarea name="description" rows="5" required><%= event ? event.description : '' %></textarea>
      </div>
      
      <div class="form-group">
        <label>Image</label>
        <input type="file" name="image" accept="image/*" <%= event ? '' : 'required' %>>
        <% if (event && event.image) { %>
          <img src="<%= event.image %>" alt="Image actuelle" style="max-width: 200px; margin-top: 10px;">
        <% } %>
      </div>
      
      <button type="submit" class="btn btn-primary">Enregistrer</button>
      <a href="/admin/events" class="btn">Annuler</a>
    </form>
  </div>
  
  <%- include('../partials/footer') %>
  <%- include('../partials/foot') %>
</body>
</html>
```

## Synchronisation automatique

Grâce au module centralisé `src/data/events.js`, toutes les pages (accueil et événements) récupèrent automatiquement les données depuis la même source. Lorsqu'un événement est ajouté/modifié/supprimé via l'admin :

1. ✅ Les changements sont sauvegardés dans MongoDB
2. ✅ La page d'accueil affiche automatiquement les 3 derniers événements
3. ✅ La page événements affiche automatiquement tous les événements
4. ✅ Le tri par date est appliqué partout
5. ✅ Pas besoin de recharger manuellement ou de synchroniser

## Migration des données existantes

Pour migrer les données du fichier vers MongoDB, créer un script `scripts/migrate-events.js` :

```javascript
const mongoose = require('mongoose');
const Event = require('../src/models/Event');

// Données actuelles
const events = [
  {
    type: 'event',
    title: 'Conférence : Les valeurs islamiques',
    date: new Date('2026-01-15'),
    time: '20h00 - 22h00',
    location: 'Salle principale',
    category: 'Conférence',
    description: 'Conférence sur l\'importance des valeurs islamiques dans la vie quotidienne.',
    image: '/images/image-exemple1.jpg'
  },
  // ... autres événements
];

async function migrate() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mosquee-bleue');
    console.log('✅ Connecté à MongoDB');
    
    // Supprimer les anciennes données
    await Event.deleteMany({});
    
    // Insérer les nouvelles
    await Event.insertMany(events);
    console.log(`✅ ${events.length} événements migrés`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

migrate();
```

Exécuter avec : `node scripts/migrate-events.js`

## Checklist d'intégration

- [ ] Installer MongoDB et Mongoose
- [ ] Créer le modèle Event
- [ ] Configurer la connexion MongoDB dans server.js
- [ ] Modifier src/data/events.js pour utiliser MongoDB (fonctions async)
- [ ] Mettre à jour les routes index.js et evenements.js (async/await)
- [ ] Installer multer
- [ ] Configurer multer pour les uploads
- [ ] Créer le dossier public/images/events/
- [ ] Ajouter les routes CRUD dans admin.js
- [ ] Créer les vues admin (events-list.ejs et event-form.ejs)
- [ ] Créer le script de migration
- [ ] Migrer les données existantes
- [ ] Tester l'ajout d'un événement
- [ ] Vérifier l'affichage sur l'accueil (3 derniers)
- [ ] Vérifier l'affichage sur /evenements (tous)
- [ ] Tester la modification
- [ ] Tester la suppression

## Notes importantes

- **Toutes les pages utilisent le même module** (`src/data/events.js`), donc les changements sont automatiquement propagés partout
- **Le tri par date est automatique** grâce à `getEventsSortedByDate()` et l'index MongoDB
- **Les images sont stockées dans** `public/images/events/`
- **Sécurité** : Toutes les routes CRUD sont protégées par le middleware `isAuthenticated`
- **Validation** : À ajouter côté client et serveur pour améliorer la robustesse
