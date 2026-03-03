const prisma = require('../prismaClient');

// @desc    Get all user bookmarks
// @route   GET /api/v1/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: bookmarks.length,
            data: bookmarks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add a bookmark
// @route   POST /api/v1/bookmarks
// @access  Private
exports.addBookmark = async (req, res) => {
    try {
        const { title, category, isArchiveOrg, sourceUrl } = req.body;

        // Check if already bookmarked
        const existing = await prisma.bookmark.findFirst({
            where: {
                userId: req.user.id,
                title: title
            }
        });

        if (existing) {
            return res.status(400).json({ success: false, error: 'Already bookmarked' });
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                userId: req.user.id,
                title,
                category,
                isArchiveOrg: isArchiveOrg || false,
                sourceUrl
            }
        });

        res.status(201).json({
            success: true,
            data: bookmark
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Remove a bookmark
// @route   DELETE /api/v1/bookmarks/:id
// @access  Private
exports.removeBookmark = async (req, res) => {
    try {
        const { title } = req.query;

        if (req.params.id && req.params.id !== 'by-title') {
            const bookmark = await prisma.bookmark.findFirst({
                where: { id: req.params.id, userId: req.user.id }
            });
            if (!bookmark) return res.status(404).json({ success: false, error: 'Not found' });

            await prisma.bookmark.delete({
                where: { id: req.params.id }
            });
            return res.status(200).json({ success: true, data: {} });
        } else if (title) {
            const bookmark = await prisma.bookmark.findFirst({
                where: { title: title, userId: req.user.id }
            });
            if (!bookmark) return res.status(404).json({ success: false, error: 'Not found' });

            await prisma.bookmark.delete({
                where: { id: bookmark.id }
            });
            return res.status(200).json({ success: true, data: {} });
        }

        return res.status(400).json({ success: false, error: 'Must provide ID or title in query parameters' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
