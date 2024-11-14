const express = require('express');
const subCategoryController = require('./subCategoryController');

const router = express.Router();

router.get('/',subCategoryController.getAllSubcategories);
router.get('/:id',subCategoryController.getSubCategoryById);
router.post('/',subCategoryController.createSubCategory);
router.put('/:id',subCategoryController.updateSubCategory);
router.delete('/:id',subCategoryController.deleteSubCategory);

module.exports = router;