const express = require('express');
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getBookmarks)
    .post(protect, addBookmark);

router.route('/:id')
    .delete(protect, removeBookmark);

module.exports = router;
