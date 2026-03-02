const prisma = require('../prismaClient');


// @desc    Get dashboard stats (XP, level, coins)
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

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

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const newXp = (user.xp || 0) + (Number(xpEarned) || 0);
        const newCoins = (user.coins || 0) + (Number(coinsEarned) || 0);
        const newLevel = Math.floor(newXp / 1000) + 1;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                xp: newXp,
                coins: newCoins,
                level: newLevel
            }
        });

        res.status(200).json({
            success: true,
            data: {
                xp: updatedUser.xp,
                level: updatedUser.level,
                coins: updatedUser.coins
            }
        });
    } catch (err) {
        next(err);
    }
};
