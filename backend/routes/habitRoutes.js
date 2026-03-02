const express = require('express');
const {
    getHabits,
    createHabit,
    completeHabit,
    deleteHabit
} = require('../controllers/habitController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getHabits)
    .post(createHabit);

router.route('/:id/complete')
    .put(completeHabit);

router.route('/:id')
    .delete(deleteHabit);

module.exports = router;
