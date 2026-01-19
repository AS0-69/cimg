const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID de l\'utilisateur qui a effectué l\'action'
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Nom d\'utilisateur pour historique'
    },
    action: {
        type: DataTypes.ENUM(
            'LOGIN_SUCCESS',
            'LOGIN_FAILED',
            'LOGOUT',
            'CREATE',
            'UPDATE',
            'DELETE',
            'EXPORT',
            'VIEW'
        ),
        allowNull: false,
        comment: 'Type d\'action effectuée'
    },
    resource_type: {
        type: DataTypes.ENUM(
            'USER',
            'EVENT',
            'NEWS',
            'QUOTE',
            'MEMBER',
            'DONATION',
            'SETTING'
        ),
        allowNull: true,
        comment: 'Type de ressource affectée'
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID de la ressource affectée'
    },
    resource_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Nom/titre de la ressource pour référence'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description détaillée de l\'action'
    },
    old_values: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: 'Valeurs avant modification (JSON)',
        get() {
            const rawValue = this.getDataValue('old_values');
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue('old_values', value ? JSON.stringify(value) : null);
        }
    },
    new_values: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: 'Valeurs après modification (JSON)',
        get() {
            const rawValue = this.getDataValue('new_values');
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue('new_values', value ? JSON.stringify(value) : null);
        }
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'Adresse IP de l\'utilisateur (IPv4 ou IPv6)'
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'User agent du navigateur'
    },
    status: {
        type: DataTypes.ENUM('SUCCESS', 'FAILURE', 'WARNING'),
        defaultValue: 'SUCCESS',
        allowNull: false
    },
    error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Message d\'erreur si échec'
    }
}, {
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false, // Pas de mise à jour possible - logs immuables
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['action'] },
        { fields: ['resource_type'] },
        { fields: ['created_at'] },
        { fields: ['username'] }
    ]
});

module.exports = AuditLog;
