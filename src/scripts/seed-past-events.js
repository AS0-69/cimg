const { sequelize } = require('../config/database');
const Event = require('../models/Event');

async function createPastEvents() {
  try {
    console.log('📅 Création d\'événements passés...');
    
    const pastEvents = await Event.bulkCreate([
      {
        title: 'Conférence : La patience dans l\'Islam',
        description: 'Conférence enrichissante sur l\'importance de la patience (sabr) dans notre foi et notre vie quotidienne. Sheikh Ahmed a partagé de nombreux enseignements tirés du Coran et de la Sunnah.',
        category: 'Conférence',
        date: '2025-12-15',
        start_time: '20:00',
        end_time: '22:00',
        location: 'Salle principale',
        images: JSON.stringify(['/images/events/conference-test.jpg']),
        max_participants: 150,
        registration_required: true
      },
      {
        title: 'Cours de Tajweed - Session d\'hiver',
        description: 'Session intensive de perfectionnement de la récitation du Coran. Les participants ont appris les règles avancées du tajweed.',
        category: 'Cours',
        date: '2025-12-20',
        start_time: '18:30',
        end_time: '20:00',
        location: 'Salle 2',
        images: JSON.stringify(['/images/events/images-1767914064641-946711861.png']),
        max_participants: 25,
        registration_required: true
      },
      {
        title: 'Journée sportive jeunesse',
        description: 'Grande journée sportive organisée pour les jeunes avec tournoi de football, basketball et activités ludiques. Un franc succès avec plus de 50 participants !',
        category: 'Sport',
        date: '2025-12-28',
        start_time: '14:00',
        end_time: '18:00',
        location: 'Complexe sportif',
        images: JSON.stringify(['/images/events/image-1767917880535-297740470.png', '/images/events/images-1768032590319-729641103.png']),
        max_participants: 60,
        registration_required: true
      },
      {
        title: 'Collecte alimentaire de Noël',
        description: 'Grande collecte solidaire pour les familles dans le besoin. Merci à tous les généreux donateurs ! Plus de 150 colis ont été distribués.',
        category: 'Solidarité',
        date: '2026-01-05',
        start_time: '10:00',
        end_time: '18:00',
        location: 'Hall de la mosquée',
        images: JSON.stringify(['/images/events/image-1768033587330-993491736.png', '/images/events/image-1768033866156-204225852.png']),
        max_participants: null,
        registration_required: false
      },
      {
        title: 'Cercle d\'études - Tafsir Al-Baqarah',
        description: 'Étude approfondie de sourate Al-Baqarah avec explication des versets et contexte de révélation. Session réservée aux sœurs.',
        category: 'Études islamiques',
        date: '2026-01-08',
        start_time: '14:00',
        end_time: '16:00',
        location: 'Salle femmes',
        images: JSON.stringify(['/images/events/image-1767916668343-777691427.png']),
        max_participants: 30,
        registration_required: false
      },
      {
        title: 'Atelier calligraphie pour enfants',
        description: 'Initiation à la calligraphie arabe pour les enfants de 8 à 12 ans. Un atelier créatif et éducatif très apprécié !',
        category: 'Culture',
        date: '2026-01-12',
        start_time: '15:00',
        end_time: '17:00',
        location: 'Salle culturelle',
        images: JSON.stringify(['/images/events/image-1768033527570-230798718.png']),
        max_participants: 20,
        registration_required: true
      },
      {
        title: 'Cours d\'arabe intensif - Niveau 1',
        description: 'Première session du cours d\'arabe pour débutants. Les bases de l\'alphabet et de la prononciation ont été abordées.',
        category: 'Cours',
        date: '2026-01-10',
        start_time: '18:30',
        end_time: '20:00',
        location: 'Salle 2',
        images: JSON.stringify(['/images/events/images-1767914064641-946711861.png']),
        max_participants: 25,
        registration_required: true
      },
      {
        title: 'Réunion conseil d\'administration',
        description: 'Réunion mensuelle du conseil d\'administration pour faire le bilan des activités et planifier les projets à venir.',
        category: 'Événement',
        date: '2026-01-14',
        start_time: '19:00',
        end_time: '21:00',
        location: 'Salle de réunion',
        images: JSON.stringify(['/images/events/images-1768033900588-499616339.png']),
        max_participants: 15,
        registration_required: false
      }
    ]);
    
    console.log(`✅ ${pastEvents.length} événements passés créés avec succès !`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des événements passés:', error);
    process.exit(1);
  }
}

// Exécution
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie\n');
    
    await createPastEvents();
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    process.exit(1);
  }
})();
