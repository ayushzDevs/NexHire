import React from "react";
import "./SubmitButton.scss";

/**
 * SubmitButton
 * @prop {string}   label     - button label text
 * @prop {boolean}  loading   - shows spinner when true
 * @prop {boolean}  disabled
 * @prop {function} onClick
 */
export default function SubmitButton({ label = "Sign in", loading = false, disabled = false, onClick }) {
  return (
    <button
      className="submit-btn"
      onClick={onClick}
      disabled={disabled || loading}
      type="button"
      aria-busy={loading}
    >
      {loading ? (
        <span className="submit-btn__spinner" aria-label="Loading" />
      ) : (
        <>
          <span className="submit-btn__label">{label}</span>
          <i className="ti ti-arrow-right submit-btn__arrow" aria-hidden="true" />
        </>
      )}
    </button>
  );
}
