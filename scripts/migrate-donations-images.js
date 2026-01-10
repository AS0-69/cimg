/**
 * Script de migration pour ajouter la colonne 'images' à la table donations
 * Exécuter avec: node scripts/migrate-donations-images.js
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');

async function migrate() {
    try {
        console.log('🔄 Début de la migration...');
        
        // Vérifier si la colonne existe déjà
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'donations' 
            AND COLUMN_NAME = 'images'
            AND TABLE_SCHEMA = DATABASE()
        `);
        
        if (results.length > 0) {
            console.log('✅ La colonne "images" existe déjà dans la table donations');
        } else {
            console.log('📝 Ajout de la colonne "images" à la table donations...');
            
            // Ajouter la colonne images
            await sequelize.query(`
                ALTER TABLE donations 
                ADD COLUMN images JSON NULL DEFAULT NULL 
                COMMENT 'Images multiples de la campagne'
            `);
            
            console.log('✅ Colonne "images" ajoutée avec succès');
        }
        
        // Migrer les anciennes images (si elles existent)
        console.log('🔄 Migration des anciennes images...');
        const [donations] = await sequelize.query(`
            SELECT id, image 
            FROM donations 
            WHERE image IS NOT NULL 
            AND (images IS NULL OR JSON_LENGTH(images) = 0)
        `);
        
        if (donations.length > 0) {
            for (const donation of donations) {
                const imagesArray = JSON.stringify([donation.image]);
                await sequelize.query(`
                    UPDATE donations 
                    SET images = ? 
                    WHERE id = ?
                `, {
                    replacements: [imagesArray, donation.id]
                });
                console.log(`  ✓ Migration de l'image pour la donation #${donation.id}`);
            }
            console.log(`✅ ${donations.length} image(s) migrée(s)`);
        } else {
            console.log('ℹ️  Aucune image à migrer');
        }
        
        console.log('\n🎉 Migration terminée avec succès !');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

// Exécuter la migration
migrate();
