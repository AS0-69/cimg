const express = require('express');
const router = express.Router();

// Page d'adhésion
router.get('/', (req, res) => {
  res.render('adhesion', { 
    title: 'Adhésion - Mosquée Bleue',
    currentPath: req.path
  });
});

// Traitement du formulaire d'adhésion (à implémenter)
router.post('/', async (req, res) => {
  try {
    // TODO: Traiter l'adhésion et envoyer un email de confirmation
    res.json({ success: true, message: 'Adhésion enregistrée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'adhésion:', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue' });
  }
});

module.exports = router;
