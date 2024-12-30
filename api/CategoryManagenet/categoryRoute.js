const express = require("express");
const categoryController = require("./categoryController");
const FileUploadHelper = require("../../utils/fileUpload.helper");

const router = express.Router();

// Add file upload middleware to the create and update routes
router.post(
  "/",
  FileUploadHelper.uploadSingleFile,
  categoryController.createCategory
);
router.put(
  "/:id",
  FileUploadHelper.uploadSingleFile,
  categoryController.updateCategory
);

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
