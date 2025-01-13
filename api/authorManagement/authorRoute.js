const express = require("express");
const authorController = require("./authorController");
const FileUploadHelper = require("../../utils/fileUpload.helper");

const router = express.Router();

// Add file upload middleware to the create and update routes
router.post("/",FileUploadHelper.uploadSingleFile,authorController.createAuthor);
router.get("/" , authorController.getAuthors)
router.get("/:id" , authorController.getAuthorById)
router.put("/:id" , FileUploadHelper.uploadSingleFile,authorController.updateAuthor)
router.delete("/:id" , authorController.deleteAuthor)

module.exports = router;
