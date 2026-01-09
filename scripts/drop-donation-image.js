const mysql = require('mysql2/promise');

async function dropDonationImageColumn() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mosquee_bleue'
    });

    try {
        console.log('🗑️  Suppression de la colonne image de la table donations...');
        
        await connection.execute('ALTER TABLE donations DROP COLUMN image');
        
        console.log('✅ Colonne image supprimée avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error.message);
    } finally {
        await connection.end();
    }
}

dropDonationImageColumn();
