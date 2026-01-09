const express = require('express');
const router = express.Router();

// Page de don
router.get('/', (req, res) => {
  res.render('don', { 
    title: 'Faire un don - Mosquée Bleue',
    currentPath: req.path
  });
});

// Traitement du formulaire de don (à implémenter avec Stripe plus tard)
router.post('/process', (req, res) => {
  // TODO: Intégrer Stripe
  res.json({ success: true, message: 'Paiement en cours de traitement' });
});

module.exports = router;
