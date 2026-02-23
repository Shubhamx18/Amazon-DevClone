const { Op } = require('sequelize');
const { Product, Category, User, Review } = require('../models');

exports.getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            brand,
            minPrice,
            maxPrice,
            rating,
            sort = 'newest',
            search,
            featured,
            seller
        } = req.query;

        const where = { isActive: true };
        const offset = (parseInt(page) - 1) * parseInt(limit);

        if (category) where.categoryId = category;
        if (brand) where.brand = brand;
        if (seller) where.sellerId = seller;
        if (featured === 'true') where.isFeatured = true;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
        }
        if (rating) where.avgRating = { [Op.gte]: parseFloat(rating) };
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { brand: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        let order;
        switch (sort) {
            case 'price_low': order = [['price', 'ASC']]; break;
            case 'price_high': order = [['price', 'DESC']]; break;
            case 'rating': order = [['avg_rating', 'DESC']]; break;
            case 'reviews': order = [['total_reviews', 'DESC']]; break;
            case 'bestselling': order = [['total_sold', 'DESC']]; break;
            case 'oldest': order = [['created_at', 'ASC']]; break;
            default: order = [['created_at', 'DESC']];
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where,
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                { model: User, as: 'seller', attributes: ['id', 'sellerName', 'sellerRating'] }
            ],
            order,
            limit: parseInt(limit),
            offset
        });

        // Get available brands and price range for filters
        const brands = await Product.findAll({
            where: { isActive: true },
            attributes: ['brand'],
            group: ['brand'],
            having: { brand: { [Op.not]: null } }
        });

        res.json({
            success: true,
            products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            },
            filters: {
                brands: brands.map(b => b.brand).filter(Boolean)
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { id: req.params.id, isActive: true },
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                { model: User, as: 'seller', attributes: ['id', 'sellerName', 'sellerRating', 'sellerDescription'] },
                {
                    model: Review,
                    as: 'reviews',
                    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
                    order: [['created_at', 'DESC']],
                    limit: 10
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Get related products
        const relatedProducts = await Product.findAll({
            where: {
                categoryId: product.categoryId,
                id: { [Op.ne]: product.id },
                isActive: true
            },
            limit: 8,
            order: [['avg_rating', 'DESC']]
        });

        // Rating breakdown
        const ratingBreakdown = await Review.findAll({
            where: { productId: product.id },
            attributes: [
                'rating',
                [require('sequelize').fn('COUNT', require('sequelize').col('rating')), 'count']
            ],
            group: ['rating'],
            raw: true
        });

        res.json({
            success: true,
            product,
            relatedProducts,
            ratingBreakdown
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { slug: req.params.slug, isActive: true },
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                { model: User, as: 'seller', attributes: ['id', 'sellerName', 'sellerRating', 'sellerDescription'] },
                {
                    model: Review,
                    as: 'reviews',
                    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
                    order: [['created_at', 'DESC']],
                    limit: 10
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { isActive: true, isFeatured: true },
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name'] },
                { model: User, as: 'seller', attributes: ['id', 'sellerName'] }
            ],
            order: [['avg_rating', 'DESC']],
            limit: 12
        });

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTopDeals = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                isActive: true,
                discount: { [Op.gt]: 0 }
            },
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name'] }
            ],
            order: [['discount', 'DESC']],
            limit: 12
        });

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBestsellers = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { isActive: true },
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name'] }
            ],
            order: [['total_sold', 'DESC']],
            limit: 12
        });

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNewArrivals = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { isActive: true },
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name'] }
            ],
            order: [['created_at', 'DESC']],
            limit: 12
        });

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
