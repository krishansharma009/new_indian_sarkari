const express = require("express");
const JobUpdateController = require("./jobupdateController");

const router = express.Router();

router.get("/", JobUpdateController.getAllJobUpdates);
router.get("/:id", JobUpdateController.getJobUpdateById);
router.post("/", JobUpdateController.createJobUpdate);
router.put("/:id", JobUpdateController.updateJobUpdate);
router.delete("/:id", JobUpdateController.deleteJobUpdate);

// New routes for specific sections
router.get("/get/latest-jobs", JobUpdateController.getLatestJobs);
router.get("/get/admit-cards", JobUpdateController.getAdmitCards);
router.get("/get/answer-keys", JobUpdateController.getAnswerKeys);
router.get("/get/results", JobUpdateController.getResults);

module.exports = router;