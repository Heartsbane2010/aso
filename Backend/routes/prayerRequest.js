const express = require('express');
const router = express.Router();
const prayerRequestController = require('../controllers/prayerRequestController');

router.post('/', prayerRequestController.handleNewPrayerRequest);
router.get('/', prayerRequestController.getPrayerRequests);

module.exports = router;