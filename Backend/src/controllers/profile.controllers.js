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

  try {
    // convert multer's memory buffer into a base64 data URI
    const base64File = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64File}`;

    // upload to cloudinary — resource_type "raw" is required for PDF/DOCX
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "nexhire/resumes",
      resource_type: "raw",
      public_id: `${req.user.id}_${Date.now()}`,
    });

    // save returned url + public_id on the user document
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
    console.error("UPLOAD ERROR:", err);   // 👈 add this
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
