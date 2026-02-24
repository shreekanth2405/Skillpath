const express = require('express');
const { getStats, syncXP } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all dashboard routes

router.get('/stats', getStats);
router.post('/sync-xp', syncXP);

module.exports = router;
