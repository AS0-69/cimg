require('dotenv').config();
const { sequelize } = require('../src/config/database');

async function migrateQuotes() {
  try {
    console.log('🔄 Démarrage de la migration quotes...');
    
    await sequelize.authenticate();
    console.log('✅ Connecté à la base de données');
    
    // Vérifier si la colonne text_original existe
    const [columns] = await sequelize.query(`
      SHOW COLUMNS FROM quotes LIKE 'text_original'
    `);
    
    if (columns.length === 0) {
      console.log('📝 Ajout de la colonne "text_original"...');
      await sequelize.query(`
        ALTER TABLE quotes 
        ADD COLUMN text_original TEXT NOT NULL DEFAULT '' 
        COMMENT 'Texte original (arabe)' 
        AFTER id
      `);
      console.log('✅ Colonne "text_original" ajoutée avec succès');
    } else {
      console.log('ℹ️  La colonne "text_original" existe déjà');
    }
    
    // Mettre à jour les citations existantes avec des textes en arabe
    const [quotes] = await sequelize.query('SELECT id FROM quotes');
    
    if (quotes.length > 0) {
      console.log(`\n📝 Mise à jour de ${quotes.length} citation(s) existante(s)...`);
      
      const defaultArabicTexts = [
        "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
        "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ",
        "المؤمن للمضمن كالبنيان يشد بعضه بعضا",
        "خير الناس أنفعهم للناس"
      ];
      
      for (let i = 0; i < quotes.length; i++) {
        const arabicText = defaultArabicTexts[i % defaultArabicTexts.length];
        await sequelize.query(
          'UPDATE quotes SET text_original = ? WHERE id = ?',
          { replacements: [arabicText, quotes[i].id] }
        );
      }
      
      console.log('✅ Citations mises à jour');
    } else {
      console.log('ℹ️  Aucune citation à migrer');
    }
    
    console.log('\n🎉 Migration terminée avec succès !');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

migrateQuotes();
