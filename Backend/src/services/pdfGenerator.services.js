const puppeteer = require("puppeteer");

/**
 * @name buildResumeHtml
 * @description converts plain-text resume (with section headers) into styled HTML
 */
function buildResumeHtml(resumeText, candidateName) {
  // split into sections based on common header keywords
  const sections = resumeText
    .split(/\n(?=Summary|Skills|Experience|Education|Projects|Certifications)/i)
    .map(block => block.trim())
    .filter(Boolean);

  const sectionsHtml = sections.map(section => {
    const lines = section.split("\n").filter(Boolean);
    const heading = lines[0];
    const body = lines.slice(1).join("\n");

    return `
      <section class="resume-section">
        <h2>${heading}</h2>
        <div class="resume-section__body">${body.replace(/\n/g, "<br/>")}</div>
      </section>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #1a1a1a;
          padding: 48px 56px;
          font-size: 11px;
          line-height: 1.6;
        }
        .resume-header {
          margin-bottom: 24px;
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 12px;
        }
        .resume-header h1 {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .resume-section {
          margin-bottom: 18px;
        }
        .resume-section h2 {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0f6e56;
          margin-bottom: 8px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 4px;
        }
        .resume-section__body {
          font-size: 11px;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="resume-header">
        <h1>${candidateName || "Candidate"}</h1>
      </div>
      ${sectionsHtml}
    </body>
    </html>
  `;
}

/**
 * @name generateResumePdfBuffer
 * @description renders the resume HTML to a PDF buffer using puppeteer
 */
async function generateResumePdfBuffer(resumeText, candidateName) {
  const html = buildResumeHtml(resumeText, candidateName);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfData = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });

    // force it into a real Node Buffer regardless of what puppeteer returned
    const pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = { generateResumePdfBuffer };