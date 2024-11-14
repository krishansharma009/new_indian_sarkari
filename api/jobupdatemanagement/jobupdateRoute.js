const express = require("express");
const JobUpdateController = require("./jobupdateController");

const router = express.Router();

router.get("/", JobUpdateController.getAllJobUpdates);
router.get("/job-updates/:id", JobUpdateController.getJobUpdateById);
router.post("/", JobUpdateController.createJobUpdate);
router.put("/:id", JobUpdateController.updateJobUpdate);
router.delete("/:id", JobUpdateController.deleteJobUpdate);

// New routes for specific sections
router.get("/latest-jobs", JobUpdateController.getLatestJobs);
router.get("/admit-cards", JobUpdateController.getAdmitCards);
router.get("/answer-keys", JobUpdateController.getAnswerKeys);
router.get("/results", JobUpdateController.getResults);

module.exports = router;