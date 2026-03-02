const prisma = require('../prismaClient');

// @desc    Submit a Quiz result
// @route   POST /api/v1/test-system/quiz
// @access  Private
exports.submitQuiz = async (req, res, next) => {
    try {
        const { topic, score, totalQuestions } = req.body;

        const result = await prisma.testResult.create({
            data: {
                userId: req.user.id,
                type: 'Quiz',
                topic: topic || 'General Topic',
                score,
                totalQuestions
            }
        });

        // Award XP (e.g., 10 XP per correct answer)
        const xpEarned = score * 10;

        await prisma.user.update({
            where: { id: req.user.id },
            data: { xp: { increment: xpEarned } }
        });

        res.status(201).json({
            success: true,
            xpEarned,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit a Coding Challenge result
// @route   POST /api/v1/test-system/challenge
// @access  Private
exports.submitChallenge = async (req, res, next) => {
    try {
        const { topic, passed, feedback, codeSubmitted } = req.body;

        const result = await prisma.testResult.create({
            data: {
                userId: req.user.id,
                type: 'CodingChallenge',
                topic: topic || 'Coding Challenge',
                passed,
                feedback,
                codeSubmitted
            }
        });

        let xpEarned = 0;
        if (passed) {
            xpEarned = 100; // Flat 100 XP for passing a coding challenge
            await prisma.user.update({
                where: { id: req.user.id },
                data: { xp: { increment: xpEarned } }
            });
        }

        res.status(201).json({
            success: true,
            xpEarned,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all test results for current user
// @route   GET /api/v1/test-system/history
// @access  Private
exports.getTestHistory = async (req, res, next) => {
    try {
        const results = await prisma.testResult.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err) {
        next(err);
    }
};
