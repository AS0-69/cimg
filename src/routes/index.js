const express = require('express');
const router = express.Router();
const { getRecentEvents } = require('../data/events');
const { getRecentNews } = require('../data/news');

// Page d'accueil
router.get('/', async (req, res) => {
  try {
    // Récupérer les 3 actualités les plus récentes depuis MySQL
    const actualites = await getRecentNews(3);

    // Récupérer les 3 événements les plus récents depuis MySQL
    const recentEvents = await getRecentEvents(3);

    res.render('index', { 
      title: 'Accueil - Mosquée Bleue',
      actualites,
      events: recentEvents,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Erreur accueil:', error);
    res.status(500).render('error', { 
      title: 'Erreur',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;
