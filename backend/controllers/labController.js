const prisma = require('../prismaClient');

// @desc    Get all labs
// @route   GET /api/v1/labs
// @access  Public
exports.getLabs = async (req, res, next) => {
    try {
        const { domain, difficulty } = req.query;
        let where = {};

        if (domain) where.domain = domain;
        if (difficulty) where.difficulty = difficulty;

        const labs = await prisma.lab.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: labs.length,
            data: labs
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single lab
// @route   GET /api/v1/labs/:id
// @access  Public
exports.getLab = async (req, res, next) => {
    try {
        const lab = await prisma.lab.findUnique({
            where: { id: req.params.id }
        });

        if (!lab) {
            return res.status(404).json({
                success: false,
                error: 'Lab not found'
            });
        }

        res.status(200).json({
            success: true,
            data: lab
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit lab code/result
// @route   POST /api/v1/labs/:id/submit
// @access  Private
exports.submitLab = async (req, res, next) => {
    try {
        const { code, notes, status } = req.body;
        const labId = req.params.id;
        const userId = req.user.id;

        const lab = await prisma.lab.findUnique({
            where: { id: labId }
        });

        if (!lab) {
            return res.status(404).json({
                success: false,
                error: 'Lab not found'
            });
        }

        const submission = await prisma.labSubmission.create({
            data: {
                labId,
                userId,
                code,
                notes,
                status: status || 'Completed'
            }
        });

        // Award XP if completed
        if (status === 'Completed') {
            await prisma.user.update({
                where: { id: userId },
                data: { xp: { increment: lab.xpReward } }
            });
        }

        res.status(201).json({
            success: true,
            data: submission,
            xpEarned: status === 'Completed' ? lab.xpReward : 0
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's lab submissions
// @route   GET /api/v1/labs/my-submissions
// @access  Private
exports.getMySubmissions = async (req, res, next) => {
    try {
        const submissions = await prisma.labSubmission.findMany({
            where: { userId: req.user.id },
            include: { lab: true },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (err) {
        next(err);
    }
};
