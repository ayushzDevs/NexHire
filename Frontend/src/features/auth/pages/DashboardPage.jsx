import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import FileUpload    from "../components/FileUpload";
import SubmitButton  from "../components/SubmitButton";
import FormField     from "../components/FormField";
import profileApi    from "../../../api/profileApi";
import { useAuth }   from "../hooks/useAuth";
import "./DashboardPage.scss";

export default function DashboardPage() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const [resumeUrl, setResumeUrl]       = useState(null);
  const [targetRole, setTargetRole]     = useState("");
  const [savedRole, setSavedRole]       = useState(null);

  const [uploadingResume, setUploadingResume] = useState(false);
  const [savingRole, setSavingRole]            = useState(false);
  const [fileError, setFileError]              = useState(null);
  const [roleError, setRoleError]              = useState(null);
  const [loadingProfile, setLoadingProfile]    = useState(true);

  useEffect(() => {
    profileApi
      .getProfile()
      .then(({ profile }) => {
        setResumeUrl(profile.resumeUrl);
        setSavedRole(profile.targetRole);
        setTargetRole(profile.targetRole || "");
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  async function handleFileSelect(file, error) {
    setFileError(error);
    if (!file) return;

    setUploadingResume(true);
    try {
      const data = await profileApi.uploadResume(file);
      setResumeUrl(data.resumeUrl);
    } catch (err) {
      setFileError(err.response?.data?.message || "Upload failed, try again");
    } finally {
      setUploadingResume(false);
    }
  }

  async function handleSaveRole() {
    if (!targetRole.trim()) {
      setRoleError("Please enter a target role");
      return;
    }
    setRoleError(null);
    setSavingRole(true);

    try {
      const data = await profileApi.saveTargetRole(targetRole);
      setSavedRole(data.targetRole);
    } catch (err) {
      setRoleError(err.response?.data?.message || "Could not save role");
    } finally {
      setSavingRole(false);
    }
  }

  async function onLogoutClick() {
    await handleLogout();
    navigate("/login", { replace: true });
  }

  const readyForNextStep = Boolean(resumeUrl) && Boolean(savedRole);

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header">
        <div className="dashboard-page__logo">Nex<span>Hire</span></div>
        <button className="dashboard-page__logout" onClick={onLogoutClick}>
          <i className="ti ti-logout" aria-hidden="true" /> Logout
        </button>
      </header>

      <main className="dashboard-page__main">
        <div className="dashboard-card">
          <h1 className="dashboard-card__title">Set up your profile</h1>
          <p className="dashboard-card__sub">
            Upload your resume and tell us the role you're targeting — this powers your skill gap analysis.
          </p>

          {loadingProfile ? (
            <div className="dashboard-card__loading">
              <span className="dashboard-card__spinner" />
            </div>
          ) : (
            <>
              <FileUpload
                onFileSelect={handleFileSelect}
                existingFileUrl={resumeUrl}
                uploading={uploadingResume}
                error={fileError}
              />

              <FormField
                id="target-role"
                label="Target job role"
                type="text"
                placeholder="e.g. Frontend Developer, Data Analyst"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSaveRole()}
                error={roleError}
                iconClass="ti-target-arrow"
              />

              <SubmitButton
                label={savedRole ? "Update role" : "Save role"}
                loading={savingRole}
                onClick={handleSaveRole}
              />

              {readyForNextStep && (
                <Link to="/analysis" className="dashboard-card__ready">
                  <i className="ti ti-circle-check" aria-hidden="true" />
                  Profile complete — view skill gap analysis →
                </Link>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}