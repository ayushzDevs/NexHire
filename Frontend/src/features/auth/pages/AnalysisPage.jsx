import React, { useState, useEffect } from "react";
import analyzeApi from "../../../api/analyzeApi";
import "./AnalysisPage.scss";

export default function AnalysisPage() {
  const [skillGap, setSkillGap]   = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    analyzeApi
      .getAnalysis()
      .then((data) => {
        setSkillGap(data.skillGap);
        setQuestions(data.questions);
      })
      .catch(() => setError("no-analysis"))
      .finally(() => setLoading(false));
  }, []);

  async function handleRunAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeApi.runAnalysis();
      setSkillGap(data.skillGap);
      setQuestions(data.questions);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="analysis-page analysis-page--center">
        <span className="analysis-page__spinner" />
      </div>
    );
  }

  if (error === "no-analysis" || !skillGap) {
    return (
      <div className="analysis-page analysis-page--center">
        <div className="analysis-empty">
          <p className="analysis-empty__text">No analysis yet — run it now.</p>
          <button className="analysis-empty__btn" onClick={handleRunAnalysis}>
            Run skill gap analysis
          </button>
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
          <div className="score-ring" style={{ "--pct": skillGap.readinessScore }}>
            <span>{skillGap.readinessScore}%</span>
          </div>
          <p className="analysis-card__summary">{skillGap.summary}</p>
        </div>

        {/* matched / missing skills */}
        <div className="analysis-skills-grid">
          <div className="analysis-card">
            <h3 className="analysis-card__title analysis-card__title--good">
              <i className="ti ti-circle-check" aria-hidden="true" /> Matched Skills
            </h3>
            <div className="skill-tags">
              {skillGap.matchedSkills.map(s => (
                <span key={s} className="skill-tag skill-tag--good">{s}</span>
              ))}
            </div>
          </div>

          <div className="analysis-card">
            <h3 className="analysis-card__title analysis-card__title--bad">
              <i className="ti ti-alert-triangle" aria-hidden="true" /> Missing Skills
            </h3>
            <div className="skill-tags">
              {skillGap.missingSkills.map(s => (
                <span key={s} className="skill-tag skill-tag--bad">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* interview questions */}
        {questions && (
          <div className="analysis-questions-grid">
            <div className="analysis-card">
              <h3 className="analysis-card__title">Technical Questions</h3>
              <ol className="question-list">
                {questions.technical.map((q, i) => <li key={i}>{q}</li>)}
              </ol>
            </div>

            <div className="analysis-card">
              <h3 className="analysis-card__title">Behavioral Questions</h3>
              <ol className="question-list">
                {questions.behavioral.map((q, i) => <li key={i}>{q}</li>)}
              </ol>
            </div>
          </div>
        )}

        <button className="analysis-rerun-btn" onClick={handleRunAnalysis}>
          <i className="ti ti-refresh" aria-hidden="true" /> Re-run analysis
        </button>
      </main>
    </div>
  );
}