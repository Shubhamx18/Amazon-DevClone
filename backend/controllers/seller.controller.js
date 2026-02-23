const { Op } = require('sequelize');
const { Product, Category, User, Order, OrderItem } = require('../models');

exports.getSellerDashboard = async (req, res) => {
    try {
        const sellerId = req.userId;
        const totalProducts = await Product.count({ where: { sellerId } });
        const activeProducts = await Product.count({ where: { sellerId, isActive: true } });
        const orderItems = await OrderItem.findAll({ where: { sellerId }, include: [{ model: Order, as: 'order' }] });
        const totalOrders = new Set(orderItems.map(i => i.orderId)).size;
        const totalRevenue = orderItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
        const pendingOrders = orderItems.filter(i => ['pending', 'confirmed', 'processing'].includes(i.status)).length;
        res.json({ success: true, dashboard: { totalProducts, activeProducts, totalOrders, totalRevenue, pendingOrders } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getSellerProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, status } = req.query;
        const where = { sellerId: req.userId };
        if (search) where.title = { [Op.like]: `%${search}%` };
        if (status === 'active') where.isActive = true;
        if (status === 'inactive') where.isActive = false;
        const { count, rows: products } = await Product.findAndCountAll({
            where, include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
            order: [['created_at', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit)
        });
        res.json({ success: true, products, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createProduct = async (req, res) => {
    try {
        const { title, description, bulletPoints, price, originalPrice, discount, categoryId, brand, stock, sku, weight, dimensions, specifications, tags, deliveryDays, freeDelivery, returnPolicy, warranty, images, thumbnail } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        const product = await Product.create({ title, slug, description, bulletPoints, price, originalPrice: originalPrice || price, discount: discount || 0, images: images || [], thumbnail, categoryId, sellerId: req.userId, brand, stock: stock || 0, sku, weight, dimensions, specifications, tags, deliveryDays, freeDelivery, returnPolicy, warranty });
        res.status(201).json({ success: true, product });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id, sellerId: req.userId } });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        const fields = ['title', 'description', 'bulletPoints', 'price', 'originalPrice', 'discount', 'images', 'thumbnail', 'categoryId', 'brand', 'stock', 'sku', 'weight', 'dimensions', 'specifications', 'tags', 'deliveryDays', 'freeDelivery', 'returnPolicy', 'warranty', 'isActive', 'isFeatured'];
        fields.forEach(field => { if (req.body[field] !== undefined) product[field] = req.body[field]; });
        if (req.body.title) product.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + product.id;
        await product.save();
        res.json({ success: true, product });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id, sellerId: req.userId } });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        product.isActive = false;
        await product.save();
        res.json({ success: true, message: 'Product deactivated' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getSellerOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const where = { sellerId: req.userId };
        if (status) where.status = status;
        const { count, rows: items } = await OrderItem.findAndCountAll({
            where, include: [{ model: Order, as: 'order', include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }] }, { model: Product, as: 'product', attributes: ['id', 'title', 'thumbnail'] }],
            order: [['created_at', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit)
        });
        res.json({ success: true, orders: items, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateOrderItemStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const item = await OrderItem.findOne({ where: { id: req.params.itemId, sellerId: req.userId } });
        if (!item) return res.status(404).json({ success: false, message: 'Order item not found' });
        item.status = status;
        await item.save();
        const allItems = await OrderItem.findAll({ where: { orderId: item.orderId } });
        if (allItems.every(i => i.status === status)) {
            await Order.update({ status }, { where: { id: item.orderId } });
            if (status === 'delivered') await Order.update({ deliveredAt: new Date(), paymentStatus: 'completed' }, { where: { id: item.orderId } });
        }
        res.json({ success: true, message: 'Status updated' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
