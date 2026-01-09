const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mosquee_bleue',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Désactiver les logs SQL en production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// Test de connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connecté avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur MySQL:', error.message);
    console.log('⚠️  Assurez-vous que MySQL est démarré (XAMPP ou service MySQL)');
    return false;
  }
}

module.exports = { sequelize, testConnection };
