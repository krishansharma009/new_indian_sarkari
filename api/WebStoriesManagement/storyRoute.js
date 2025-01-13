const express = require('express');
const storyController = require('./storyController')
const FileUploadHelper = require("../../utils/fileUpload.helper");

const router = express.Router();

router.post('/',FileUploadHelper.uploadSingleFile,storyController.createStory);
router.get('/', storyController.getStories);
router.get('/:id', storyController.getStoryById);
router.delete('/:id', storyController.deleteStory);

module.exports = router;