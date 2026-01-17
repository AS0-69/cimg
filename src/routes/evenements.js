const express = require('express');
const router = express.Router();
const { getEventsSortedByDate, getEventsByType } = require('../data/events');
const { getRecentNews } = require('../data/news');

// Page événements et activités
router.get('/', async (req, res) => {
  try {
    // Récupérer tous les événements triés par date depuis MySQL
    const allEvents = await getEventsSortedByDate();
    
    // Récupérer les actualités récentes
    const news = await getRecentNews(6); // 6 actualités les plus récentes
    
    // Séparer les événements par date (passés et à venir)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = allEvents.filter(e => new Date(e.date) >= today);
    const pastEvents = allEvents.filter(e => new Date(e.date) < today);

    res.render('evenements', {
      title: 'Événements & Activités - Mosquée Bleue',
      currentPath: '/evenements',
      upcomingEvents: upcomingEvents,
      pastEvents: pastEvents,
      news: news,
      allItems: allEvents
    });
  } catch (error) {
    console.error('Erreur événements:', error);
    const lang = req.cookies.lang || 'fr';
    const t = require(`../i18n/${lang}.json`);
    res.status(500).render('error', { 
      title: 'Erreur',
      error: process.env.NODE_ENV === 'development' ? error : {},
      currentPath: '/evenements',
      t: t
    });
  }
});

module.exports = router;
