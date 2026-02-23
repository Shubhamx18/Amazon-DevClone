const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('customer', 'seller', 'admin'),
        defaultValue: 'customer'
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_verified'
    },
    sellerName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'seller_name'
    },
    sellerDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'seller_description'
    },
    sellerLogo: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'seller_logo'
    },
    sellerRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        field: 'seller_rating'
    }
}, {
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        }
    }
});

User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = User;
