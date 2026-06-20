const { GoogleGenAI } = require("@google/genai");

function safeParseJSON(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // try to extract just the {...} block if there's extra text around it
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("AI did not return valid JSON: " + cleaned.slice(0, 200));
  }
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/**
 * @name analyzeSkillGap
 * @description compares resume text against target role, returns structured JSON
 */
async function analyzeSkillGap(resumeText, targetRole) {
  const prompt = `
You are a career analysis engine. Compare the resume below against the target job role.
Return ONLY valid JSON, no markdown, no preamble, in this exact shape:

{
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "readinessScore": 72,
  "summary": "one short sentence"
}

Target Role: ${targetRole}

Resume:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const cleaned = response.text.replace(/```json|```/g, "").trim();
  return safeParseJSON(cleaned);
}

/**
 * @name generateInterviewQuestions
 * @description generates technical + behavioral questions for target role
 */
async function generateInterviewQuestions(targetRole, missingSkills) {
  const prompt = `
Generate interview questions for the role: ${targetRole}.
Focus extra attention on these weaker areas: ${missingSkills.join(", ")}.

Return ONLY valid JSON, no markdown, in this exact shape:

{
  "technical": ["question1", "question2", "question3", "question4", "question5"],
  "behavioral": ["question1", "question2", "question3", "question4", "question5"]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const cleaned = response.text.replace(/```json|```/g, "").trim();
  return safeParseJSON(cleaned);
}

/**
 * @name generateCorrectedResume
 * @description rewrites resume text to be ATS-friendly and aligned to target role
 */
async function generateCorrectedResume(resumeText, targetRole, missingSkills) {
  const prompt = `
Rewrite the resume below to be ATS-friendly and tailored for: ${targetRole}.
Naturally incorporate these missing skills where truthful and relevant: ${missingSkills.join(", ")}.
Keep it factual — do not invent experience the candidate doesn't have.
Return ONLY the rewritten resume as plain text, structured with clear section headers
(Summary, Skills, Experience, Education, Projects). No markdown formatting, no asterisks.

Original Resume:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  return response.text.trim();
}

module.exports = {
  analyzeSkillGap,
  generateInterviewQuestions,
  generateCorrectedResume,
};