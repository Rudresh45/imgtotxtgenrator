import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  // File validation and preview creation
  const validateAndSetFile = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be smaller than 5MB.");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview("");
    setText("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const apiUrl = window.location.port === "5173"
        ? "http://127.0.0.1:8000/api/ocr/"
        : "/api/ocr/";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setText(data.text);
      } else {
        setError(data.error || "Failed to extract text from image.");
      }
    } catch (err) {
      setError("Failed to connect to the backend server. Is Django running?");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="badge">Django REST + React + Tesseract</div>
        <h1>Image-to-Text OCR</h1>
        <p className="subtitle">
          Upload any image to automatically scan, detect, and extract text instantly.
        </p>
      </header>

      {/* Main Grid Workspace */}
      <main className="main-content">
        {/* Left Column: Upload & Image Preview */}
        <section className="card upload-section">
          <h2>1. Select or Drop Image</h2>

          <div
            className={`dropzone ${isDragging ? "dragging" : ""} ${
              preview ? "has-preview" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="imageInput"
            />

            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Selected preview" className="image-preview" />
                <div className="preview-overlay">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="dropzone-prompt">
                <svg
                  className="upload-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="primary-text">
                  Drag & drop an image here, or <span>browse</span>
                </p>
                <p className="secondary-text">Supports JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            )}
          </div>

          {image && (
            <div className="file-info">
              <span className="file-name">{image.name}</span>
              <span className="file-size">
                {(image.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          )}

          <div className="action-row">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleUpload}
              disabled={loading || !image}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Processing OCR...
                </>
              ) : (
                "Extract Text"
              )}
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
        </section>

        {/* Right Column: Extracted Text Results */}
        <section className="card result-section">
          <div className="result-header">
            <h2>2. Extracted Text Result</h2>
            {text && (
              <div className="stats-badges">
                <span className="stat-badge">{wordCount} words</span>
                <span className="stat-badge">{charCount} chars</span>
              </div>
            )}
          </div>

          <div className="textarea-wrapper">
            <textarea
              className="text-output"
              value={text}
              readOnly
              placeholder="Extracted text will appear here after scanning..."
              rows="12"
            />
          </div>

          <div className="result-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCopy}
              disabled={!text}
            >
              {copied ? "✓ Copied!" : "📋 Copy Text"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setText("")}
              disabled={!text}
            >
              Clear Result
            </button>
          </div>
        </section>
      </main>

      {/* Footer / Architecture Summary */}
      <footer className="app-footer">
        <div className="flow-stepper">
          <span>React (FormData)</span> → <span>Django REST API</span> → <span>Pillow</span> → <span>Tesseract OCR</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
