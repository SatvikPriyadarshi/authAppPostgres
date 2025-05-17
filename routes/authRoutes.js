const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again after 15 minutes.',
});

router.get('/register', authController.showRegister);
router.post('/register', authController.registerUser);

router.get('/login', authController.showLogin);
router.post('/login', loginLimiter, authController.loginUser);

router.get('/logout', authController.logoutUser);

module.exports = router;
