const express = require("express");
const router = express.Router();
const GeneralKnowledgeController = require("./generalknowledgeController");


router.post("/", GeneralKnowledgeController.createGeneralKnowledge);


router.get("/", GeneralKnowledgeController.getGeneralKnowledge);

// Endpoint to get single general knowledge by slug
router.get("/:slug", GeneralKnowledgeController.getGeneralKnowledgeBySlug);


router.put("/:id", GeneralKnowledgeController.updateGeneralKnowledge);


router.delete("/:id", GeneralKnowledgeController.deleteGeneralKnowledge);

module.exports = router;
