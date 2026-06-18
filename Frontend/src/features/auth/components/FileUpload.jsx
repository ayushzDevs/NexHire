import React, { useState, useRef } from "react";
import "./FileUpload.scss";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function FileUpload({ onFileSelect, existingFileUrl, uploading, error }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  function validateAndSelect(file) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onFileSelect(null, "Only PDF and DOCX files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onFileSelect(null, "File must be under 5MB");
      return;
    }
    setFileName(file.name);
    onFileSelect(file, null);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    validateAndSelect(e.dataTransfer.files[0]);
  }

  function handleInputChange(e) {
    validateAndSelect(e.target.files[0]);
  }

  return (
    <div className="file-upload">
      <label className="file-upload__label">Resume</label>

      <div
        className={`file-upload__dropzone${isDragOver ? " file-upload__dropzone--active" : ""}${error ? " file-upload__dropzone--error" : ""}`}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          hidden
          onChange={handleInputChange}
        />

        {uploading ? (
          <>
            <span className="file-upload__spinner" />
            <p className="file-upload__text">Uploading…</p>
          </>
        ) : fileName || existingFileUrl ? (
          <>
            <i className="ti ti-file-check file-upload__icon file-upload__icon--success" aria-hidden="true" />
            <p className="file-upload__text">{fileName || "Resume uploaded"}</p>
            <p className="file-upload__hint">Click to replace</p>
          </>
        ) : (
          <>
            <i className="ti ti-upload file-upload__icon" aria-hidden="true" />
            <p className="file-upload__text">Drag & drop your resume, or click to browse</p>
            <p className="file-upload__hint">PDF or DOCX, up to 5MB</p>
          </>
        )}
      </div>

      {error && <p className="file-upload__error" role="alert">{error}</p>}
    </div>
  );
}