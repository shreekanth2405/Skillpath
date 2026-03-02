const express = require('express');
const router = express.Router();
const {
    startSession,
    analyzeSession,
    getReport,
    completeSession
} = require('../controllers/communicationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All communication routes are protected

router.post('/session/start', startSession);
router.post('/session/:id/analyze', analyzeSession);
router.get('/session/:id/report', getReport);
router.post('/session/:id/complete', completeSession);

module.exports = router;
