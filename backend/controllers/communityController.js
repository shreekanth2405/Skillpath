const prisma = require('../prismaClient');

// @desc    Get all community posts
// @route   GET /api/community/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                },
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const { title, content, tag } = req.body;

        const post = await prisma.post.create({
            data: {
                title,
                content,
                tag,
                userId: req.user.id
            },
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                }
            }
        });

        res.status(201).json({ success: true, data: post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single post with comments
// @route   GET /api/community/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                },
                comments: {
                    include: {
                        user: {
                            select: { id: true, name: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/community/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;

        const post = await prisma.post.findUnique({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: req.params.id,
                userId: req.user.id
            },
            include: {
                user: {
                    select: { id: true, name: true }
                }
            }
        });

        res.status(201).json({ success: true, data: comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Like a post
// @route   PUT /api/community/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const updatedPost = await prisma.post.update({
            where: { id: req.params.id },
            data: { likes: post.likes + 1 }
        });

        res.status(200).json({ success: true, data: updatedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
