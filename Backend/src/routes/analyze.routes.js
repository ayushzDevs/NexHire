const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middlewares");
const { analyzeRateLimiter } = require("../middlewares/rateLimit.middlewares");
const {
  analyzeProfileController,
  getAnalysisController,
} = require("../controllers/analyze.controllers");

router.use(authUser);

router.post("/", analyzeRateLimiter, analyzeProfileController);
router.get("/", getAnalysisController); // GET stays unlimited, it's just a DB read

module.exports = router;