const express = require('express');
const router = express.Router();
const { 
    getProjects, 
    getProjectById, 
    enrollInProject, 
    completeProject 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.post('/:id/enroll', protect, enrollInProject);
router.put('/user/:userProjectId/complete', protect, completeProject);

module.exports = router;
