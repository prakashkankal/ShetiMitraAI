import React, { useState } from "react";
import "./ScanPage.css";

export default function ScanPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=500&h=600&fit=crop");
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState(true);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(false);
    }
  };

  const detect = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      setResult(true);
    }, 1500);
  };

  return (
    <div className="scan-page">
      <aside className="scan-sidebar">
        <div className="logo">🌿 ShetiMitra AI<p>Smart AI for Healthy Crops</p></div>
        <nav>
          <div>🏠 Home</div>
          <div>🎤 Voice Assistant</div>
          <div className="active">🔍 Image Detection</div>
          <div>🌱 Disease Advisory</div>
          <div>☁️ Weather & Risk</div>
          <div>🕒 History</div>
          <div>⚙️ Settings</div>
        </nav>
        <div className="sb-bottom-img">Better information today, healthier crops tomorrow</div>
      </aside>

      <main className="scan-main">
        <div className="scan-banner">
          <div>
            <small>PLANT DISEASE DETECTION</small>
            <h2>Detect Disease from Leaf Image</h2>
            <p>Upload a leaf image and let AI identify the disease and provide expert guidance.</p>
          </div>
          <div className="banner-leaf"></div>
          <div className="ai-badge">🤖 AI Powered<br/><span>Accurate & Fast</span></div>
        </div>

        <div className="scan-grid">
          <div className="scan-card">
            <h4>🍃 Upload Leaf Image</h4>
            <p className="desc">Upload a clear image of the plant leaf for disease detection.</p>
            <div className="upload-box">
              <div className="cloud">☁️⬆️</div>
              <p>Drag & drop image here<br/>or</p>
              <label className="choose-btn">
                🖼️ Choose Image
                <input type="file" accept="image/*" onChange={handleFile} hidden />
              </label>
              <small>Supported formats: JPG, PNG, JPEG<br/>Max size: 5 MB</small>
            </div>
            <div className="or">OR</div>
            <button className="camera-btn">📷 Open Camera</button>
            <small className="cam-hint">Click to take a photo</small>
          </div>

          <div className="scan-card">
            <h4>🖼️ Image Preview</h4>
            <div className="preview-box">
              <img src={preview} alt="leaf" />
              <span className="close">✕</span>
            </div>
            <p className="file-name">leaf_disease.jpg<br/><small>(2.4 MB)</small></p>
            <button className="change-btn" onClick={()=>setImage(null)}>🔄 Change Image</button>
            <button className="detect-btn" onClick={detect}>{detecting ? "Detecting..." : "✨ Detect Disease"}</button>
          </div>

          <div className="scan-card result">
            <h4>🍃 Detection Result</h4>
            {result ? (
              <>
                <div className="result-top">
                  <img src={preview} alt="thumb" />
                  <div>
                    <small>Disease Detected</small>
                    <b>Early Blight</b>
                    <small><i>(Alternaria solani)</i></small>
                  </div>
                  <div className="conf"><small>Confidence</small><span>92%</span></div>
                </div>
                <div className="about">
                  <h5>ⓘ About the Disease</h5>
                  <p>Early blight is a fungal disease that affects tomato, potato and other crops. It appears as dark brown spots with concentric rings on older leaves, and can spread to stems and fruits if not managed.</p>
                </div>
                <div className="actions">
                  <h5>✅ Recommended Actions</h5>
                  <p>✓ Remove and destroy infected leaves.</p>
                  <p>✓ Use fungicide (e.g., Mancozeb or Chlorothalonil).</p>
                  <p>✓ Ensure proper spacing and air circulation.</p>
                  <p>✓ Avoid overhead watering.</p>
                </div>
                <div className="pro-tip">
                  <h5>💡 Pro Tip</h5>
                  <p>Early detection helps prevent the spread of disease and saves your crop yield.</p>
                </div>
              </>
            ) : (
              <div className="no-result">Upload image and click Detect Disease to see result</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

