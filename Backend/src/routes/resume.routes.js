const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middlewares");
const { resumeGenRateLimiter } = require("../middlewares/rateLimit.middlewares");
const { generateAtsResumeController } = require("../controllers/resume.controllers");

router.use(authUser);

router.post("/generate", resumeGenRateLimiter, generateAtsResumeController);

module.exports = router;