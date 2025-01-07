// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController');
const auth = require('../middleware/auth');

router.post('/register', auth.verifyToken, authController.register);
router.post('/login', authController.login);
router.post('/logout', auth.verifyToken, authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;