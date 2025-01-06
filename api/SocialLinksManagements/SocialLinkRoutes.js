const express = require("express");
const router = express.Router();
const SocialLinkController = require("./SocialLinkController");


router.post("/", SocialLinkController.create);
router.get("/", SocialLinkController.getAll);
router.get("/:id", SocialLinkController.getById);
router.put("/:id", SocialLinkController.update);
router.delete("/:id", SocialLinkController.delete);

module.exports = router;
