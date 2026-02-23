const { Op } = require('sequelize');
const { Product, Category, User } = require('../models');

exports.search = async (req, res) => {
    try {
        const { q, category, brand, minPrice, maxPrice, rating, sort = 'relevance', page = 1, limit = 20 } = req.query;
        if (!q) return res.status(400).json({ success: false, message: 'Search query required' });

        const where = { isActive: true, [Op.or]: [{ title: { [Op.like]: `%${q}%` } }, { description: { [Op.like]: `%${q}%` } }, { brand: { [Op.like]: `%${q}%` } }, { tags: { [Op.like]: `%${q}%` } }] };
        if (category) where.categoryId = category;
        if (brand) where.brand = brand;
        if (minPrice || maxPrice) { where.price = {}; if (minPrice) where.price[Op.gte] = parseFloat(minPrice); if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice); }
        if (rating) where.avgRating = { [Op.gte]: parseFloat(rating) };

        let order;
        switch (sort) {
            case 'price_low': order = [['price', 'ASC']]; break;
            case 'price_high': order = [['price', 'DESC']]; break;
            case 'rating': order = [['avg_rating', 'DESC']]; break;
            case 'newest': order = [['created_at', 'DESC']]; break;
            case 'bestselling': order = [['total_sold', 'DESC']]; break;
            default: order = [['total_reviews', 'DESC']];
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where, include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }, { model: User, as: 'seller', attributes: ['id', 'sellerName'] }],
            order, limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit)
        });

        const brands = await Product.findAll({ where: { isActive: true, [Op.or]: [{ title: { [Op.like]: `%${q}%` } }] }, attributes: ['brand'], group: ['brand'], having: { brand: { [Op.not]: null } } });
        const categories = await Product.findAll({ where: { isActive: true, [Op.or]: [{ title: { [Op.like]: `%${q}%` } }] }, attributes: ['categoryId'], include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }], group: ['categoryId'] });

        res.json({ success: true, products, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) }, filters: { brands: brands.map(b => b.brand).filter(Boolean), categories: categories.map(c => c.category).filter(Boolean) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.suggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });
        const products = await Product.findAll({ where: { isActive: true, title: { [Op.like]: `%${q}%` } }, attributes: ['id', 'title', 'thumbnail', 'price'], limit: 8, order: [['total_sold', 'DESC']] });
        res.json({ success: true, suggestions: products });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
