const express = require("express");
const JobSEOController = require("./jobSeoController");

const router = express.Router();

router.get("/", JobSEOController.getAllJobSEOs);
router.get("/:id", JobSEOController.getJobSEOById);
router.post("/", JobSEOController.createJobSEO);
router.put("/:id", JobSEOController.updateJobSEO);
router.delete("/:id", JobSEOController.deleteJobSEO);

module.exports = router;
