const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
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
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    isVerifiedPurchase: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_verified_purchase'
    },
    helpfulCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'helpful_count'
    }
}, {
    tableName: 'reviews',
    indexes: [
        { unique: true, fields: ['user_id', 'product_id'] },
        { fields: ['product_id'] },
        { fields: ['rating'] }
    ]
});

module.exports = Review;
