const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserTag = sequelize.define('UserTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'user_tags',
    timestamps: true,
    underscored: true
});

module.exports = UserTag;
