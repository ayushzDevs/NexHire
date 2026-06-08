import React from "react";
import "./FormField.scss";

/**
 * FormField
 * @prop {string}   id          - input id (for label htmlFor)
 * @prop {string}   label       - uppercase label text
 * @prop {string}   type        - input type
 * @prop {string}   placeholder
 * @prop {string}   value
 * @prop {function} onChange
 * @prop {function} onKeyDown   - optional keydown handler
 * @prop {string}   error       - error message string (shows red state)
 * @prop {string}   iconClass   - tabler icon class e.g. "ti-mail"
 * @prop {React.ReactNode} rightSlot - optional right-side slot (e.g. eye toggle)
 * @prop {string}   autoComplete
 */
export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  error,
  iconClass,
  rightSlot,
  autoComplete,
}) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>

      <div className="form-field__wrap">
        <input
          id={id}
          className={`form-field__input${error ? " form-field__input--error" : ""}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete}
          style={rightSlot ? { paddingRight: "44px" } : undefined}
        />

        {/* static right icon (no interaction) */}
        {iconClass && !rightSlot && (
          <i className={`ti ${iconClass} form-field__icon`} aria-hidden="true" />
        )}

        {/* interactive right slot (e.g. eye toggle) */}
        {rightSlot && (
          <div className="form-field__right-slot">{rightSlot}</div>
        )}
      </div>

      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
