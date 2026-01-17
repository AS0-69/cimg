const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuoteSource = sequelize.define('QuoteSource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Nom de la source (ex: Coran 2:153, Prophète Muhammad (ﷺ), Imam Muslim)'
  }
}, {
  tableName: 'quote_sources',
  timestamps: true
});

module.exports = QuoteSource;
