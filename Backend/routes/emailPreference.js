const express = require('express');
const router = express.Router();
const { handleEmailPreference }  = require('../controllers/emailPreferenceController');

router.post('/', handleEmailPreference);

module.exports = router;