import { useNavigate } from "react-router";
import React, { useState } from "react";
import BrandPanel from "../components/BrandPanel.jsx"
import FormField     from "../components/FormField.jsx";
import SubmitButton  from "../components/SubmitButton.jsx";
import OAuthButton   from "../components/OAuthButton.jsx";
import SuccessState  from "../components/SuccessState.jsx";
import "./Login.scss";

// ── Validation ───────────────────────────────────────────────
function validate(email, password) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
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

// ── Page ──────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate(); 
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  // ── handlers ──────────────────────────────────────────────
  async function handleLogin() {
    const errs = validate(email, password);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    // ── TODO: replace with axios call ──
    //
    // import axios from "axios";
    //
    // try {
    //   const { data } = await axios.post("/auth/login", { email, password }, {
    //     withCredentials: true,          // sends httpOnly cookie
    //   });
    //   localStorage.setItem("nexhire_token", data.token);  // or rely on cookie
    //   setSuccess(true);
    //   setTimeout(() => navigate("/dashboard"), 1500);
    // } catch (err) {
    //   const msg = err.response?.data?.message || "Invalid email or password";
    //   setErrors({ password: msg });
    //   setLoading(false);
    // }

    // ── mock delay (remove when axios is wired) ──
    setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => navigate("/dashboard"), 1500);  // ← redirect after success screen
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

  // ── render ────────────────────────────────────────────────
  return (
    <div className="login-page">
      <BrandPanel />

      <main className="login-page__right">
        {/* background glow */}
        <div className="login-page__glow" aria-hidden="true" />

        <div className="login-form-card">
          {success ? (
            <SuccessState />
          ) : (
            <>
              {/* heading */}
              <div className="login-form-card__header">
                <h2 className="login-form-card__title">Welcome back</h2>
                <p className="login-form-card__sub">Sign in to your NexHire account</p>
              </div>

              {/* email */}
              <FormField
                id="login-email"
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
              <FormField
                id="login-password"
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                error={errors.password}
                autoComplete="current-password"
                rightSlot={
                  <EyeToggle
                    show={showPass}
                    onToggle={() => setShowPass(v => !v)}
                  />
                }
              />

              {/* forgot */}
              <div className="login-form-card__forgot-row">
                <a href="/forgot-password" className="login-form-card__forgot">
                  Forgot password?
                </a>
              </div>

              {/* submit */}
              <SubmitButton
                label="Sign in"
                loading={loading}
                onClick={handleLogin}
              />

              {/* divider */}
              <div className="login-form-card__divider" aria-hidden="true">or</div>

              {/* oauth */}
              <OAuthButton provider="google" onClick={handleGoogleOAuth} />
              <OAuthButton provider="github" onClick={handleGithubOAuth} />

              {/* signup link */}
              <p className="login-form-card__signup">
                Don't have an account?{" "}
                <a href="/register" className="login-form-card__signup-link">
                  Sign up free
                </a>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
