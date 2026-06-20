import React, { useState, useEffect } from "react";
import analyzeApi from "../../../api/analyzeApi";
import resumeApi  from "../../../api/resumeApi";
import "./AnalysisPage.scss";

export default function AnalysisPage() {
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [generatingResume, setGeneratingResume] = useState(false);
  const [resumeUrl, setResumeUrl]               = useState(null);
  const [resumeError, setResumeError]           = useState(null);

  useEffect(() => {
    analyzeApi
      .getAnalysis()
      .then((data) => setReport(data.report))
      .catch(() => setError("no-analysis"))
      .finally(() => setLoading(false));
  }, []);

  async function handleRunAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeApi.runAnalysis();
      setReport(data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateResume() {
    setGeneratingResume(true);
    setResumeError(null);
    try {
      const data = await resumeApi.generateAtsResume();
      setResumeUrl(data.resumeUrl);
    } catch (err) {
      setResumeError(err.response?.data?.message || "Could not generate resume");
    } finally {
      setGeneratingResume(false);
    }
  }

  if (loading) {
    return (
      <div className="analysis-page analysis-page--center">
        <span className="analysis-page__spinner" />
      </div>
    );
  }

  if (error === "no-analysis" || !report) {
    return (
      <div className="analysis-page analysis-page--center">
        <div className="analysis-empty">
          <p className="analysis-empty__text">No analysis yet — run it now.</p>
          <button className="analysis-empty__btn" onClick={handleRunAnalysis}>
            Run skill gap analysis
          </button>
          {error && error !== "no-analysis" && (
            <p className="analysis-empty__error">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <header className="analysis-page__header">
        <div className="analysis-page__logo">Nex<span>Hire</span></div>
        <a href="/dashboard" className="analysis-page__back">← Back to dashboard</a>
      </header>

      <main className="analysis-page__main">
        {/* readiness score */}
        <div className="analysis-card analysis-card--score">
          <div className="score-ring" style={{ "--pct": report.matchScore }}>
            <span>{report.matchScore}%</span>
          </div>
          <p className="analysis-card__summary">
            Target role: {report.jobDescription}
          </p>
        </div>

        {/* matched + missing skills */}
        <div className="analysis-skills-grid">
          <div className="analysis-card">
            <h3 className="analysis-card__title analysis-card__title--good">
              <i className="ti ti-circle-check" aria-hidden="true" /> Matched Skills
            </h3>
            <div className="skill-tags">
              {report.matchedSkills.map(skill => (
                <span key={skill} className="skill-tag skill-tag--good">{skill}</span>
              ))}
            </div>
          </div>

          <div className="analysis-card">
            <h3 className="analysis-card__title analysis-card__title--bad">
              <i className="ti ti-alert-triangle" aria-hidden="true" /> Skill Gaps
            </h3>
            <div className="skill-tags">
              {report.skillGap.map(({ skill, severity }) => (
                <span key={skill} className={`skill-tag skill-tag--${severity === "high" ? "bad" : "good"}`}>
                  {skill} <small>({severity})</small>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* interview questions */}
        <div className="analysis-questions-grid">
          <div className="analysis-card">
            <h3 className="analysis-card__title">Technical Questions</h3>
            <ol className="question-list">
              {report.technicalQuestions.map((q, i) => (
                <li key={i}>{q.question}</li>
              ))}
            </ol>
          </div>

          <div className="analysis-card">
            <h3 className="analysis-card__title">Behavioral Questions</h3>
            <ol className="question-list">
              {report.behavioralQuestions.map((q, i) => (
                <li key={i}>{q.question}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* ATS resume generation */}
        <div className="analysis-card analysis-resume-card">
          <h3 className="analysis-card__title">ATS-Friendly Resume</h3>

          {resumeUrl ? (
            <div className="resume-ready">
              <i className="ti ti-file-check" aria-hidden="true" />
              <span>Your corrected resume is ready</span>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-ready__download">
                Download PDF
              </a>
            </div>
          ) : (
            <>
              <p className="analysis-card__summary">
                Generate a rewritten, ATS-optimized version of your resume tailored to {report.jobDescription}.
              </p>
              <button
                className="generate-resume-btn"
                onClick={handleGenerateResume}
                disabled={generatingResume}
              >
                {generatingResume ? (
                  <span className="generate-resume-btn__spinner" />
                ) : (
                  <>
                    <i className="ti ti-sparkles" aria-hidden="true" /> Generate ATS Resume
                  </>
                )}
              </button>
              {resumeError && <p className="analysis-empty__error">{resumeError}</p>}
            </>
          )}
        </div>

        <button className="analysis-rerun-btn" onClick={handleRunAnalysis}>
          <i className="ti ti-refresh" aria-hidden="true" /> Re-run analysis
        </button>
      </main>
    </div>
  );
}