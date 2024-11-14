const express = require('express');
const StateController = require('./StateController');

const router = express.Router();

router.get('/',StateController.getAllStates);
router.get('/:id',StateController.getStateById);
router.post('/',StateController.createState);
router.put('/:id',StateController.updateState);
router.delete('/:id',StateController.deleteState);

module.exports = router;