// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('./userController');
const auth = require('../middleware/auth');

router.get('/', 
  auth.verifyToken, 
  auth.checkRole(['superadmin', 'admin']), 
  userController.getAll
);

router.get('/:id', 
  auth.verifyToken, 
  userController.getById
);

router.put('/:id', 
  auth.verifyToken, 
  userController.update
);

router.delete('/:id', 
  auth.verifyToken, 
  auth.checkRole(['superadmin', 'admin']), 
  userController.delete
);

module.exports = router;