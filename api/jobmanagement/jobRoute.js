const express = require("express");
const JobController = require("./jobController");

const router = express.Router();

router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);
router.post("/", JobController.createJob);
router.put("/:id", JobController.updateJob);
router.delete("/:id", JobController.deleteJob);

module.exports = router;
