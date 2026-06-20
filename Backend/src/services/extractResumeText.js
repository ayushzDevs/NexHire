const axios = require("axios");
const mammoth = require("mammoth");
const { PDFParse } = require("pdf-parse");

async function extractResumeText(resumeUrl, mimeType) {
  const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type for text extraction");
}

module.exports = extractResumeText;