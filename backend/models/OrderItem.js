const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id'
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id'
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'seller_id'
    },
    productTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'product_title'
    },
    productImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'product_image'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'order_items'
});

module.exports = OrderItem;
