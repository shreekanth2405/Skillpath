const express = require('express');
const router = express.Router();
const {
    saveResume,
    getResumes,
    deleteResume
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', saveResume);
router.get('/', getResumes);
router.delete('/:id', deleteResume);

module.exports = router;
