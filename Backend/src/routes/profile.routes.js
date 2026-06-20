const express = require("express");
const router = express.Router();

const { authUser } = require("../middlewares/auth.middlewares");
const { uploadRateLimiter } = require("../middlewares/rateLimit.middlewares");
const upload = require("../config/multer.config");
const {
  uploadResumeController,
  saveTargetRoleController,
  getProfileController,
} = require("../controllers/profile.controllers");

router.use(authUser);

router.get("/", getProfileController);
router.post("/resume", uploadRateLimiter, upload.single("resume"), uploadResumeController);
router.post("/role", saveTargetRoleController);

module.exports = router;