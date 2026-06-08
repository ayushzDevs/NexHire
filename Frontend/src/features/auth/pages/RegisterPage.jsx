import React, { useState } from "react";
import BrandPanel       from "../components/BrandPanel";
import FormField        from "../components/FormField";
import SubmitButton     from "../components/SubmitButton";
import OAuthButton      from "../components/OAuthButton";
import SuccessState     from "../components/SuccessState";
import PasswordStrength from "../components/PasswordStrength";
import "./RegisterPage.scss";

// ── Validation ────────────────────────────────────────────────
function validate(username, email, password, confirm) {
  const errors = {};

  if (!username || username.trim().length < 2) {
    errors.username = "Username must be at least 2 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = "Only letters, numbers, and underscores allowed";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (confirm !== password) {
    errors.confirm = "Passwords do not match";
  }

  return errors;
}

// ── Eye toggle button ─────────────────────────────────────────
function EyeToggle({ show, onToggle }) {
  return (
    <button
      className="eye-toggle"
      type="button"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
    >
      <i className={`ti ${show ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function RegisterPage() {
  const [username, setUsername]       = useState("");
  const [email,    setEmail]          = useState("");
  const [password, setPassword]       = useState("");
  const [confirm,  setConfirm]        = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConf, setShowConf]       = useState(false);
  const [errors,   setErrors]         = useState({});
  const [loading,  setLoading]        = useState(false);
  const [success,  setSuccess]        = useState(false);
  const [agreed,   setAgreed]         = useState(false);
  const [agreeErr, setAgreeErr]       = useState(false);

  // ── handlers ─────────────────────────────────────────────
  async function handleRegister() {
    const errs = validate(username, email, password, confirm);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!agreed) { setAgreeErr(true); return; }

    setErrors({});
    setAgreeErr(false);
    setLoading(true);

    // ── TODO: replace with axios call ──
    //
    // import axios from "axios";
    //
    // try {
    //   const { data } = await axios.post("/auth/signup", {
    //     username,
    //     email,
    //     password,
    //   }, { withCredentials: true });
    //   localStorage.setItem("nexhire_token", data.token);
    //   setSuccess(true);
    //   setTimeout(() => navigate("/dashboard"), 1500);
    // } catch (err) {
    //   const msg = err.response?.data?.message || "Registration failed";
    //   if (msg.toLowerCase().includes("email")) {
    //     setErrors({ email: msg });
    //   } else if (msg.toLowerCase().includes("username")) {
    //     setErrors({ username: msg });
    //   } else {
    //     setErrors({ email: msg });
    //   }
    //   setLoading(false);
    // }

    // ── mock delay (remove when axios is wired) ──
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  }

  function handleGoogleOAuth() {
    // TODO: window.location.href = "/auth/google"
    alert("Wire up Passport Google OAuth strategy");
  }

  function handleGithubOAuth() {
    // TODO: window.location.href = "/auth/github"
    alert("Wire up Passport GitHub OAuth strategy");
  }

  // ── render ───────────────────────────────────────────────
  return (
    <div className="register-page">
      <BrandPanel />

      <main className="register-page__right">
        <div className="register-page__glow" aria-hidden="true" />

        <div className="register-form-card">
          {success ? (
            <SuccessState message="Account created! Redirecting to your dashboard…" />
          ) : (
            <>
              {/* heading */}
              <div className="register-form-card__header">
                <h2 className="register-form-card__title">Create account</h2>
                <p className="register-form-card__sub">
                  Start closing your skill gap today — it's free.
                </p>
              </div>

              {/* oauth — above the fold for easy access */}
              <div className="register-form-card__oauth-group">
                <OAuthButton provider="google" onClick={handleGoogleOAuth} />
                <OAuthButton provider="github" onClick={handleGithubOAuth} />
              </div>

              {/* divider */}
              <div className="register-form-card__divider" aria-hidden="true">
                or register with email
              </div>

              {/* username */}
              <FormField
                id="reg-username"
                label="Username"
                type="text"
                placeholder="yourhandle"
                value={username}
                onChange={e => setUsername(e.target.value)}
                error={errors.username}
                iconClass="ti-user"
                autoComplete="username"
              />

              {/* email */}
              <FormField
                id="reg-email"
                label="Email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={errors.email}
                iconClass="ti-mail"
                autoComplete="email"
              />

              {/* password */}
              <div className="register-form-card__pw-group">
                <FormField
                  id="reg-password"
                  label="Password"
                  type={showPass ? "text" : "password"}
                  placeholder="min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  error={errors.password}
                  autoComplete="new-password"
                  rightSlot={
                    <EyeToggle
                      show={showPass}
                      onToggle={() => setShowPass(v => !v)}
                    />
                  }
                />
                <PasswordStrength password={password} />
              </div>

              {/* confirm password */}
              <FormField
                id="reg-confirm"
                label="Confirm password"
                type={showConf ? "text" : "password"}
                placeholder="re-enter password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleRegister()}
                error={errors.confirm}
                autoComplete="new-password"
                rightSlot={
                  <EyeToggle
                    show={showConf}
                    onToggle={() => setShowConf(v => !v)}
                  />
                }
              />

              {/* terms checkbox */}
              <div className="register-form-card__terms">
                <label className="terms-check">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => {
                      setAgreed(e.target.checked);
                      if (e.target.checked) setAgreeErr(false);
                    }}
                    className="terms-check__input"
                  />
                  <span className="terms-check__box" aria-hidden="true">
                    {agreed && <i className="ti ti-check" />}
                  </span>
                  <span className="terms-check__label">
                    I agree to the{" "}
                    <a href="/terms" className="terms-check__link">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="terms-check__link">Privacy Policy</a>
                  </span>
                </label>
                {agreeErr && (
                  <p className="terms-check__error" role="alert">
                    You must agree to the terms to continue
                  </p>
                )}
              </div>

              {/* submit */}
              <SubmitButton
                label="Create account"
                loading={loading}
                onClick={handleRegister}
              />

              {/* login link */}
              <p className="register-form-card__login">
                Already have an account?{" "}
                <a href="/login" className="register-form-card__login-link">
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
