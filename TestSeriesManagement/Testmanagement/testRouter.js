const express = require("express");
const testSeriseContoller = require("./testseriesesController");

const router = express.Router();

// Get all categories with filtering and pagination
router.get("/", testSeriseContoller.getAllTestCategories);

// Get categories by parent ID
router.get(
  "/parent/:parentId",
  testSeriseContoller.getTestCategoriesByParentId
);

router.get("/:id", testSeriseContoller.getTestCategoriesById);

// Create new category
router.post("/", testSeriseContoller.createTestCategory);

// Update category
router.put("/:id", testSeriseContoller.updateTestCategory);

// Delete category
router.delete("/:id", testSeriseContoller.deleteTestCategory);

router.delete("/soft/:id", testSeriseContoller.deleteCategory);

module.exports = router;
