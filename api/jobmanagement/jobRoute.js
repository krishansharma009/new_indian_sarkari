const express = require("express");
const JobController = require("./jobController");

const router = express.Router();

router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);
router.get("/slug/:slug", JobController.getJobBySlug);
router.post("/", JobController.createJob);
router.put("/:id", JobController.updateJob);
router.delete("/:id", JobController.deleteJob);
router.get("/category/:categoryId", JobController.getJobsByCategory);

module.exports = router;
