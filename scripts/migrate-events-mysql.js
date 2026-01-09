const { sequelize, testConnection } = require('../src/config/database');
const Event = require('../src/models/Event');

// Données à migrer vers MySQL
const events = [
  {
    type: 'event',
    title: 'Conférence : Les valeurs islamiques',
    date: '2026-01-15',
    time: '20h00 - 22h00',
    location: 'Salle principale',
    category: 'Conférence',
    description: 'Conférence sur l\'importance des valeurs islamiques dans la vie quotidienne.',
    image: '/images/image-exemple1.jpg'
  },
  {
    type: 'activity',
    title: 'Cours d\'arabe pour débutants',
    date: '2026-01-20',
    time: '18h30 - 19h30',
    location: 'Salle 2',
    category: 'Cours',
    description: 'Démarrage d\'un nouveau cycle de cours d\'arabe pour les débutants.',
    image: '/images/image-exemple3.jpg'
  },
  {
    type: 'activity',
    title: 'Activité jeunesse : Sortie éducative',
    date: '2026-01-25',
    time: '14h00 - 18h00',
    location: 'Départ mosquée',
    category: 'Jeunesse',
    description: 'Sortie éducative pour les jeunes avec visite culturelle et activités.',
    image: '/images/image-exemple4.jpg'
  },
  {
    type: 'event',
    title: 'Conférence Ramadan 2026',
    date: '2026-02-10',
    time: '19h30 - 21h30',
    location: 'Salle principale',
    category: 'Conférence',
    description: 'Préparation spirituelle pour le mois béni de Ramadan.',
    image: '/images/image-exemple2.jpg'
  },
  {
    type: 'activity',
    title: 'Cours de Tajweed',
    date: '2026-02-15',
    time: '17h00 - 18h30',
    location: 'Salle 3',
    category: 'Cours',
    description: 'Perfectionnez votre récitation du Coran avec nos cours de Tajweed.',
    image: '/images/image-exemple1.jpg'
  }
];

async function migrate() {
  try {
    console.log('🔄 Démarrage de la migration...\n');
    
    // Connexion à MySQL
    const connected = await testConnection();
    if (!connected) {
      console.log('\n⚠️  ERREUR: Impossible de se connecter à MySQL');
      console.log('💡 Vérifiez que MySQL est démarré (XAMPP ou service MySQL)');
      console.log('💡 Vérifiez les identifiants dans le fichier .env\n');
      process.exit(1);
    }
    
    // Créer/recréer les tables (force: true = supprime et recrée)
    console.log('📋 Création des tables...');
    await sequelize.sync({ force: true });
    console.log('✅ Tables créées\n');
    
    // Insérer les données
    console.log('📥 Insertion des événements...');
    const created = await Event.bulkCreate(events);
    console.log(`✅ ${created.length} événements migrés avec succès!\n`);
    
    // Afficher les événements créés
    console.log('📊 Événements dans la base de données:');
    console.log('════════════════════════════════════════');
    created.forEach(event => {
      console.log(`  ${event.id}. [${event.type.toUpperCase()}] ${event.title}`);
      console.log(`     Date: ${event.date} | ${event.time}`);
      console.log('');
    });
    
    console.log('🎉 Migration terminée avec succès!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error.message);
    if (error.original) {
      console.error('   Détails:', error.original.message);
    }
    console.log('\n💡 Assurez-vous que:');
    console.log('   - MySQL est démarré (XAMPP ou service)');
    console.log('   - La base de données "mosquee_bleue" existe');
    console.log('   - Les identifiants dans .env sont corrects\n');
    process.exit(1);
  }
}

// Lancer la migration
migrate();
