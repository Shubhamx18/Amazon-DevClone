const { Wishlist, Product, User, Category } = require('../models');

exports.getWishlist = async (req, res) => {
    try {
        const items = await Wishlist.findAll({
            where: { userId: req.userId },
            include: [{
                model: Product,
                as: 'product',
                include: [
                    { model: Category, as: 'category', attributes: ['id', 'name'] },
                    { model: User, as: 'seller', attributes: ['id', 'sellerName'] }
                ]
            }],
            order: [['created_at', 'DESC']]
        });

        res.json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const [item, created] = await Wishlist.findOrCreate({
            where: { userId: req.userId, productId }
        });

        if (!created) {
            return res.status(400).json({ success: false, message: 'Product already in wishlist' });
        }

        res.status(201).json({ success: true, message: 'Added to wishlist', item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const result = await Wishlist.destroy({
            where: { productId: req.params.productId, userId: req.userId }
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
        }

        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.checkWishlist = async (req, res) => {
    try {
        const item = await Wishlist.findOne({
            where: { userId: req.userId, productId: req.params.productId }
        });

        res.json({ success: true, inWishlist: !!item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
