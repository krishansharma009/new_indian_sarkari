const express = require("express");
const router = express.Router();
const SocialLinkController = require("./SocialLinkController");
const FileUploadHelper = require("../../utils/fileUpload.helper");

// Add file upload middleware
router.post("/", FileUploadHelper.uploadSingleFile, SocialLinkController.create);
router.get("/", SocialLinkController.getAll);
router.get("/:id", SocialLinkController.getById);
router.put("/:id", FileUploadHelper.uploadSingleFile, SocialLinkController.update);
router.delete("/:id", SocialLinkController.delete);

module.exports = router;
