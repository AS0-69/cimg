const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [3, 50]
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'moderator'),
        defaultValue: 'admin',
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    failed_login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    locked_until: {
        type: DataTypes.DATE,
        allowNull: true
    },
    tag: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Tag du pôle (KT, AT, KGT, GT, etc.)'
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            events: true,
            news: true,
            quotes: true,
            members: true,
            donations: true,
            settings: false,
            audit_logs: false,
            users: false
        },
        comment: 'Permissions d\'accès aux différentes sections',
        get() {
            const rawValue = this.getDataValue('permissions');
            if (!rawValue) {
                return {
                    events: true,
                    news: true,
                    quotes: true,
                    members: true,
                    donations: true,
                    settings: false,
                    audit_logs: false,
                    users: false
                };
            }
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        },
        set(value) {
            this.setDataValue('permissions', value);
        }
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

module.exports = User;
