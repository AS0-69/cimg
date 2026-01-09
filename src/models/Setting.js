const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Clé du paramètre'
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Valeur du paramètre'
  },
  type: {
    type: DataTypes.ENUM('text', 'number', 'boolean', 'json'),
    defaultValue: 'text',
    comment: 'Type de donnée'
  },
  label_fr: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Label en français'
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'general',
    comment: 'Catégorie du paramètre'
  }
}, {
  tableName: 'settings',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Setting;
