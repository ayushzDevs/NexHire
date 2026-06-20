const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middlewares");
const {
  analyzeProfileController,
  getAnalysisController,
} = require("../controllers/analyze.controllers");

router.use(authUser);

router.post("/", analyzeProfileController);
router.get("/", getAnalysisController);

module.exports = router;