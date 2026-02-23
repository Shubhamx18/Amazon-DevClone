const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CartItem = sequelize.define('CartItem', {
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
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id'
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: { min: 1, max: 10 }
    }
}, {
    tableName: 'cart_items',
    indexes: [
        { unique: true, fields: ['user_id', 'product_id'] }
    ]
});

module.exports = CartItem;



