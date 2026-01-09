const express = require('express');
const router = express.Router();
const { getEventsSortedByDate, getEventsByType } = require('../data/events');

// Page événements et activités
router.get('/', async (req, res) => {
  try {
    // Récupérer tous les événements triés par date depuis MySQL
    const allEvents = await getEventsSortedByDate();

    // Séparer événements et activités (afficher tous même si type vide/incorrect)
    const upcomingEvents = allEvents.filter(e => e.type && (e.type.toLowerCase().includes('event') || e.type.toLowerCase() === 'événement'));
    const activities = allEvents.filter(e => e.type && (e.type.toLowerCase().includes('activit') || e.type.toLowerCase() === 'cours'));
    
    // Les événements sans type reconnu vont dans événements par défaut
    const unclassified = allEvents.filter(e => !e.type || (!e.type.toLowerCase().includes('event') && !e.type.toLowerCase().includes('activit') && e.type.toLowerCase() !== 'événement' && e.type.toLowerCase() !== 'cours'));
    const events = [...upcomingEvents, ...unclassified];

    res.render('evenements', {
      title: 'Événements & Activités - Mosquée Bleue',
      currentPath: req.path,
      events: events,
      activities: activities,
      allItems: allEvents
    });
  } catch (error) {
    console.error('Erreur événements:', error);
    res.status(500).render('error', { 
      title: 'Erreur',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;
