const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Titre de l\'actualité'
  },
  date: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Date affichée (ex: 15 janvier 2026)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Description courte'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '/images/default-news.jpg',
    comment: 'Chemin de l\'image'
  },
  categorie: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Catégorie (Annonce, Éducation, Solidarité, etc.)'
  }
}, {
  tableName: 'news',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = News;
