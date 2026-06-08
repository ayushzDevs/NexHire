import React from "react";
import "./BrandPanel.scss";

const FEATURES = [
  { num: "01", label: "Skill gap analysis",        icon: "ti-chart-bar" },
  { num: "02", label: "ATS resume builder",         icon: "ti-file-text" },
  { num: "03", label: "Role-specific interview prep", icon: "ti-message-dots" },
];

export default function BrandPanel() {
  return (
    <aside className="brand-panel">
      {/* Atmosphere layers */}
      <div className="brand-panel__mesh"    aria-hidden="true" />
      <div className="brand-panel__grid"    aria-hidden="true" />

      {/* Logo */}
      <div className="brand-panel__logo">
        Nex<span>Hire</span>
      </div>

      {/* Hero copy */}
      <div className="brand-panel__hero">
        <p className="brand-panel__eyebrow">AI career accelerator</p>
        <h1 className="brand-panel__headline">
          Your next<br />hire is <em>you.</em>
        </h1>
        <p className="brand-panel__sub">
          Close the gap between your current skills and your dream role — in minutes.
        </p>
      </div>

      {/* Feature list */}
      <ul className="brand-panel__features" aria-label="NexHire features">
        {FEATURES.map(({ num, label, icon }) => (
          <li className="brand-panel__feat" key={num}>
            <span className="brand-panel__feat-num">{num}</span>
            <span className="brand-panel__feat-label">{label}</span>
            <i className={`ti ${icon} brand-panel__feat-icon`} aria-hidden="true" />
          </li>
        ))}
      </ul>
    </aside>
  );
}
