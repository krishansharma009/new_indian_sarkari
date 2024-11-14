const express = require("express");
const depertmentController = require("./depertmentController");

const router = express.Router();

router.get('/',depertmentController.getAllDepertment);
router.get('/:id',depertmentController.getDepertmentById);
router.post('/',depertmentController.createDepertment);
router.put('/:id',depertmentController.updateDepertment);
router.delete('/:id',depertmentController.deleteDepertment);


module.exports = router;
