const prisma = require('../prismaClient');
const { exec } = require('child_process');


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

// @desc    Trigger AI engine to scrape and scan new matching jobs
// @route   POST /api/v1/jobs/scan
// @access  Private
exports.predictAndScan = async (req, res) => {
    try {
        const { role } = req.body;
        const targetTitle = role || 'Software Developer';

        // Step 1: Execute Python NLP script (simulated pipeline)
        exec('python ../scraper.py', (err, stdout, stderr) => {
            if (err) console.error("Scraper Error:", err);
            
            exec('python ../ai_matcher.py', async (err2, stdout2, stderr2) => {
                if (err2) {
                    console.error("Matcher Error:", err2);
                    return res.status(500).json({ success: false, error: 'AI Matching Engine failed' });
                }

                // Step 2: Fetch the latest high-score matches for this user
                const latestMatches = await prisma.jobMatch.findMany({
                    where: { userId: req.user.id },
                    include: { job: true },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                });

                // Step 3: Create notifications for high score matches (>= 85)
                for (const match of latestMatches) {
                    if (match.relevanceScore >= 85 && !match.notified) {
                        await prisma.notification.create({
                            data: {
                                userId: req.user.id,
                                type: 'JobMatch',
                                title: 'High Relevance Job Found!',
                                message: `We found a ${match.job.jobTitle} position at ${match.job.companyName} that matches your skills by ${match.relevanceScore}%.`,
                                icon: 'fa-briefcase',
                                color: '#3b82f6'
                            }
                        });

                        // Update match to avoid double notification
                        await prisma.jobMatch.update({
                            where: { id: match.id },
                            data: { notified: true, notifiedAt: new Date() }
                        });
                    }
                }

                res.status(200).json({
                    success: true,
                    data: latestMatches[0] || null, // Return the top recent match
                    allMatches: latestMatches,
                    logs: stdout2 + stdout
                });
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
