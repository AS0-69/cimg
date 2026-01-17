const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
require('dotenv').config();
const { sequelize, testConnection } = require('./src/config/database');

// Importer tous les modèles pour les créer
require('./src/models/Event');
require('./src/models/News');
require('./src/models/Quote');
require('./src/models/QuoteSource');
require('./src/models/Member');
require('./src/models/EventType');
require('./src/models/Location');
require('./src/models/Category');
require('./src/models/Setting');
require('./src/models/Donation');
require('./src/models/Author');
require('./src/models/Pole');
require('./src/models/Role');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://mawaqit.net"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      connectSrc: ["'self'", "https://mawaqit.net", "http://localhost:3000"],
      frameSrc: ["https://www.google.com", "https://maps.google.com"]
    }
  }
}));

// Compression des réponses
app.use(compression());

// CORS
app.use(cors());

// Middleware pour parser les données
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour cookies
app.use(require('cookie-parser')());

// Middleware pour les helpers de vues
app.use(require('./src/middleware/viewHelpers'));

// Middleware pour la langue
app.use((req, res, next) => {
  // Récupérer la langue depuis le cookie ou utiliser 'fr' par défaut
  const lang = req.cookies.lang || 'fr';
  res.locals.currentLang = lang;
  
  // Charger les traductions
  try {
    const translations = require(`./src/i18n/${lang}.json`);
    res.locals.t = translations;
  } catch (err) {
    // Fallback to French if translation file doesn't exist
    const translations = require('./src/i18n/fr.json');
    res.locals.t = translations;
  }
  
  next();
});

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRouter = require('./src/routes/index');
const polesRouter = require('./src/routes/poles');
const donRouter = require('./src/routes/don');
const contactRouter = require('./src/routes/contact');
const legalRouter = require('./src/routes/legal');
const adminRouter = require('./src/routes/admin');
const adhesionRouter = require('./src/routes/adhesion');
const evenementsRouter = require('./src/routes/evenements');
const apiRouter = require('./src/routes/api');

app.use('/', indexRouter);
app.use('/poles', polesRouter);
app.use('/don', donRouter);
app.use('/contact', contactRouter);
app.use('/', legalRouter);
app.use('/admin', adminRouter);
app.use('/adhesion', adhesionRouter);
app.use('/evenements', evenementsRouter);
app.use('/api', apiRouter);

// Page 404
app.use((req, res) => {
  res.status(404).render('404', { 
    title: 'Page non trouvée',
    currentPath: req.originalUrl || req.path
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  const lang = req.cookies.lang || 'fr';
  const t = require(`./src/i18n/${lang}.json`);
  res.status(500).render('error', { 
    title: 'Erreur',
    error: process.env.NODE_ENV === 'development' ? err : {},
    currentPath: req.originalUrl || req.path,
    t: t
  });
});

// Fonction d'initialisation de la base de données
async function initDatabase() {
  const connected = await testConnection();
  if (connected) {
    // Synchroniser les modèles (créer les tables si elles n'existent pas)
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');
  } else {
    console.log('⚠️  Le serveur démarre sans base de données');
    console.log('💡 Installez XAMPP ou démarrez MySQL pour activer la base de données');
  }
}

// Démarrage du serveur avec initialisation de la DB
async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Environnement: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();

module.exports = app;
