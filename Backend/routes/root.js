const express = require('express');
const router = express.Router();
const path = require('path');

//Route for the root page, for "/index" or "/index.html". 
router.get(/^\/index(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Public', 'index.html' ))
});

module.exports = router;