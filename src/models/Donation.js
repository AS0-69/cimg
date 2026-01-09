const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Titre de la campagne'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Description'
  },
  goal_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Montant objectif'
  },
  current_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Montant actuel'
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date de fin'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Campagne active'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Image de la campagne'
  }
}, {
  tableName: 'donations',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Donation;
