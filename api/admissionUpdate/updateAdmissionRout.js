const express = require("express");
const AdmissionUpdateController = require("./updateAdmissionCont");

const router = express.Router();

router.get("/", AdmissionUpdateController.getAllAdmissionUpdates);
router.get("/:id", AdmissionUpdateController.getAllAdmissionUpdates);
router.post("/", AdmissionUpdateController.createAdmissionUpdate);
router.put("/:id", AdmissionUpdateController.updateAdmissionUpdate);
router.delete("/:id", AdmissionUpdateController.deleteAdmissionUpdate);

// New routes for specific sections
router.get("/get/latest-admision", AdmissionUpdateController.getLatestAdmission);
router.get("/get/school", AdmissionUpdateController.getSchools);
router.get("/get/ut/university", AdmissionUpdateController.getColleges);
router.get("/get/college", AdmissionUpdateController.getUniversities);

module.exports = router;
