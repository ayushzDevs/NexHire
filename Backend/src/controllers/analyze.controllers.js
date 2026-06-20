const userModel = require("../models/user.models");
const InterviewReport = require("../models/report.models");
const extractResumeText = require("../services/extractResumeText");
const {
  analyzeSkillGap,
  generateInterviewQuestions,
} = require("../services/ai.services");

async function analyzeProfileController(req, res) {
  const user = await userModel.findById(req.user.id);

  if (!user || !user.resumeUrl || !user.targetRole) {
    return res.status(400).json({
      message: "Upload a resume and set a target role before analyzing",
    });
  }

  try {
    const resumeText = await extractResumeText(user.resumeUrl, user.resumeMimeType);
    const gapResult = await analyzeSkillGap(resumeText, user.targetRole);
    const questions = await generateInterviewQuestions(
      user.targetRole,
      gapResult.missingSkills
    );

    const report = await InterviewReport.create({
      userId: user._id,
      jobDescription: user.targetRole,
      resumeText,
      matchScore: gapResult.readinessScore,
      matchedSkills: gapResult.matchedSkills,   // ✅ NEW LINE
      skillGap: gapResult.missingSkills.map(skill => ({
          skill,
          severity: "medium",
      })),
      technicalQuestions: questions.technical.map(q => ({
          question: q,
          intention: "Assess technical depth",
          answer: "",
      })),
      behavioralQuestions: questions.behavioral.map(q => ({
          question: q,
          intention: "Assess soft skills fit",
          answer: "",
      })),
  });

    return res.status(200).json({
      message: "Analysis complete",
      report,
    });
  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    return res.status(500).json({ message: "Analysis failed", error: err.message });
  }
}

async function getAnalysisController(req, res) {
  const report = await InterviewReport
    .findOne({ userId: req.user.id })
    .sort({ createdAt: -1 });

  if (!report) {
    return res.status(404).json({ message: "No analysis found. Run analysis first." });
  }

  return res.status(200).json({
    message: "Analysis fetched successfully",
    report,
  });
}

module.exports = { analyzeProfileController, getAnalysisController };