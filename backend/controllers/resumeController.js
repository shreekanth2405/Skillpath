const prisma = require('../prismaClient');

// @desc    Save a generated resume
// @route   POST /api/v1/resumes
// @access  Private
exports.saveResume = async (req, res, next) => {
    try {
        const { name, template, content, atsScore } = req.body;

        const resume = await prisma.resume.create({
            data: {
                userId: req.user.id,
                name: name || 'Untitled Resume',
                template: template || 'modern',
                content: content, // JSON data
                atsScore: atsScore
            }
        });

        res.status(201).json({
            success: true,
            data: resume
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all resumes for user
// @route   GET /api/v1/resumes
// @access  Private
exports.getResumes = async (req, res, next) => {
    try {
        const resumes = await prisma.resume.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: resumes.length,
            data: resumes
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a resume
// @route   DELETE /api/v1/resumes/:id
// @access  Private
exports.deleteResume = async (req, res, next) => {
    try {
        const resumeId = req.params.id;

        // Verify ownership
        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume || resume.userId !== req.user.id) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }

        await prisma.resume.delete({ where: { id: resumeId } });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
