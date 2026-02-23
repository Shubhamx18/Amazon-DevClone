const { Op } = require('sequelize');
const { Order, OrderItem, CartItem, Product, User, Address } = require('../models');
const { sequelize } = require('../config/database');

exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { addressId, paymentMethod, notes } = req.body;

        // Get address
        const address = await Address.findOne({
            where: { id: addressId, userId: req.userId }
        });
        if (!address) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Invalid address' });
        }

        // Get cart items
        const cartItems = await CartItem.findAll({
            where: { userId: req.userId },
            include: [{ model: Product, as: 'product' }]
        });

        if (cartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of cartItems) {
            if (item.product.stock < item.quantity) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.product.title}`
                });
            }

            const itemTotal = parseFloat(item.product.price) * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                productId: item.productId,
                sellerId: item.product.sellerId,
                productTitle: item.product.title,
                productImage: item.product.thumbnail || (item.product.images && item.product.images[0]),
                price: item.product.price,
                quantity: item.quantity,
                total: itemTotal
            });
        }

        const shippingCost = subtotal >= 499 ? 0 : 40;
        const tax = Math.round(subtotal * 0.18 * 100) / 100;
        const totalAmount = subtotal + shippingCost + tax;

        // Create order
        const order = await Order.create({
            userId: req.userId,
            paymentMethod,
            subtotal,
            shippingCost,
            tax,
            totalAmount,
            shippingName: address.fullName,
            shippingPhone: address.phone,
            shippingAddress: `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}`,
            shippingCity: address.city,
            shippingState: address.state,
            shippingPincode: address.pincode,
            shippingCountry: address.country,
            notes,
            status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        }, { transaction: t });

        // Create order items
        for (const item of orderItems) {
            await OrderItem.create({
                ...item,
                orderId: order.id,
                status: 'confirmed'
            }, { transaction: t });

            // Update stock
            await Product.decrement('stock', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });

            // Update sales count
            await Product.increment('totalSold', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });
        }

        // Clear cart
        await CartItem.destroy({
            where: { userId: req.userId },
            transaction: t
        });

        await t.commit();

        const fullOrder = await Order.findByPk(order.id, {
            include: [{ model: OrderItem, as: 'items' }]
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: fullOrder
        });
    } catch (error) {
        await t.rollback();
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const where = { userId: req.userId };
        if (status) where.status = status;

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, as: 'product', attributes: ['id', 'title', 'thumbnail', 'images', 'slug'] }]
            }],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        res.json({
            success: true,
            orders,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { id: req.params.id, userId: req.userId },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, as: 'product', attributes: ['id', 'title', 'thumbnail', 'images', 'slug'] }]
            }]
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findOne({
            where: { id: req.params.id, userId: req.userId },
            include: [{ model: OrderItem, as: 'items' }]
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
            return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
        }

        // Restore stock
        for (const item of order.items) {
            await Product.increment('stock', { by: item.quantity, where: { id: item.productId } });
            await Product.decrement('totalSold', { by: item.quantity, where: { id: item.productId } });
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        order.cancelReason = reason;
        if (order.paymentStatus === 'completed') {
            order.paymentStatus = 'refunded';
        }
        await order.save();

        // Update order items
        await OrderItem.update({ status: 'cancelled' }, { where: { orderId: order.id } });

        res.json({ success: true, message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { orderNumber: req.params.orderNumber },
            attributes: ['id', 'orderNumber', 'status', 'estimatedDelivery', 'trackingNumber', 'deliveredAt', 'createdAt', 'shippingCity', 'shippingState']
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const statusTimeline = [
            { status: 'confirmed', label: 'Order Confirmed', completed: true, date: order.createdAt },
            { status: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'out_for_delivery', 'delivered'].includes(order.status) },
            { status: 'shipped', label: 'Shipped', completed: ['shipped', 'out_for_delivery', 'delivered'].includes(order.status) },
            { status: 'out_for_delivery', label: 'Out for Delivery', completed: ['out_for_delivery', 'delivered'].includes(order.status) },
            { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered', date: order.deliveredAt }
        ];

        res.json({ success: true, order, timeline: statusTimeline });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
