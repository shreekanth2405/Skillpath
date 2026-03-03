const express = require('express');
const { getCertifications, seedCertifications } = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getCertifications);

router.route('/seed')
    .post(protect, seedCertifications);

module.exports = router;
