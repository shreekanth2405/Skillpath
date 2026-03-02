const prisma = require('../prismaClient');


// @desc    Get all job matches for logged in user
// @route   GET /api/v1/jobs/matches
// @access  Private
exports.getJobMatches = async (req, res) => {
    try {
        const { status, min_score } = req.query;

        // Base query - matches for the user
        let where = { userId: req.user.id };

        // Filter by status if provided (e.g., 'New', 'Applied', etc.)
        if (status) {
            where.matchStatus = status;
        }

        // Filter by minimum score if provided
        if (min_score) {
            where.relevanceScore = { gte: Number(min_score) };
        }

        const matches = await prisma.jobMatch.findMany({
            where,
            include: {
                job: true // Corresponds to .populate('jobId')
            },
            orderBy: {
                relevanceScore: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update job match status (e.g. Apply)
// @route   POST /api/v1/jobs/:id/apply 
// @access  Private
exports.updateJobMatchStatus = async (req, res) => {
    try {
        const { status } = req.body;

        let jobMatch = await prisma.jobMatch.findUnique({
            where: { id: req.params.id }
        });

        if (!jobMatch) {
            return res.status(404).json({ success: false, error: 'Job Match not found' });
        }

        // Ensure user owns this match
        if (jobMatch.userId !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this job match' });
        }

        jobMatch = await prisma.jobMatch.update({
            where: { id: req.params.id },
            data: { matchStatus: status || 'Applied' }
        });

        res.status(200).json({
            success: true,
            data: jobMatch
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get aggregated skill gaps based on high match jobs
// @route   GET /api/v1/jobs/analysis/skill-gaps
// @access  Private
exports.getSkillGaps = async (req, res) => {
    try {
        // Find highly matched jobs for this user
        const highMatches = await prisma.jobMatch.findMany({
            where: {
                userId: req.user.id,
                relevanceScore: { gte: 80 }
            }
        });

        const skillGaps = {};

        highMatches.forEach(match => {
            if (match.skillGap && match.skillGap.length > 0) {
                match.skillGap.forEach(skill => {
                    if (skillGaps[skill]) {
                        skillGaps[skill] += 1;
                    } else {
                        skillGaps[skill] = 1;
                    }
                });
            }
        });

        res.status(200).json({
            success: true,
            data: skillGaps
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get trending requirement skills/jobs
// @route   GET /api/v1/jobs/trending
// @access  Private
exports.getTrendingJobs = async (req, res) => {
    try {
        // Return mostly mock data or basic aggregation of recent jobs
        // Ideally handled via a daily cron aggregation in a real system

        const trendingData = {
            roles: [
                { title: 'Generative AI Engineer', growth: '+145%' },
                { title: 'Cloud Architect', growth: '+80%' },
                { title: 'Frontend Developer (React)', growth: '+12%' }
            ],
            skills: [
                { skill: 'Python', demandCount: 1204 },
                { skill: 'React', demandCount: 950 },
                { skill: 'AWS', demandCount: 840 },
                { skill: 'Docker', demandCount: 620 }
            ]
        };

        res.status(200).json({
            success: true,
            data: trendingData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
