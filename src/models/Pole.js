const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pole = sequelize.define('Pole', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    is_system: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'poles',
    timestamps: false
});

module.exports = Pole;
