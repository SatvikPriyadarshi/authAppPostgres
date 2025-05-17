const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.get('/profile', profileController.showProfile);

module.exports = router;
