const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');


// @desc    Get user profile (includes gamification stats)
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {};
        if (req.body.name) fieldsToUpdate.name = req.body.name;
        if (req.body.email) fieldsToUpdate.email = req.body.email;
        if (typeof req.body.xp === 'number') fieldsToUpdate.xp = req.body.xp;
        if (typeof req.body.level === 'number') fieldsToUpdate.level = req.body.level;
        if (typeof req.body.coins === 'number') fieldsToUpdate.coins = req.body.coins;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: fieldsToUpdate
        });

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!req.body.currentPassword || !req.body.newPassword) {
            return res.status(400).json({ success: false, error: 'Please provide current and new password' });
        }

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Password incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
    try {
        await prisma.user.delete({ where: { id: req.user.id } });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
