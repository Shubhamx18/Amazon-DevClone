const { Review, Product, User, OrderItem } = require('../models');
const { sequelize } = require('../config/database');

exports.getProductReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'newest', rating } = req.query;
        const where = { productId: req.params.productId };
        if (rating) where.rating = parseInt(rating);

        let order;
        switch (sort) {
            case 'helpful': order = [['helpful_count', 'DESC']]; break;
            case 'highest': order = [['rating', 'DESC']]; break;
            case 'lowest': order = [['rating', 'ASC']]; break;
            default: order = [['created_at', 'DESC']];
        }

        const { count, rows: reviews } = await Review.findAndCountAll({
            where,
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
            order,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        res.json({
            success: true,
            reviews,
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

exports.createReview = async (req, res) => {
    try {
        const { productId, rating, title, comment } = req.body;

        // Check if already reviewed
        const existing = await Review.findOne({
            where: { userId: req.userId, productId }
        });
        if (existing) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }

        // Check if purchased
        const purchased = await OrderItem.findOne({
            where: { productId },
            include: [{
                model: require('../models/Order'),
                as: 'order',
                where: { userId: req.userId, status: 'delivered' }
            }]
        });

        const review = await Review.create({
            userId: req.userId,
            productId,
            rating,
            title,
            comment,
            isVerifiedPurchase: !!purchased
        });

        // Update product rating
        const stats = await Review.findOne({
            where: { productId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ],
            raw: true
        });

        await Product.update({
            avgRating: Math.round(stats.avgRating * 10) / 10,
            totalReviews: stats.totalReviews
        }, { where: { id: productId } });

        const fullReview = await Review.findByPk(review.id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }]
        });

        res.status(201).json({ success: true, review: fullReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        const { rating, title, comment } = req.body;
        if (rating) review.rating = rating;
        if (title !== undefined) review.title = title;
        if (comment !== undefined) review.comment = comment;

        await review.save();

        // Update product rating
        const stats = await Review.findOne({
            where: { productId: review.productId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ],
            raw: true
        });

        await Product.update({
            avgRating: Math.round(stats.avgRating * 10) / 10,
            totalReviews: stats.totalReviews
        }, { where: { id: review.productId } });

        res.json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        const productId = review.productId;
        await review.destroy();

        // Update product rating
        const stats = await Review.findOne({
            where: { productId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ],
            raw: true
        });

        await Product.update({
            avgRating: stats.avgRating ? Math.round(stats.avgRating * 10) / 10 : 0,
            totalReviews: stats.totalReviews || 0
        }, { where: { id: productId } });

        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markHelpful = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        review.helpfulCount += 1;
        await review.save();

        res.json({ success: true, helpfulCount: review.helpfulCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
