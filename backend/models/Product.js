const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: { notEmpty: true }
    },
    slug: {
        type: DataTypes.STRING(550),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    bulletPoints: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'bullet_points',
        defaultValue: []
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    originalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'original_price'
    },
    discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0, max: 100 }
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    thumbnail: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'category_id'
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'seller_id'
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 }
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    dimensions: {
        type: DataTypes.JSON,
        allowNull: true
    },
    specifications: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    avgRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        field: 'avg_rating'
    },
    totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'total_reviews'
    },
    totalSold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'total_sold'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_featured'
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    deliveryDays: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        field: 'delivery_days'
    },
    freeDelivery: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'free_delivery'
    },
    returnPolicy: {
        type: DataTypes.STRING(200),
        defaultValue: '10 days return policy',
        field: 'return_policy'
    },
    warranty: {
        type: DataTypes.STRING(200),
        allowNull: true
    }
}, {
    tableName: 'products',
    indexes: [
        { fields: ['category_id'] },
        { fields: ['seller_id'] },
        { fields: ['brand'] },
        { fields: ['price'] },
        { fields: ['avg_rating'] },
        { fields: ['is_active'] },
        { fields: ['is_featured'] },
        { type: 'FULLTEXT', fields: ['title', 'description'] }
    ]
});

module.exports = Product;
