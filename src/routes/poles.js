const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Event = require('../models/Event');

// Mapping between pole slugs and pole names
const poleMapping = {
  at: { pole: 'AT' },
  kt: { pole: 'KT' },
  gt: { pole: 'GT' },
  kgt: { pole: 'KGT' }
};

// Liste des pôles
const polesData = {
  at: {
    nom: "AT – Ana Teşkilat",
    slug: "at",
    description: "Organisation principale regroupant les hommes adultes. Rôle central de la mosquée : organisation des prières, cours religieux, gestion administrative et financière, orientation religieuse et coordination avec les autres pôles. Pôle de référence, garant du cadre religieux, organisationnel et éthique.",
    images: [
      "/images/mosquee_interieur.jpg",
      "/images/angle_gauche_interieur_mosquee.jpg",
      "/images/exterieur_mosquee.jpg",
      "/images/Logo_CIMG_VF_GT_MOSAIQUE.png"
    ],
    activites: [],
    facebook: "https://www.facebook.com/mavicamivillefranche/?locale=fr_FR",
    instagram: "https://www.instagram.com/mosqueebleue_cimg",
    tiktok: null
  },
  kt: {
    nom: "KT – Kadın Teşkilatı",
    slug: "kt",
    description: "Organisation des femmes adultes. Équivalent féminin de l'Ana Teşkilat avec autonomie organisationnelle. Organisation des activités religieuses féminines, enseignement, cercles d'étude, actions sociales et solidaires, soutien familial et participation active à la vie de la mosquée.",
    images: [
      "/images/Logo_CIMG_VF_GT_MOSAIQUE.png",
      "/images/mosquee_interieur.jpg",
      "/images/angle_gauche_interieur_mosquee.jpg",
      "/images/exterieur_mosquee.jpg"
    ],
    activites: [],
    facebook: "https://www.facebook.com/share/18LWk7Jm4b/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/cimg_kt_villefranche",
    tiktok: null
  },
  gt: {
    nom: "GT – Gençlik Teşkilatı",
    slug: "gt",
    description: "Organisation de la jeunesse masculine (garçons et jeunes hommes de 7 à 30 ans environ). Éducation religieuse adaptée à l'âge, accompagnement identitaire et spirituel, responsabilisation et engagement communautaire. Activités : cours (Coran, bases religieuses), sports, sorties, camps et formation de futurs cadres associatifs.",
    images: [
      "/images/Logo_CIMG_VF_GT_MOSAIQUE.png",
      "/images/mosquee_interieur.jpg",
      "/images/angle_gauche_interieur_mosquee.jpg",
      "/images/exterieur_mosquee.jpg"
    ],
    activites: [],
    facebook: "https://www.facebook.com/cimgvillefranche/?locale=fr_FR",
    instagram: "https://www.instagram.com/cimgvillefranchegenclik",
    tiktok: "https://www.tiktok.com/@cimgvillefranchegenclik"
  },
  kgt: {
    nom: "KGT – Kadın Gençlik Teşkilatı",
    slug: "kgt",
    description: "Organisation de la jeunesse féminine (jeunes filles et jeunes femmes de l'adolescence à 25-30 ans). Éducation religieuse et spirituelle, développement personnel, confiance en soi et engagement social. Activités : cours, formations, rencontres éducatives, activités culturelles et préparation aux responsabilités futures au sein de la KT.",
    images: [
      "/images/Logo_CIMG_VF_GT_MOSAIQUE.png",
      "/images/mosquee_interieur.jpg",
      "/images/angle_gauche_interieur_mosquee.jpg",
      "/images/exterieur_mosquee.jpg"
    ],
    activites: [],
    facebook: "http://facebook.com/cimgkgtvillefranche/",
    instagram: "https://www.instagram.com/kgtvillefranche",
    tiktok: null
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
router.get('/:slug', async (req, res) => {
  const pole = polesData[req.params.slug];
  
  if (!pole) {
    return res.status(404).render('404', { 
      title: 'Pôle non trouvé',
      currentPath: '/poles'
    });
  }

  try {
    const mapping = poleMapping[req.params.slug];
    
    let members = [];
    let parsedEvents = [];
    
    // Récupérer les membres du pôle (via pole)
    try {
      const memberResults = await Member.findAll({
        where: { 
          pole: mapping.pole,
          active: true
        },
        attributes: ['id', 'first_name', 'last_name', 'image', 'role', 'order'],
        order: [['order', 'ASC'], ['last_name', 'ASC'], ['first_name', 'ASC']]
      });
      members = memberResults.map(m => m.toJSON());
      console.log(`✅ Membres du pôle ${mapping.pole}:`, members.length);
    } catch (err) {
      console.error('Erreur récupération membres:', err);
    }

    // Récupérer les événements du pôle - limiter à 6
    try {
      const events = await Event.findAll({
        where: { 
          pole: mapping.pole
        },
        limit: 6,
        order: [['date', 'DESC']]
      });

      // Parser les images des événements
      parsedEvents = events.map(e => {
        const event = e.toJSON();
        if (event.images) {
          try {
            event.images = typeof event.images === 'string' ? JSON.parse(event.images) : event.images;
          } catch (err) {
            event.images = [];
          }
        }
        return event;
      });
    } catch (err) {
      console.error('Erreur récupération événements:', err);
    }

    res.render('pole-details', { 
      title: `${pole.nom} - Mosquée Bleue`,
      pole,
      members: members,
      events: parsedEvents,
      currentPath: '/poles/' + req.params.slug
    });
  } catch (error) {
    console.error('Erreur lors du chargement du pôle:', error);
    res.render('pole-details', {
      title: `${pole.nom} - Mosquée Bleue`,
      pole,
      members: [],
      events: [],
      currentPath: '/poles/' + req.params.slug
    });
  }
});

module.exports = router;
