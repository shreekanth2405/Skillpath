const prisma = require('../prismaClient');

// @desc    Get all available projects
// @route   GET /api/v1/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        const { domain, difficulty } = req.query;
        let where = {};
        if (domain) where.domain = domain;
        if (difficulty) where.difficulty = difficulty;

        const projects = await prisma.project.findMany({ where });

        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get singular project details
// @route   GET /api/v1/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: req.params.id }
        });

        if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    User starts a project
// @route   POST /api/v1/projects/:id/enroll
// @access  Private
exports.enrollInProject = async (req, res) => {
    try {
        const existing = await prisma.userProject.findFirst({
            where: { userId: req.user.id, projectId: req.params.id }
        });

        if (existing) return res.status(400).json({ success: false, error: 'Already enrolled in this project' });

        const userProject = await prisma.userProject.create({
            data: {
                userId: req.user.id,
                projectId: req.params.id,
                status: 'In Progress'
            }
        });

        res.status(201).json({ success: true, data: userProject });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Complete a project and trigger resume update
// @route   PUT /api/v1/projects/user/:userProjectId/complete
// @access  Private
exports.completeProject = async (req, res) => {
    try {
        const userProject = await prisma.userProject.findUnique({
            where: { id: req.params.userProjectId },
            include: { project: true }
        });

        if (!userProject || userProject.userId !== req.user.id) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }

        const updated = await prisma.userProject.update({
            where: { id: req.params.userProjectId },
            data: {
                status: 'Completed',
                progress: 100,
                completedAt: new Date()
            }
        });

        // Award XP and Coins
        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                xp: { increment: userProject.project.xpReward },
                coins: { increment: 100 }
            }
        });

        // Trigger Automated Resume Update Logic
        await updateResumeWithProject(req.user.id, userProject.project);

        res.status(200).json({ success: true, data: updated, message: "Project completed! Resume updated automatically." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Internal function to auto-update resume
async function updateResumeWithProject(userId, project) {
    // Find latest resume
    const resume = await prisma.resume.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
    });

    if (!resume) return;

    let content = resume.content;
    if (!content.projects) content.projects = [];

    // Check if project already added
    const alreadyAdded = content.projects.find(p => p.title === project.title);
    if (!alreadyAdded) {
        content.projects.push({
            title: project.title,
            description: project.description,
            tools: project.tools.join(', '),
            date: new Date().getFullYear().toString()
        });

        // Also update skills in resume
        if (!content.skills) content.skills = [];
        project.tools.forEach(tool => {
            if (!content.skills.includes(tool)) content.skills.push(tool);
        });

        await prisma.resume.update({
            where: { id: resume.id },
            data: { 
                content: content,
                atsScore: (resume.atsScore || 60) + 5 // Boost score slightly
            }
        });
    }
}
