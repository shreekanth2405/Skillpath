const User = require('../models/User');

// @desc    Get dashboard stats (XP, level, coins)
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: {
                xp: user.xp,
                level: user.level,
                coins: user.coins
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Sync XP and Coins from games
// @route   POST /api/dashboard/sync-xp
// @access  Private
exports.syncXP = async (req, res, next) => {
    try {
        const { xpEarned, coinsEarned } = req.body;

        const user = await User.findById(req.user.id);

        user.xp += (Number(xpEarned) || 0);
        user.coins += (Number(coinsEarned) || 0);

        // Simple level up logic: Every 1000 XP = 1 Level
        user.level = Math.floor(user.xp / 1000) + 1;

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                xp: user.xp,
                level: user.level,
                coins: user.coins
            }
        });
    } catch (err) {
        next(err);
    }
};
