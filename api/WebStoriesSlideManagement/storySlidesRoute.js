const express = require('express');
const slidesController = require('./storySlidesController')
const FileUploadHelper = require("../../utils/fileUpload.helper");

const router = express.Router();

router.post('/:webStoryId',FileUploadHelper.uploadSingleFile,slidesController.addSlidesToWebStory);
router.get('/:webStoryId', slidesController.getAllSlidesForWebStory);
router.delete('/:slideId', slidesController.deleteSlide);


module.exports = router;