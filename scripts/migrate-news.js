const { sequelize, testConnection } = require('../src/config/database');
const News = require('../src/models/News');

// Données initiales
const newsData = [
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
  },
  {
    titre: "Collecte alimentaire Ramadan",
    date: "5 janvier 2026",
    description: "Organisation de la collecte alimentaire annuelle pour les familles dans le besoin.",
    image: "/images/image-exemple3.jpg",
    categorie: "Solidarité"
  }
];

async function migrate() {
  try {
    console.log('🔄 Démarrage de la migration des actualités...\n');
    
    const connected = await testConnection();
    if (!connected) {
      console.log('\n⚠️  MySQL non disponible');
      process.exit(1);
    }
    
    // Synchroniser juste la table news
    console.log('📋 Création de la table news...');
    await News.sync({ force: true });
    console.log('✅ Table créée\n');
    
    // Insérer les données
    console.log('📥 Insertion des actualités...');
    const created = await News.bulkCreate(newsData);
    console.log(`✅ ${created.length} actualités créées!\n`);
    
    console.log('📊 Actualités dans la base de données:');
    console.log('════════════════════════════════════════');
    created.forEach(news => {
      console.log(`  ${news.id}. [${news.categorie}] ${news.titre}`);
      console.log(`     ${news.date}`);
      console.log('');
    });
    
    console.log('🎉 Migration terminée avec succès!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  }
}

migrate();
