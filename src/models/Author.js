const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Author = sequelize.define('Author', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    },
    is_system: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'authors',
    timestamps: false
});

module.exports = Author;
