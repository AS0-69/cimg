const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'event',
    comment: 'Type personnalisable'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Titre de l\'événement'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    },
    comment: 'Date de l\'événement (format YYYY-MM-DD)'
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Heure de début'
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Heure de fin'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Lieu de l\'événement'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Catégorie'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Description complète'
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des images (JSON array)'
  }
}, {
  tableName: 'events',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    {
      name: 'date_index',
      fields: ['date']
    },
    {
      name: 'type_index',
      fields: ['type']
    }
  ]
});

module.exports = Event;
