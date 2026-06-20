const userModel = require("../models/user.models");
const cloudinary = require("../config/cloudinary.config");


/**
 * @name uploadResumeController
 * @description uploads resume (PDF/DOCX) to Cloudinary, saves URL to user
 * @access Private
 */
async function uploadResumeController(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // extra server-side guard, even though multer already checked this
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: "Unsupported file type" });
  }

  try {
    const base64File = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64File}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "nexhire/resumes",
      resource_type: "raw",
      public_id: `${req.user.id}_${Date.now()}`,
    });

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        resumeUrl: result.secure_url,
        resumePublicId: result.public_id,
        resumeMimeType: req.file.mimetype,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: user.resumeUrl,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
}


/**
 * @name saveTargetRoleController
 * @description saves the user's target job role
 * @access Private
 */
async function saveTargetRoleController(req, res) {
  const { targetRole } = req.body;

  if (!targetRole || !targetRole.trim()) {
    return res.status(400).json({ message: "Target role is required" });
  }

  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    { targetRole: targetRole.trim() },
    { new: true }
  );

  return res.status(200).json({
    message: "Target role saved successfully",
    targetRole: user.targetRole,
  });
}

/**
 * @name getProfileController
 * @description returns the user's saved resume URL and target role
 * @access Private
 */
async function getProfileController(req, res) {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    message: "Profile fetched successfully",
    profile: {
      resumeUrl: user.resumeUrl,
      targetRole: user.targetRole,
    },
  });
}

module.exports = {
  uploadResumeController,
  saveTargetRoleController,
  getProfileController,
};
