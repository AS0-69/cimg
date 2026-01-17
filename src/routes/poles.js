const express = require('express');
const router = express.Router();

// Liste des pôles
const polesData = {
  at: {
    nom: "Pôle Principal (AT)",
    slug: "at",
    description: "Le pôle principal assure les activités quotidiennes de la mosquée.",
    image: "/images/mosquee_interieur.jpg",
    activites: [
      "Prières quotidiennes (5 prières)",
      "Cours d'arabe et de Coran",
      "Conférences religieuses",
      "Accompagnement spirituel"
    ]
  },
  kt: {
    nom: "Pôle KT",
    slug: "kt",
    description: "Le pôle KT se concentre sur l'enseignement et l'éducation islamique.",
    image: "/images/Logo_CIMG_VF_GT_MOSAIQUE.png",
    activites: [
      "Cours de Coran pour enfants",
      "Enseignement de la langue arabe",
      "Études islamiques",
      "Mémorisation du Coran"
    ]
  },
  jeunesse: {
    nom: "Pôle Jeunesse",
    slug: "jeunesse",
    description: "Un espace dédié aux jeunes pour leur épanouissement spirituel et social.",
    image: "/images/Logo_CIMG_VF_GT_MOSAIQUE.png",
    activites: [
      "Activités sportives",
      "Ateliers créatifs",
      "Débats et conférences",
      "Sorties et camps"
    ]
  },
  kgt: {
    nom: "Pôle KGT",
    slug: "kgt",
    description: "Le pôle KGT gère les aspects culturels et communautaires.",
    image: "/images/Logo_CIMG_VF_GT_MOSAIQUE.png",
    activites: [
      "Événements culturels",
      "Célébrations religieuses",
      "Actions solidaires",
      "Rencontres intercommunautaires"
    ]
  }
};

// Page liste des pôles
router.get('/', (req, res) => {
  res.render('poles', { 
    title: 'Nos Pôles - Mosquée Bleue',
    poles: Object.values(polesData),
    currentPath: '/poles'
  });
});

// Page détail d'un pôle
router.get('/:slug', (req, res) => {
  const pole = polesData[req.params.slug];
  
  if (!pole) {
    return res.status(404).render('404', { 
      title: 'Pôle non trouvé',
      currentPath: '/poles'
    });
  }

  res.render('pole-details', { 
    title: `${pole.nom} - Mosquée Bleue`,
    pole,
    currentPath: '/poles/' + req.params.slug
  });
});

module.exports = router;
