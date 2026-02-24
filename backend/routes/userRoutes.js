const express = require('express');
const { getProfile, updateProfile, updatePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all user routes below

router.route('/profile')
    .get(getProfile)
    .put(updateProfile);

router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

module.exports = router;

    