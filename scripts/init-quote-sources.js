/**
 * Script pour initialiser les sources de citations par défaut
 */
const { sequelize } = require('../src/config/database');
const QuoteSource = require('../src/models/QuoteSource');
const { getOrCreateQuoteSource } = require('../src/data/quoteSources');

const defaultSources = [
  'Prophète Muhammad (ﷺ)',
  'Coran 2:153',
  'Coran 2:286',
  'Coran 3:200',
  'Hadith - Bukhari',
  'Hadith - Muslim',
  'Hadith Qudsi',
  'Imam Al-Ghazali',
  'Imam Ahmad ibn Hanbal',
  'Abu Bakr As-Siddiq (ra)',
  'Umar ibn Al-Khattab (ra)',
  'Ali ibn Abi Talib (ra)',
  'Aisha (ra)'
];

async function initQuoteSources() {
  try {
    console.log('🔄 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connecté');

    console.log('🔄 Synchronisation du modèle QuoteSource...');
    await QuoteSource.sync({ alter: true });
    console.log('✅ Table quote_sources prête');

    console.log('\n🔄 Ajout des sources par défaut...');
    for (const sourceName of defaultSources) {
      const source = await getOrCreateQuoteSource(sourceName);
      console.log(`   ✓ ${source.name}`);
    }

    console.log('\n✅ Initialisation terminée !');
    console.log(`📊 ${defaultSources.length} sources créées ou vérifiées`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Lancer le script
if (require.main === module) {
  initQuoteSources();
}

module.exports = { initQuoteSources, defaultSources };
