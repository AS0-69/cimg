const express = require('express');
const router = express.Router();

// Page Mentions Légales
router.get('/mentions-legales', (req, res) => {
    res.render('mentions-legales', {
        title: 'Mentions Légales - Mosquée Bleue',
        currentPath: req.path
    });
});

// Page Politique de Confidentialité
router.get('/confidentialite', (req, res) => {
    res.render('confidentialite', {
        title: 'Politique de Confidentialité - Mosquée Bleue',
        currentPath: req.path
    });
});

module.exports = router;
