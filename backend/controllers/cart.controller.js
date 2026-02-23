const { CartItem, Product, User } = require('../models');

exports.getCart = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { userId: req.userId },
            include: [{
                model: Product,
                as: 'product',
                include: [{ model: User, as: 'seller', attributes: ['id', 'sellerName'] }]
            }],
            order: [['created_at', 'DESC']]
        });

        // Calculate totals
        let subtotal = 0;
        let totalItems = 0;
        let totalDiscount = 0;

        const items = cartItems.map(item => {
            const price = parseFloat(item.product.price);
            const originalPrice = parseFloat(item.product.originalPrice || item.product.price);
            const itemTotal = price * item.quantity;
            const itemDiscount = (originalPrice - price) * item.quantity;

            subtotal += itemTotal;
            totalItems += item.quantity;
            totalDiscount += itemDiscount;

            return {
                ...item.toJSON(),
                itemTotal,
                itemDiscount
            };
        });

        const shippingCost = subtotal >= 499 ? 0 : 40;
        const tax = Math.round(subtotal * 0.18 * 100) / 100;
        const totalAmount = subtotal + shippingCost + tax;

        res.json({
            success: true,
            cart: {
                items,
                summary: {
                    totalItems,
                    subtotal,
                    totalDiscount,
                    shippingCost,
                    tax,
                    totalAmount,
                    freeDeliveryThreshold: 499
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findByPk(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }

        const [cartItem, created] = await CartItem.findOrCreate({
            where: { userId: req.userId, productId },
            defaults: { quantity }
        });

        if (!created) {
            cartItem.quantity = Math.min(cartItem.quantity + quantity, 10, product.stock);
            await cartItem.save();
        }

        res.json({ success: true, message: created ? 'Added to cart' : 'Cart updated', cartItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        const product = await Product.findByPk(cartItem.productId);
        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json({ success: true, message: 'Cart updated', cartItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const result = await CartItem.destroy({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        await CartItem.destroy({ where: { userId: req.userId } });
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCartCount = async (req, res) => {
    try {
        const count = await CartItem.sum('quantity', { where: { userId: req.userId } });
        res.json({ success: true, count: count || 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
