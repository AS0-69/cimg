const { sequelize } = require('../src/config/database');

async function updateTestImages() {
    try {
        console.log('🔄 Mise à jour des images de test...');
        
        await sequelize.authenticate();
        console.log('✅ MySQL connecté');

        // Mettre à jour le premier événement avec une image
        await sequelize.query(`
            UPDATE events 
            SET images = '["\/images\/events\/conference-test.jpg"]' 
            WHERE id = 1
        `);
        console.log('✅ Image ajoutée au premier événement');

        // Mettre à jour la première actualité avec une image
        await sequelize.query(`
            UPDATE news 
            SET image = '/images/news/actualite-test.jpg' 
            WHERE id = 1
        `);
        console.log('✅ Image ajoutée à la première actualité');

        // Mettre à jour le premier membre avec une image
        await sequelize.query(`
            UPDATE members 
            SET image = '/images/team/president.jpg' 
            WHERE id = 1
        `);
        console.log('✅ Image ajoutée au premier membre');

        // Mettre à jour la première campagne de dons avec une image
        await sequelize.query(`
            UPDATE donations 
            SET image = '/images/ramadan-don.jpg' 
            WHERE id = 1
        `);
        console.log('✅ Image ajoutée à la première campagne de dons');

        console.log('🎉 Toutes les images de test ont été ajoutées!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

updateTestImages();
