const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, default: "" },
    _id: false
});

const behaviouralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, default: "" },
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], required: true },
    _id: false
});

const prepPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String, required: true }],
    _id: false
});

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobDescription: { type: String, required: true },
    resumeText: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behaviouralQuestionSchema],
    skillGap: [skillGapSchema],
    prepPlan: [prepPlanSchema]
}, { timestamps: true });

const InterviewReport = mongoose.model("InterviewReport", reportSchema);

module.exports = InterviewReport;