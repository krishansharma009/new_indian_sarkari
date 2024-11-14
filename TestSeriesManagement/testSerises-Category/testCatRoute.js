const express = require("express");
const testCategoryController = require("./testCatController");

const router = express.Router();

// Get all categories with filtering and pagination
router.get("/", testCategoryController.getAllTestCategories);

// Get categories by parent ID
router.get(
  "/parent/:parentId",
  testCategoryController.getTestCategoriesByParentId
);

router.get("/:id", testCategoryController.getTestCategoriesById);

// Create new category
router.post("/", testCategoryController.createTestCategory);

// Update category
router.put("/:id", testCategoryController.updateTestCategory);

// Delete category
router.delete("/:id", testCategoryController.deleteTestCategory);

router.delete("/soft/:id", testCategoryController.deleteCategory);

module.exports = router;
