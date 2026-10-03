const express = require('express');
const router = express.Router();
const { updateProfilePicture } = require('../controllers/profilePicController');
const uploadProfilePic = require('../middleware/upload');

router.post('/', uploadProfilePic, updateProfilePicture);

module.exports = router;