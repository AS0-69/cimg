const { sequelize, testConnection } = require('../src/config/database');
const EventType = require('../src/models/EventType');
const Location = require('../src/models/Location');
const Category = require('../src/models/Category');
const Setting = require('../src/models/Setting');
const Event = require('../src/models/Event');
const News = require('../src/models/News');
const Quote = require('../src/models/Quote');
const Member = require('../src/models/Member');
const Donation = require('../src/models/Donation');

async function migrateAll() {
  try {
    console.log('🔄 Migration complète du système...\n');
    
    const connected = await testConnection();
    if (!connected) {
      console.log('\n⚠️  MySQL non disponible');
      process.exit(1);
    }
    
    // Synchroniser toutes les tables
    console.log('📋 Création des tables...');
    await sequelize.sync({ force: true });
    console.log('✅ Tables créées\n');
    
    // 1. Types d'événements
    console.log('📥 Types d\'événements...');
    await EventType.bulkCreate([
      { name: 'event', label_fr: 'Événement', label_tr: 'Etkinlik', is_system: true },
      { name: 'activity', label_fr: 'Activité', label_tr: 'Aktivite', is_system: true },
      { name: 'conference', label_fr: 'Conférence', label_tr: 'Konferans', is_system: false },
      { name: 'course', label_fr: 'Cours', label_tr: 'Ders', is_system: false }
    ]);
    console.log('✅ 4 types créés');
    
    // 2. Lieux
    console.log('📥 Lieux...');
    await Location.bulkCreate([
      { name: 'CIMG Mosquée Bleue', is_system: true },
      { name: 'Salle principale', is_system: true },
      { name: 'Salle 2', is_system: false },
      { name: 'Salle 3', is_system: false },
      { name: 'Extérieur', is_system: false }
    ]);
    console.log('✅ 5 lieux créés');
    
    // 3. Catégories
    console.log('📥 Catégories...');
    await Category.bulkCreate([
      { name: 'Conférence', is_system: false },
      { name: 'Cours', is_system: false },
      { name: 'Jeunesse', is_system: false },
      { name: 'Femmes', is_system: false },
      { name: 'Famille', is_system: false },
      { name: 'Ramadan', is_system: false }
    ]);
    console.log('✅ 6 catégories créées');
    
    // 4. Paramètres
    console.log('📥 Paramètres du site...');
    await Setting.bulkCreate([
      { key: 'site_name', value: 'CIMG Mosquée Bleue', type: 'text', label_fr: 'Nom du site', category: 'general' },
      { key: 'site_address', value: '123 Rue de la Mosquée, 75000 Paris', type: 'text', label_fr: 'Adresse', category: 'contact' },
      { key: 'site_phone', value: '01 23 45 67 89', type: 'text', label_fr: 'Téléphone', category: 'contact' },
      { key: 'site_email', value: 'contact@mosqueebleue.fr', type: 'text', label_fr: 'Email', category: 'contact' },
      { key: 'facebook_url', value: 'https://facebook.com/mosqueebleue', type: 'text', label_fr: 'Facebook', category: 'social' },
      { key: 'instagram_url', value: 'https://instagram.com/mosqueebleue', type: 'text', label_fr: 'Instagram', category: 'social' }
    ]);
    console.log('✅ 6 paramètres créés');
    
    // 5. Événements
    console.log('📥 Événements...');
    await Event.bulkCreate([
      {
        type: 'event',
        title: 'Conférence : Les valeurs islamiques',
        date: '2026-01-15',
        start_time: '20:00:00',
        end_time: '22:00:00',
        location: 'Salle principale',
        category: 'Conférence',
        description: 'Conférence sur l\'importance des valeurs islamiques dans la vie quotidienne.',
        images: JSON.stringify(['/images/image-exemple1.jpg'])
      },
      {
        type: 'activity',
        title: 'Cours d\'arabe pour débutants',
        date: '2026-01-20',
        start_time: '18:30:00',
        end_time: '19:30:00',
        location: 'Salle 2',
        category: 'Cours',
        description: 'Démarrage d\'un nouveau cycle de cours d\'arabe pour les débutants.',
        images: JSON.stringify(['/images/image-exemple3.jpg'])
      }
    ]);
    console.log('✅ 2 événements créés');
    
    // 6. Actualités
    console.log('📥 Actualités...');
    await News.bulkCreate([
      {
        titre: "Ouverture du nouveau centre culturel",
        date: "15 janvier 2026",
        description: "Nous sommes heureux d'annoncer l'ouverture prochaine de notre nouveau centre culturel.",
        image: "/images/image-exemple1.jpg",
        categorie: "Annonce"
      },
      {
        titre: "Cours d'arabe pour enfants",
        date: "10 janvier 2026",
        description: "Les inscriptions pour les cours d'arabe débutent ce mois-ci. Places limitées.",
        image: "/images/image-exemple2.jpg",
        categorie: "Éducation"
      }
    ]);
    console.log('✅ 2 actualités créées');
    
    // 7. Citations
    console.log('📥 Citations...');
    await Quote.bulkCreate([
      {
        text_fr: "La meilleure des actions est celle qui est régulière, même si elle est petite.",
        text_tr: "En iyi amel, küçük olsa bile düzenli olandır.",
        author: "Prophète Muhammad (ﷺ)",
        active: true
      },
      {
        text_fr: "Celui qui ne remercie pas les gens ne remercie pas Allah.",
        text_tr: "İnsanlara teşekkür etmeyen, Allah'a da teşekkür etmez.",
        author: "Prophète Muhammad (ﷺ)",
        active: true
      }
    ]);
    console.log('✅ 2 citations créées');
    
    // 8. Membres
    console.log('📥 Membres de l\'équipe...');
    await Member.bulkCreate([
      {
        first_name: 'Ahmed',
        last_name: 'YILMAZ',
        pole: 'Administratif',
        role: 'Président',
        description: 'Président de la mosquée depuis 2020',
        image: '/images/team/president.jpg',
        email: 'president@mosqueebleue.fr',
        order: 1,
        active: true
      },
      {
        first_name: 'Mehmet',
        last_name: 'DEMIR',
        pole: 'Cultuel',
        role: 'Imam',
        description: 'Imam et enseignant',
        image: '/images/team/imam.jpg',
        email: 'imam@mosqueebleue.fr',
        order: 1,
        active: true
      },
      {
        first_name: 'Fatma',
        last_name: 'KAYA',
        pole: 'Éducatif',
        role: 'Responsable cours d\'arabe',
        description: 'Enseignante de langue arabe',
        image: '/images/team/teacher.jpg',
        order: 1,
        active: true
      }
    ]);
    console.log('✅ 3 membres créés');
    
    // 9. Campagnes de dons
    console.log('📥 Campagnes de dons...');
    await Donation.bulkCreate([
      {
        title: 'Ramadan 2026',
        description: 'Collecte pour les familles dans le besoin durant le Ramadan',
        goal_amount: 10000,
        current_amount: 3500,
        end_date: '2026-03-31',
        active: true,
        image: '/images/ramadan-don.jpg'
      },
      {
        title: 'Travaux de rénovation',
        description: 'Rénovation de la salle de prière principale',
        goal_amount: 50000,
        current_amount: 12000,
        end_date: '2026-12-31',
        active: true,
        image: '/images/travaux-don.jpg'
      }
    ]);
    console.log('✅ 2 campagnes créées');
    
    console.log('\n🎉 Migration complète réussie!\n');
    console.log('📊 Résumé:');
    console.log('  - 4 types d\'événements');
    console.log('  - 5 lieux');
    console.log('  - 6 catégories');
    console.log('  - 6 paramètres');
    console.log('  - 2 événements');
    console.log('  - 2 actualités');
    console.log('  - 2 citations');
    console.log('  - 3 membres');
    console.log('  - 2 campagnes de dons');
    console.log('\n✅ Tout est prêt!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateAll();
