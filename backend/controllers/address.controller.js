const { Address } = require('../models');

exports.getAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll({
            where: { userId: req.userId },
            order: [['is_default', 'DESC'], ['created_at', 'DESC']]
        });

        res.json({ success: true, addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, landmark, addressType, isDefault } = req.body;

        if (isDefault) {
            await Address.update({ isDefault: false }, { where: { userId: req.userId } });
        }

        // Check if this is the first address
        const count = await Address.count({ where: { userId: req.userId } });
        const shouldBeDefault = count === 0 || isDefault;

        const address = await Address.create({
            userId: req.userId,
            fullName, phone, addressLine1, addressLine2,
            city, state, pincode, country: country || 'India',
            landmark, addressType, isDefault: shouldBeDefault
        });

        res.status(201).json({ success: true, address });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        const fields = ['fullName', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'pincode', 'country', 'landmark', 'addressType', 'isDefault'];

        if (req.body.isDefault) {
            await Address.update({ isDefault: false }, { where: { userId: req.userId } });
        }

        fields.forEach(field => {
            if (req.body[field] !== undefined) address[field] = req.body[field];
        });

        await address.save();
        res.json({ success: true, address });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        const wasDefault = address.isDefault;
        await address.destroy();

        // If was default, make another one default
        if (wasDefault) {
            const next = await Address.findOne({ where: { userId: req.userId }, order: [['created_at', 'DESC']] });
            if (next) {
                next.isDefault = true;
                await next.save();
            }
        }

        res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.setDefault = async (req, res) => {
    try {
        await Address.update({ isDefault: false }, { where: { userId: req.userId } });

        const address = await Address.findOne({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        address.isDefault = true;
        await address.save();

        res.json({ success: true, message: 'Default address updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
