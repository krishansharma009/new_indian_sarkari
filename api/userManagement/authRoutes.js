const express = require('express');
const router = express.Router();
const AuthController = require('./authController');
const auth = require('../../middleware/authMiddleware');

// Public routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// Protected routes
router.use(auth.protect); // All routes below this will require authentication

// Logout route (requires auth)
router.post('/logout', AuthController.logout);

// Routes accessible by both users and admins
router.get('/me', AuthController.getUserById);
router.patch('/updateMe', AuthController.updateUser);

// Admin only routes
router.get('/users', auth.restrictTo('admin'), AuthController.getAllUsers);
router.get('/users/:id', auth.restrictTo('admin'), AuthController.getUserById);
router.patch('/users/:id', auth.restrictTo('admin'), AuthController.updateUser);
router.delete('/users/:id', auth.restrictTo('admin'), AuthController.deleteUser);

module.exports = router;