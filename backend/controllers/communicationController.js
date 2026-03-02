const prisma = require('../prismaClient');

// @desc    Start a new communication session
// @route   POST /api/v1/communication/session/start
// @access  Private
exports.startSession = async (req, res, next) => {
    try {
        const { topic } = req.body;

        const session = await prisma.communicationSession.create({
            data: {
                userId: req.user.id,
                topic: topic || 'General Conversation',
                history: []
            }
        });

        res.status(201).json({
            success: true,
            data: session
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Analyze speech and update session
// @route   POST /api/v1/communication/session/:id/analyze
// @access  Private
exports.analyzeSession = async (req, res, next) => {
    try {
        const { text, speaker, metrics } = req.body;
        const sessionId = req.params.id;

        const session = await prisma.communicationSession.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.userId !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        // Update history and metrics
        let currentHistory = Array.isArray(session.history) ? session.history : [];
        currentHistory.push({
            speaker,
            text,
            timestamp: new Date()
        });

        const updatedSession = await prisma.communicationSession.update({
            where: { id: sessionId },
            data: {
                history: currentHistory,
                fluencyWpm: metrics?.fluencyWpm || session.fluencyWpm,
                grammarScore: metrics?.grammarScore || session.grammarScore,
                confidenceIndex: metrics?.confidenceIndex || session.confidenceIndex,
                vocabComplexity: metrics?.vocabComplexity || session.vocabComplexity,
                finalCefrLevel: metrics?.finalCefrLevel || session.finalCefrLevel
            }
        });

        res.status(200).json({
            success: true,
            data: updatedSession
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get session report
// @route   GET /api/v1/communication/session/:id/report
// @access  Private
exports.getReport = async (req, res, next) => {
    try {
        const session = await prisma.communicationSession.findUnique({
            where: { id: req.params.id }
        });

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.userId !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Complete session and award XP
// @route   POST /api/v1/communication/session/:id/complete
// @access  Private
exports.completeSession = async (req, res, next) => {
    try {
        const { finalMetrics } = req.body;
        const sessionId = req.params.id;

        const session = await prisma.communicationSession.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        // Award XP (Fixed amount + bonus based on performance)
        const baseXP = 50;
        const bonusXP = Math.round((finalMetrics?.grammarScore || 0) * 0.5);
        const totalXP = baseXP + bonusXP;

        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                xp: { increment: totalXP }
            }
        });

        const updatedSession = await prisma.communicationSession.update({
            where: { id: sessionId },
            data: {
                fluencyWpm: finalMetrics?.fluencyWpm,
                grammarScore: finalMetrics?.grammarScore,
                confidenceIndex: finalMetrics?.confidenceIndex,
                finalCefrLevel: finalMetrics?.finalCefrLevel
            }
        });

        res.status(200).json({
            success: true,
            xpEarned: totalXP,
            data: updatedSession
        });
    } catch (err) {
        next(err);
    }
};
