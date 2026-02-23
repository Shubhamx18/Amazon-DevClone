const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        field: 'order_number',
        defaultValue: () => `AMZ-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'),
        defaultValue: 'pending'
    },
    paymentMethod: {
        type: DataTypes.ENUM('card', 'upi', 'netbanking', 'cod', 'wallet', 'emi'),
        allowNull: false,
        field: 'payment_method'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
        field: 'payment_status'
    },
    paymentId: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'payment_id'
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    shippingCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field: 'shipping_cost'
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_amount'
    },
    // Shipping Address (snapshot)
    shippingName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'shipping_name'
    },
    shippingPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'shipping_phone'
    },
    shippingAddress: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'shipping_address'
    },
    shippingCity: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'shipping_city'
    },
    shippingState: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'shipping_state'
    },
    shippingPincode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'shipping_pincode'
    },
    shippingCountry: {
        type: DataTypes.STRING(100),
        defaultValue: 'India',
        field: 'shipping_country'
    },
    trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'tracking_number'
    },
    estimatedDelivery: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'estimated_delivery'
    },
    deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'delivered_at'
    },
    cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'cancelled_at'
    },
    cancelReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'cancel_reason'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'orders',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['status'] },
        { fields: ['order_number'] }
    ]
});

module.exports = Order;
