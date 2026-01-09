const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Prénom'
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nom de famille'
  },
  pole: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Pôle/Département (Administratif, Cultuel, Éducatif, etc.)'
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Rôle/Fonction'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description/Bio'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Photo du membre'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Email de contact'
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Téléphone'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Ordre d\'affichage dans le pôle'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Membre actif ou non'
  }
}, {
  tableName: 'members',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    {
      name: 'pole_order_index',
      fields: ['pole', 'order']
    }
  ]
});

module.exports = Member;
