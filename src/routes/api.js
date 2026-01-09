const express = require('express');
const router = express.Router();
const { getEventById } = require('../data/events');
const { getNewsById } = require('../data/news');

// API pour récupérer un événement par son ID
router.get('/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Erreur API événement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// API pour récupérer une actualité par son ID
router.get('/news/:id', async (req, res) => {
  try {
    const newsId = parseInt(req.params.id);
    const news = await getNewsById(newsId);
    
    if (!news) {
      return res.status(404).json({ error: 'Actualité non trouvée' });
    }
    
    res.json(news);
  } catch (error) {
    console.error('Erreur API actualité:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
