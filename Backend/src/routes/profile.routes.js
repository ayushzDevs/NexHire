const express = require("express");
const router = express.Router();

const { authUser } = require("../middlewares/auth.middlewares");
const upload = require("../config/multer.config");
const {
  uploadResumeController,
  saveTargetRoleController,
  getProfileController,
} = require("../controllers/profile.controllers");

// all routes here require a valid logged-in user
router.use(authUser);

router.get("/", getProfileController);
router.post("/resume", upload.single("resume"), uploadResumeController);
router.post("/role", saveTargetRoleController);

module.exports = router;
