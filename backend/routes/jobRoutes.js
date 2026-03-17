const express = require('express');
const {
    getJobMatches,
    updateJobMatchStatus,
    getSkillGaps,
    getTrendingJobs,
    predictAndScan
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware'); // assuming standard auth middleware

const router = express.Router();

// Route: /api/v1/jobs/matches
router.route('/matches')
    .get(protect, getJobMatches);

// Route: /api/v1/jobs/trending
router.route('/trending')
    .get(protect, getTrendingJobs);

// Route: /api/v1/jobs/:id/apply (or status update)
router.route('/:id/apply')
    .post(protect, updateJobMatchStatus);

// Note: /api/v1/analysis/skill-gaps will be handled here since analysis route doesn't exist yet
router.route('/analysis/skill-gaps')
    .get(protect, getSkillGaps);

// Route: /api/v1/jobs/scan
router.route('/scan')
    .post(protect, predictAndScan);

// Route: /api/v1/jobs/growth-prediction
router.route('/growth-prediction')
    .get(protect, (req, res) => res.status(200).json({ success: true, data: "Your growth looks promising in AI Engineering." })); // Mock for now

module.exports = router;
