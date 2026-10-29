import React, { useState } from "react";
import "./ScanPage.css";
import { useTranslation } from "../i18n.jsx";

export default function ScanPage() {
  const t = useTranslation();
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
        <div className="logo">🌿 ShetiMitra AI<p>{t("dashboardTagline")}</p></div>
        <nav>
          <div>🏠 {t("navHome")}</div>
          <div>🎤 {t("navAssistant")}</div>
          <div className="active">🔍 {t("navDetection")}</div>
          <div>🌱 {t("navAdvisory")}</div>
          <div>☁️ {t("navWeather")}</div>
          <div>🕒 {t("navHistory")}</div>
          <div>⚙️ {t("navSettings")}</div>
        </nav>
        <div className="sb-bottom-img">{t("sidebarQuote")}</div>
      </aside>

      <main className="scan-main">
        <div className="scan-banner">
          <div>
            <small>{t("scanEyebrow")}</small>
            <h2>{t("scanHeadline")}</h2>
            <p>{t("scanDescription")}</p>
          </div>
          <div className="banner-leaf"></div>
          <div className="ai-badge">🤖 {t("aiPowered")}<br/><span>{t("accurateFast")}</span></div>
        </div>

        <div className="scan-grid">
          <div className="scan-card">
            <h4>🍃 {t("uploadLeaf")}</h4>
            <p className="desc">{t("uploadDescription")}</p>
            <div className="upload-box">
              <div className="cloud">☁️⬆️</div>
              <p>{t("dragDrop")}<br/>{t("or")}</p>
              <label className="choose-btn">
                🖼️ {t("chooseImage")}
                <input type="file" accept="image/*" onChange={handleFile} hidden />
              </label>
              <small>{t("supportedFormats")}<br/>{t("maxSize")}</small>
            </div>
            <div className="or">{t("or")}</div>
            <button className="camera-btn">📷 {t("openCamera")}</button>
            <small className="cam-hint">{t("cameraHint")}</small>
          </div>

          <div className="scan-card">
            <h4>🖼️ {t("imagePreview")}</h4>
            <div className="preview-box">
              <img src={preview} alt={t("leafImageAlt")} />
              <span className="close">✕</span>
            </div>
            <p className="file-name">leaf_disease.jpg<br/><small>(2.4 MB)</small></p>
            <button className="change-btn" onClick={()=>setImage(null)}>🔄 {t("changeImage")}</button>
            <button className="detect-btn" onClick={detect}>{detecting ? t("detecting") : `✨ ${t("detectDisease")}`}</button>
          </div>

          <div className="scan-card result">
            <h4>🍃 {t("detectionResult")}</h4>
            {result ? (
              <>
                <div className="result-top">
                  <img src={preview} alt={t("leafThumbnailAlt")} />
                  <div>
                    <small>{t("diseaseDetected")}</small>
                    <b>Early Blight</b>
                    <small><i>(Alternaria solani)</i></small>
                  </div>
                  <div className="conf"><small>{t("confidence")}</small><span>92%</span></div>
                </div>
                <div className="about">
                  <h5>ⓘ {t("aboutDisease")}</h5>
                  <p>{t("diseaseDescription")}</p>
                </div>
                <div className="actions">
                  <h5>✅ {t("recommendedActions")}</h5>
                  <p>✓ {t("removeLeaves")}</p>
                  <p>✓ {t("applyFungicide")}</p>
                  <p>✓ {t("spacingAir")}</p>
                  <p>✓ {t("avoidWatering")}</p>
                </div>
                <div className="pro-tip">
                  <h5>💡 {t("proTip")}</h5>
                  <p>{t("proTipCopy")}</p>
                </div>
              </>
            ) : (
              <div className="no-result">{t("uploadToSeeResult")}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
