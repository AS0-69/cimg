const express = require('express');
const router = express.Router();
const { getAllDonations } = require('../data/donations');

// Page de don
router.get('/', async (req, res) => {
  try {
    // Récupérer les campagnes actives
    const allDonations = await getAllDonations();
    const activeDonations = allDonations.filter(d => d.active);
    
    res.render('don', { 
      title: 'Faire un don - Mosquée Bleue',
      currentPath: req.path,
      donations: activeDonations
    });
  } catch (error) {
    console.error('Erreur chargement donations:', error);
    res.render('don', { 
      title: 'Faire un don - Mosquée Bleue',
      currentPath: req.path,
      donations: []
    });
  }
});

// Traitement du formulaire de don (à implémenter avec Stripe plus tard)
router.post('/process', (req, res) => {
  // TODO: Intégrer Stripe
  res.json({ success: true, message: 'Paiement en cours de traitement' });
});

module.exports = router;
