import React from "react";
import "./SuccessState.scss";

/**
 * SuccessState
 * Shown after successful login before redirect.
 * @prop {string} message - optional override message
 */
export default function SuccessState({ message = "Redirecting to your dashboard…" }) {
  return (
    <div className="success-state" role="status" aria-live="polite">
      <div className="success-state__icon" aria-hidden="true">
        <i className="ti ti-check" />
      </div>
      <h2 className="success-state__title">You're in.</h2>
      <p className="success-state__msg">{message}</p>
    </div>
  );
}
