const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text_fr: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Texte de la citation en français'
  },
  text_tr: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Texte de la citation en turc'
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Auteur de la citation'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Citation active ou non'
  }
}, {
  tableName: 'quotes',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Quote;
