const express = require('express');
const router = express.Router();
const {
    getPosts,
    createPost,
    getPost,
    addComment,
    likePost
} = require('../controllers/communityController');

const { protect } = require('../middleware/authMiddleware');

router.get('/posts', getPosts);
router.get('/posts/:id', getPost);

router.post('/posts', protect, createPost);
router.post('/posts/:id/comments', protect, addComment);
router.put('/posts/:id/like', protect, likePost);

module.exports = router;
