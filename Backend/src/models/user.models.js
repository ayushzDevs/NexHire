const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    resumeUrl: { type: String, default: null },
    resumePublicId: { type: String, default: null },
    targetRole: { type: String, default: null },
    resumeMimeType: { type: String, default: null },

    // ── new fields for analysis ──
    resumeText: { type: String, default: null },
    skillGap: {
      matchedSkills: [String],
      missingSkills: [String],
      readinessScore: Number,
      summary: String,
    },
    interviewQuestions: {
      technical: [String],
      behavioral: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);