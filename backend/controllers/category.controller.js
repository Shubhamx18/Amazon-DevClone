const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { isActive: true, parentId: null },
            include: [{
                model: Category,
                as: 'subcategories',
                where: { isActive: true },
                required: false,
                include: [{
                    model: Category,
                    as: 'subcategories',
                    where: { isActive: true },
                    required: false
                }]
            }],
            order: [['sort_order', 'ASC'], ['name', 'ASC']]
        });

        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'subcategories',
                where: { isActive: true },
                required: false
            }]
        });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: { slug: req.params.slug, isActive: true },
            include: [{
                model: Category,
                as: 'subcategories',
                where: { isActive: true },
                required: false
            }]
        });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, description, image, parentId, sortOrder } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const category = await Category.create({
            name, slug, description, image, parentId, sortOrder
        });

        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const { name, description, image, parentId, sortOrder, isActive } = req.body;
        if (name) {
            category.name = name;
            category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (description !== undefined) category.description = description;
        if (image !== undefined) category.image = image;
        if (parentId !== undefined) category.parentId = parentId;
        if (sortOrder !== undefined) category.sortOrder = sortOrder;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();
        res.json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        category.isActive = false;
        await category.save();
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
