const express = require("express");
const AdmissionController = require("./admissionController");

const router = express.Router();

router.get("/", AdmissionController.getAllAdmission);
router.get("/:id", AdmissionController.getAdmissionById);
router.post("/", AdmissionController.createAdmission);
router.put("/:id", AdmissionController.updateAdmission);
router.delete("/:id", AdmissionController.deleteAdmission);

module.exports = router;
