const express = require('express');
const router = express.Router();
const {
    submitQuiz,
    submitChallenge,
    getTestHistory
} = require('../controllers/testSystemController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes protected

router.post('/quiz', submitQuiz);
router.post('/challenge', submitChallenge);
router.get('/history', getTestHistory);

module.exports = router;
