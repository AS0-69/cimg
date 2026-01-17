const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Page de contact
router.get('/', (req, res) => {
  res.render('contact', { 
    title: 'Contact - Mosquée Bleue',
    currentPath: '/contact',
    errors: null,
    formData: {}
  });
});

// Traitement du formulaire de contact
router.post('/', [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('sujet').trim().notEmpty().withMessage('Le sujet est requis'),
  body('message').trim().notEmpty().withMessage('Le message est requis')
], (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('contact', {
      title: 'Contact - Mosquée Bleue',
      currentPath: '/contact',
      errors: errors.array(),
      formData: req.body
    });
  }

  // TODO: Envoyer l'email avec Nodemailer
  console.log('Nouveau message:', req.body);

  res.render('contact', {
    title: 'Contact - Mosquée Bleue',
    currentPath: '/contact',
    success: true,
    errors: null,
    formData: {}
  });
});

module.exports = router;
