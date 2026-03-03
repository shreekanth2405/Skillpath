const express = require('express');
const { getEvents, registerForEvent, getMyRegistrations, seedEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getEvents);

router.route('/my-registrations')
    .get(protect, getMyRegistrations);

router.route('/seed')
    .post(protect, seedEvents);

router.route('/:id/register')
    .post(protect, registerForEvent);


module.exports = router;
