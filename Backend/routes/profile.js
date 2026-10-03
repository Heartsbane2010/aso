const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route to get user profile
router.get('/', profileController.getUserProfile);
router.put('/', profileController.updateUserProfile);

module.exports = router;