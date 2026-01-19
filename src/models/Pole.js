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
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'JSON array of image paths for carousel'
    },
    facebook: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Facebook page URL'
    },
    instagram: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Instagram page URL'
    },
    tiktok: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'TikTok page URL (mainly for Jeunesse)'
    }
}, {
    tableName: 'poles',
    timestamps: false
});

module.exports = Pole;
