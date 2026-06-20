const userModel = require("../models/user.models");
const InterviewReport = require("../models/report.models");
const cloudinary = require("../config/cloudinary.config");
const { generateCorrectedResume } = require("../services/ai.services");
const { generateResumePdfBuffer } = require("../services/pdfGenerator.services");

/**
 * @name generateAtsResumeController
 * @description generates a corrected, ATS-friendly resume PDF based on the latest analysis report
 * @access Private
 */
async function generateAtsResumeController(req, res) {
  const user = await userModel.findById(req.user.id);

  if (!user || !user.resumeUrl || !user.targetRole) {
    return res.status(400).json({
      message: "Upload a resume and set a target role before generating an ATS resume",
    });
  }

  const report = await InterviewReport
    .findOne({ userId: user._id })
    .sort({ createdAt: -1 });

  if (!report) {
    return res.status(400).json({
      message: "Run skill gap analysis first before generating a corrected resume",
    });
  }

  try {
    const missingSkills = report.skillGap.map(g => g.skill);
    const correctedText = await generateCorrectedResume(
      report.resumeText,
      report.jobDescription,
      missingSkills
    );

    const pdfBuffer = await generateResumePdfBuffer(correctedText, user.username);

    // upload generated PDF to cloudinary under its own folder
    const base64Pdf = pdfBuffer.toString("base64");
    const dataUri = `data:application/pdf;base64,${base64Pdf}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "nexhire/generated-resumes",
      resource_type: "raw",
      public_id: `${user._id}_ats_${Date.now()}`,
    });

    // save the corrected text + pdf url back on the report
    report.correctedResumeText = correctedText;
    report.correctedResumeUrl = result.secure_url;
    await report.save();

    return res.status(200).json({
      message: "ATS resume generated successfully",
      resumeUrl: result.secure_url,
      correctedText,
    });
  } catch (err) {
    console.error("ATS RESUME ERROR:", err);
    return res.status(500).json({ message: "Resume generation failed", error: err.message });
  }
}

module.exports = { generateAtsResumeController };