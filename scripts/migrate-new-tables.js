const { sequelize } = require('../src/config/database');
const Author = require('../src/models/Author');
const Pole = require('../src/models/Pole');
const Role = require('../src/models/Role');

async function migrateNewTables() {
    try {
        console.log('🔄 Migration des nouvelles tables...');
        
        // Connecter
        await sequelize.authenticate();
        console.log('✅ MySQL connecté');
        
        // Créer les tables
        await Author.sync({ force: true });
        await Pole.sync({ force: true });
        await Role.sync({ force: true });
        console.log('✅ Tables créées');
        
        // Auteurs avec honorifiques
        const authors = [
            { name: 'Le Prophète Muhammad (ﷺ)', is_system: true },
            { name: 'Abu Bakr As-Siddiq (RA)', is_system: true },
            { name: 'Umar ibn Al-Khattab (RA)', is_system: true },
            { name: 'Uthman ibn Affan (RA)', is_system: true },
            { name: 'Ali ibn Abi Talib (RA)', is_system: true },
            { name: 'Hassan Al-Basri (RH)', is_system: true },
            { name: 'Imam Al-Ghazali (RH)', is_system: true },
            { name: 'Ibn Taymiyyah (RH)', is_system: true },
            { name: 'Imam Malik (RH)', is_system: true },
            { name: 'Imam Ahmad (RH)', is_system: true }
        ];
        
        console.log('📥 Auteurs...');
        for (const author of authors) {
            await Author.create(author);
        }
        console.log(`✅ ${authors.length} auteurs créés`);
        
        // Pôles
        const poles = [
            { name: 'Administratif', is_system: true },
            { name: 'Cultuel', is_system: true },
            { name: 'Éducatif', is_system: true },
            { name: 'Jeunesse', is_system: true },
            { name: 'Femmes', is_system: true },
            { name: 'Communication', is_system: true }
        ];
        
        console.log('📥 Pôles...');
        for (const pole of poles) {
            await Pole.create(pole);
        }
        console.log(`✅ ${poles.length} pôles créés`);
        
        // Fonctions
        const roles = [
            { name: 'Président', is_system: true },
            { name: 'Vice-Président', is_system: true },
            { name: 'Secrétaire', is_system: true },
            { name: 'Trésorier', is_system: true },
            { name: 'Commission', is_system: true },
            { name: 'Membre', is_system: true },
            { name: 'Responsable', is_system: true }
        ];
        
        console.log('📥 Fonctions...');
        for (const role of roles) {
            await Role.create(role);
        }
        console.log(`✅ ${roles.length} fonctions créées`);
        
        console.log('🎉 Migration complète réussie!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

migrateNewTables();
