import React, { useMemo } from "react";
import "./PasswordStrength.scss";

const LEVELS = [
  { label: "Too short",  color: "weak",   min: 0  },
  { label: "Weak",       color: "weak",   min: 1  },
  { label: "Fair",       color: "fair",   min: 2  },
  { label: "Good",       color: "good",   min: 3  },
  { label: "Strong",     color: "strong", min: 4  },
];

/**
 * Score 0–4 based on password characteristics.
 */
function scorePassword(password) {
  if (!password || password.length < 8) return 0;
  let score = 1;
  if (password.length >= 12)            score++;
  if (/[A-Z]/.test(password))           score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^A-Za-z0-9]/.test(password))    score++;
  return Math.min(score, 4);
}

/**
 * PasswordStrength
 * @prop {string} password - current password value
 */
export default function PasswordStrength({ password }) {
  const score = useMemo(() => scorePassword(password), [password]);
  const level = LEVELS[score];

  if (!password) return null;

  return (
    <div className="pw-strength" aria-live="polite" aria-label={`Password strength: ${level.label}`}>
      <div className="pw-strength__bars">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`pw-strength__bar ${i <= score ? `pw-strength__bar--${level.color}` : ""}`}
          />
        ))}
      </div>
      <span className={`pw-strength__label pw-strength__label--${level.color}`}>
        {level.label}
      </span>
    </div>
  );
}
