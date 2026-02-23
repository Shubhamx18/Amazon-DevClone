const { Op } = require('sequelize');
const { User, Product, Order, OrderItem, Category, Review } = require('../models');

exports.getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        const totalRevenue = await Order.sum('total_amount', { where: { paymentStatus: 'completed' } }) || 0;
        const recentOrders = await Order.findAll({ include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }], order: [['created_at', 'DESC']], limit: 10 });
        res.json({ success: true, dashboard: { totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, role } = req.query;
        const where = {};
        if (search) where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }];
        if (role) where.role = role;
        const { count, rows: users } = await User.findAndCountAll({ where, order: [['created_at', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
        res.json({ success: true, users, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateUserRole = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.role = req.body.role;
        await user.save();
        res.json({ success: true, user });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const where = {};
        if (status) where.status = status;
        const { count, rows: orders } = await Order.findAndCountAll({ where, include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }, { model: OrderItem, as: 'items' }], order: [['created_at', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
        res.json({ success: true, orders, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        const { status, trackingNumber } = req.body;
        if (status) order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (status === 'delivered') { order.deliveredAt = new Date(); order.paymentStatus = 'completed'; }
        if (status === 'shipped') order.trackingNumber = trackingNumber || `TRK${Date.now()}`;
        await order.save();
        if (status) await OrderItem.update({ status }, { where: { orderId: order.id } });
        res.json({ success: true, order });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const where = {};
        if (search) where.title = { [Op.like]: `%${search}%` };
        const { count, rows: products } = await Product.findAndCountAll({ where, include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }, { model: User, as: 'seller', attributes: ['id', 'sellerName', 'name'] }], order: [['created_at', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
        res.json({ success: true, products, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.toggleProductFeatured = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        product.isFeatured = !product.isFeatured;
        await product.save();
        res.json({ success: true, product });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        product.isActive = false;
        await product.save();
        res.json({ success: true, message: 'Product deactivated' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
