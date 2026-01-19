const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EventType = sequelize.define('EventType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nom du type (event, activity, ou personnalisé)'
  },
  label_fr: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Label en français'
  },
  label_tr: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Label en turc'
  },
  is_system: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Type système (non supprimable)'
  }
}, {
  tableName: 'event_types',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = EventType;
