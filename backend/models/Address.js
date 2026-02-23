const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'full_name'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    addressLine1: {
        type: DataTypes.STRING(300),
        allowNull: false,
        field: 'address_line1'
    },
    addressLine2: {
        type: DataTypes.STRING(300),
        allowNull: true,
        field: 'address_line2'
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    pincode: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(100),
        defaultValue: 'India'
    },
    landmark: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    addressType: {
        type: DataTypes.ENUM('home', 'work', 'other'),
        defaultValue: 'home',
        field: 'address_type'
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_default'
    }
}, {
    tableName: 'addresses'
});

module.exports = Address;
