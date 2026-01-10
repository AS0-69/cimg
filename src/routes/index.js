const express = require('express');
const router = express.Router();
const { getRecentEvents } = require('../data/events');
const { getRecentNews } = require('../data/news');
const { getAllDonations } = require('../data/donations');
const { getAllQuotes } = require('../data/quotes');

// Page d'accueil
router.get('/', async (req, res) => {
  try {
    // Récupérer les 3 actualités les plus récentes depuis MySQL
    const actualites = await getRecentNews(3);

    // Récupérer les 3 événements les plus récents depuis MySQL
    const recentEvents = await getRecentEvents(3);
    
    // Récupérer les campagnes de dons actives
    const allDonations = await getAllDonations();
    const activeDonations = allDonations.filter(d => d.active).slice(0, 2);
    
    // Récupérer les citations actives (max 4)
    const allQuotes = await getAllQuotes();
    const activeQuotes = allQuotes.filter(q => q.active).slice(0, 4);

    res.render('index', { 
      title: 'Accueil - Mosquée Bleue',
      actualites,
      events: recentEvents,
      donations: activeDonations,
      quotes: activeQuotes,
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
