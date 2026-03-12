const express = require('express');
const router = express.Router();
const {
    getLabs,
    getLab,
    submitLab,
    getMySubmissions
} = require('../controllers/labController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', getLabs);
router.get('/my-submissions', protect, getMySubmissions);
router.get('/:id', getLab);
router.post('/:id/submit', protect, submitLab);

module.exports = router;
