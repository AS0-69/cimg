const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Titre de l\'actualité'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Contenu complet de l\'actualité'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Première image principale (legacy)'
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Tableau d\'images pour l\'actualité'
  },
  category: {
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
