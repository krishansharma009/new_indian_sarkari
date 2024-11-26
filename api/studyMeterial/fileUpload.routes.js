const express = require("express");
const FileUploadController = require("./fileUpload.controller");
const FileUploadHelper = require("../../utils/fileUpload.helper");

const router = express.Router();

// Create file upload (supports both direct file and file URL)
router.post(
  "/",
  FileUploadHelper.uploadSingleFile,
  FileUploadController.create
);

// Update file upload
router.put(
  "/:id",
  FileUploadHelper.uploadSingleFile,
  FileUploadController.update
);

// Get files by upload type
router.get("/:uploadType", FileUploadController.getFilesByType);

// Delete file upload
router.delete("/:id", FileUploadController.delete);


// Get All Files with Advanced Filtering
router.get('/', FileUploadController.getAll);

// Get File by Specific ID
router.get('/get/:id', FileUploadController.getById);




module.exports = router;
