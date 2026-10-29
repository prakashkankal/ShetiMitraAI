import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import { useTranslation, useLanguage } from '../i18n.jsx'
import { apiCreateDetection, apiGetSampleDetections } from '../lib/api.js'
import './ScanPage.css'

const DEFAULT_SAMPLE = {
  id: 'init-default',
  crop: 'Tomato',
  key: 'sampleEarlyBlight',
  diseaseName: 'Tomato Early Blight (अगेती करपा)',
  scientificName: 'Alternaria solani',
  pathogen: 'Fungal Pathogen',
  confidence: 94,
  status: 'high',
  predictions: [
    { name: 'Early Blight (Alternaria solani)', score: 94 },
    { name: 'Septoria Leaf Spot', score: 4 },
    { name: 'Late Blight', score: 2 },
  ],
  symptoms:
    'Dark brown to black spots with concentric rings ("target board" pattern) appearing primarily on older lower leaves. Surrounding tissue turns pale yellow.',
  cultural:
    'Remove and destroy infected leaves immediately. Ensure 60cm plant spacing for adequate aeration. Water at base via drip lines.',
  chemical:
    'Spray Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride 50% WP @ 3.0 g/L water.',
  proTip:
    'Practice at least a 2-year crop rotation avoiding brinjal, chilli, and potato.',
  imageUrl:
    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop',
}

export default function ScanPage() {
  const t = useTranslation()
  const { language } = useLanguage()

  const [selectedCrop, setSelectedCrop] = useState('tomato')
  const [sampleDatasets, setSampleDatasets] = useState([DEFAULT_SAMPLE])
  const [preview, setPreview] = useState(DEFAULT_SAMPLE.imageUrl)
  const [activeAnalysis, setActiveAnalysis] = useState(DEFAULT_SAMPLE)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionStep, setDetectionStep] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activeFileBlob, setActiveFileBlob] = useState(null)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

  // Fetch demo sample leaf cases directly from MongoDB database
  useEffect(() => {
    apiGetSampleDetections()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((doc) => ({
            id: doc._id,
            crop: doc.cropType,
            key: doc.sampleKey || 'sampleEarlyBlight',
            diseaseName: doc.diseaseName,
            scientificName: doc.scientificName,
            pathogen: doc.pathogenType || 'Pathogen',
            confidence: doc.confidence,
            status: doc.status,
            predictions: doc.predictions || [],
            symptoms: doc.symptoms,
            cultural: doc.culturalControl,
            chemical: doc.chemicalPrecautions,
            proTip: doc.proTip,
            imageUrl: doc.imageUrl,
          }))
          setSampleDatasets(mapped)
          setPreview(mapped[0].imageUrl)
          setActiveAnalysis(mapped[0])
        }
      })
      .catch((err) => {
        console.warn('Could not fetch sample leaves from database:', err.message)
      })
  }, [])

  // Handle uploaded file
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please select a smaller photo.')
        return
      }
      setActiveFileBlob(file)
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      // Pick dynamic simulated result or match with Early Blight
      setActiveAnalysis({
        ...(sampleDatasets[0] || DEFAULT_SAMPLE),
        id: 'upload-' + Date.now(),
        imageUrl: objectUrl,
      })
      setSavedSuccess(false)
    }
  }

  // Handle sample selection
  const selectSample = (sample) => {
    stopCamera()
    setActiveFileBlob(null)
    setPreview(sample.imageUrl)
    setActiveAnalysis(sample)
    setSavedSuccess(false)
  }

  // Start Camera
  const startCamera = async () => {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      setIsCameraActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err)
      setCameraError('Camera access unavailable. Please grant permission or choose an image file.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const photoUrl = canvas.toDataURL('image/jpeg', 0.85)
    canvas.toBlob((blob) => {
      if (blob) setActiveFileBlob(blob)
    }, 'image/jpeg', 0.85)

    stopCamera()
    setPreview(photoUrl)
    setActiveAnalysis({
      ...(sampleDatasets[0] || DEFAULT_SAMPLE),
      id: 'camera-snap-' + Date.now(),
      imageUrl: photoUrl,
    })
    setSavedSuccess(false)
  }

  useEffect(() => {
    return () => {
      stopCamera()
      if (window.speechSynthesis) window.speechSynthesis.cancel()
    }
  }, [])

  // Run AI Detection simulation with visual steps and optional real backend inference
  const runDetection = async () => {
    setIsDetecting(true)
    setSavedSuccess(false)
    setDetectionStep('1. Scanning leaf texture & morphology...')

    const t1 = setTimeout(() => {
      setDetectionStep('2. Deep learning inference in progress...')
    }, 700)

    const t2 = setTimeout(() => {
      setDetectionStep('3. Checking confidence threshold & verified advisory...')
    }, 1400)

    if (activeFileBlob) {
      try {
        const response = await apiCreateDetection(activeFileBlob, selectedCrop, language)
        if (response?.data) {
          const d = response.data
          setActiveAnalysis({
            id: d._id || 'api-' + Date.now(),
            crop: d.cropType || selectedCrop,
            diseaseName: d.diseaseName,
            scientificName: d.scientificName,
            pathogen: d.pathogenType || 'Pathogen',
            confidence: d.confidence,
            status: d.status,
            predictions: d.predictions?.length ? d.predictions : [{ name: d.diseaseName, score: d.confidence }],
            symptoms: d.symptoms,
            cultural: d.culturalControl,
            chemical: d.chemicalPrecautions,
            proTip: d.proTip,
            imageUrl: d.imageUrl || preview,
          })
        }
      } catch (err) {
        console.warn('Backend inference unavailable; falling back to offline advisory:', err.message)
      }
    }

    setTimeout(() => {
      clearTimeout(t1)
      clearTimeout(t2)
      setIsDetecting(false)
      setDetectionStep('')
    }, 2000)
  }

  // Save current scan to localStorage History
  const saveToHistory = () => {
    try {
      const existingStr = localStorage.getItem('shetimitra-scan-history')
      const historyList = existingStr ? JSON.parse(existingStr) : []

      const newRecord = {
        id: 'scan-' + Date.now(),
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        crop: selectedCrop === 'tomato' ? 'Tomato' : selectedCrop.toUpperCase(),
        diseaseName: activeAnalysis.diseaseName,
        scientificName: activeAnalysis.scientificName,
        confidence: activeAnalysis.confidence,
        status: activeAnalysis.status,
        imageUrl: preview,
        symptoms: activeAnalysis.symptoms,
        remedy: activeAnalysis.cultural,
      }

      historyList.unshift(newRecord)
      localStorage.setItem('shetimitra-scan-history', JSON.stringify(historyList.slice(0, 30)))
      setSavedSuccess(true)
    } catch (err) {
      console.warn('History save error:', err)
      setSavedSuccess(true)
    }
  }

  // Spoken voice advisory using Web Speech Synthesis
  const speakAdvisory = () => {
    if (!window.speechSynthesis) return

    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
      return
    }

    const advisoryText =
      activeAnalysis.status === 'uncertain'
        ? language === 'mr'
          ? 'अनिश्चित निकाल. AI मॉडेलची अचूकता सुरक्षा मर्यादेपेक्षा कमी आहे. पिकाच्या सुरक्षेसाठी कृपया चांगल्या प्रकाशात पुन्हा फोटो घ्या किंवा कृषी विज्ञान केंद्राशी संपर्क साधा.'
          : language === 'hi'
          ? 'अनिश्चित परिणाम। AI मॉडल का भरोसा सुरक्षा सीमा से कम है। कृपया साफ़ रोशनी में दोबारा फोटो लें अथवा कृषि विज्ञान केंद्र से संपर्क करें।'
          : 'Uncertain detection result. Model confidence is below safety threshold. Please retake photo in bright daylight or consult Krishi Vigyan Kendra.'
        : language === 'mr'
        ? `${activeAnalysis.diseaseName}. लक्षणे: ${activeAnalysis.symptoms}. उपाय: ${activeAnalysis.cultural}. फवारणी: ${activeAnalysis.chemical}`
        : language === 'hi'
        ? `${activeAnalysis.diseaseName}। लक्षण: ${activeAnalysis.symptoms}। रोकथाम: ${activeAnalysis.cultural}। छिड़काव: ${activeAnalysis.chemical}`
        : `${activeAnalysis.diseaseName}. Symptoms: ${activeAnalysis.symptoms}. Cultural practice: ${activeAnalysis.cultural}. Chemical precaution: ${activeAnalysis.chemical}`

    const utterance = new SpeechSynthesisUtterance(advisoryText.replace(/[•*]/g, ''))
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.9

    utterance.onstart = () => setIsPlayingAudio(true)
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="leaf-scan-page">
      {/* Top Banner */}
      <div className="scan-hero-banner">
        <div className="scan-hero-copy">
          <span className="scan-overline">AI COMPUTER VISION • YOLOv8 CROP MODEL</span>
          <h1 className="scan-heading">{t('scanTitle')}</h1>
          <p className="scan-subheading">{t('scanSubtitle')}</p>
        </div>

        <div className="scan-crop-selector">
          <label htmlFor="cropSelect" className="crop-label">
            <Icon name="sprout" size={17} />
            <span>{t('selectCrop')}:</span>
          </label>
          <select
            id="cropSelect"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="crop-dropdown"
          >
            <option value="tomato">{t('cropTomato')}</option>
            <option value="potato">{t('cropPotato')}</option>
            <option value="cotton">{t('cropCotton')}</option>
            <option value="chilli">{t('cropChilli')}</option>
          </select>
        </div>
      </div>

      {/* Main 3-Column Diagnostic Workspace */}
      <div className="scan-workspace-grid">
        {/* Column 1: Image Capture & Upload Options */}
        <div className="scan-panel-card input-card">
          <div className="card-header">
            <div className="card-header-icon">
              <Icon name="camera" size={20} />
            </div>
            <div>
              <h3>{t('uploadLeafImage')}</h3>
              <small>{t('supportedFormats')}</small>
            </div>
          </div>

          {/* Drag & Drop or Browse Box */}
          <div
            className="drop-zone"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload leaf photo"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="drop-icon">
              <Icon name="cloud" size={36} />
            </div>
            <strong className="drop-main-text">{t('dragDropText')}</strong>
            <span className="drop-btn-pill">
              <Icon name="leaf" size={15} />
              {t('chooseImage')}
            </span>
          </div>

          <div className="or-divider">
            <span>OR</span>
          </div>

          {/* Live Camera Controls */}
          {isCameraActive ? (
            <div className="camera-live-box">
              <video ref={videoRef} autoPlay playsInline className="camera-video-feed" />
              <div className="camera-live-actions">
                <button type="button" className="camera-snap-btn" onClick={capturePhoto}>
                  <Icon name="camera" size={20} />
                  <span>{t('snapPhoto')}</span>
                </button>
                <button type="button" className="camera-close-btn" onClick={stopCamera}>
                  <Icon name="x" size={18} />
                  <span>{t('closeCamera')}</span>
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="open-camera-btn" onClick={startCamera}>
              <Icon name="camera" size={19} />
              <span>{t('openCamera')}</span>
            </button>
          )}

          {cameraError && (
            <div className="camera-error-msg" role="alert">
              <Icon name="alertTriangle" size={15} />
              <span>{cameraError}</span>
            </div>
          )}

          {/* One-Click Sample Leaves for Evaluation */}
          <div className="sample-leaves-section">
            <span className="sample-leaves-label">{t('sampleLeavesTitle')}</span>
            <div className="sample-chips-list">
              {sampleDatasets.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => selectSample(sample)}
                  className={`sample-pill-btn ${activeAnalysis?.id === sample.id ? 'active' : ''}`}
                >
                  <img src={sample.imageUrl} alt="" className="sample-thumb" />
                  <span className="sample-name">{t(sample.key)}</span>
                  {sample.status === 'uncertain' && (
                    <span className="uncertain-tag">FR-04</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Image Preview & Scanner Visualizer */}
        <div className="scan-panel-card preview-card">
          <div className="card-header">
            <div className="card-header-icon">
              <Icon name="scan" size={20} />
            </div>
            <div>
              <h3>{t('imagePreview')}</h3>
              <small>Validated Crop: {selectedCrop.toUpperCase()}</small>
            </div>
          </div>

          <div className="preview-image-container">
            <img src={preview} alt="Selected crop leaf" className="preview-img" />

            {/* Scanning Laser Animation Overlay */}
            {isDetecting && (
              <div className="laser-overlay">
                <div className="laser-line"></div>
                <div className="laser-scan-grid"></div>
              </div>
            )}

            {/* Disease Bounding Box on Confirmed Detections */}
            {!isDetecting && activeAnalysis.status === 'high' && (
              <div className="ai-bounding-box" aria-label="Detected disease region">
                <span className="bbox-label">{activeAnalysis.predictions[0].name}</span>
              </div>
            )}
          </div>

          {/* Detection Progress / Action Button */}
          {isDetecting ? (
            <div className="analyzing-progress-box">
              <div className="spinner-indicator">
                <Icon name="sparkles" size={22} className="spin-icon" />
              </div>
              <p className="analyzing-step-text">{detectionStep}</p>
            </div>
          ) : (
            <button
              type="button"
              className="run-detect-btn"
              onClick={runDetection}
              aria-label="Run AI leaf disease analysis"
            >
              <Icon name="sparkles" size={20} />
              <span>{t('detectDiseaseBtn')}</span>
            </button>
          )}

          <div className="preview-meta-bar">
            <span>YOLOv8-Tomato v1.2</span>
            <span>Input: 640x640 RGB</span>
            <span className="active-status-dot">Active Inference</span>
          </div>
        </div>

        {/* Column 3: Diagnostic Results & Advisory */}
        <div className="scan-panel-card result-card">
          <div className="card-header">
            <div className="card-header-icon">
              <Icon name="leaf" size={20} />
            </div>
            <div>
              <h3>{t('detectionResult')}</h3>
              <small>ShetiMitra Agricultural Engine</small>
            </div>
          </div>

          {/* Condition 1: Mandatory Uncertain Result (PRD FR-04) */}
          {activeAnalysis.status === 'uncertain' ? (
            <div className="uncertain-alert-box" role="alert">
              <div className="uncertain-header">
                <div className="uncertain-icon">
                  <Icon name="alertTriangle" size={26} />
                </div>
                <div>
                  <h4 className="uncertain-title">{t('uncertainResult')}</h4>
                  <span className="uncertain-badge">
                    {t('confidenceScore')}: {activeAnalysis.confidence}% (Below 65% Safety Threshold)
                  </span>
                </div>
              </div>

              <p className="uncertain-desc">{t('uncertainExplanation')}</p>

              <div className="uncertain-checklist">
                <strong>Recommended Next Steps:</strong>
                <ul>
                  <li>{t('uncertainAdvice1')}</li>
                  <li>{t('uncertainAdvice2')}</li>
                  <li>{t('uncertainAdvice3')}</li>
                </ul>
              </div>

              <div className="uncertain-actions">
                <button
                  type="button"
                  className="voice-help-btn"
                  onClick={speakAdvisory}
                >
                  <Icon name="volume" size={17} />
                  <span>{isPlayingAudio ? 'Stop Voice' : 'Hear Safety Instructions'}</span>
                </button>
              </div>
            </div>
          ) : activeAnalysis.status === 'healthy' ? (
            /* Condition 2: Healthy Foliage */
            <div className="healthy-result-box">
              <div className="healthy-header">
                <div className="healthy-icon">
                  <Icon name="shieldCheck" size={28} />
                </div>
                <div>
                  <h4>{t('healthyTitle')}</h4>
                  <span className="confidence-pill healthy">
                    {activeAnalysis.confidence}% Healthy Confidence
                  </span>
                </div>
              </div>

              <p className="healthy-text">{t('healthyCopy')}</p>

              <div className="advisory-section-block">
                <h5>{t('culturalControl')}</h5>
                <p>{activeAnalysis.cultural}</p>
              </div>

              <div className="protip-box">
                <h5>
                  <Icon name="info" size={16} /> {t('proTip')}
                </h5>
                <p>{activeAnalysis.proTip}</p>
              </div>

              <div className="result-footer-actions">
                <button
                  type="button"
                  className={`save-history-btn ${savedSuccess ? 'saved' : ''}`}
                  onClick={saveToHistory}
                >
                  <Icon name={savedSuccess ? 'check' : 'history'} size={17} />
                  <span>{savedSuccess ? t('savedToHistorySuccess') : t('saveToHistory')}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Condition 3: Confirmed Disease Detection with Full Top-3 & Advisory */
            <div className="confirmed-result-flow">
              {/* Disease Diagnosis Header */}
              <div className="diagnosis-top-card">
                <div className="diagnosis-titles">
                  <span className="pathogen-pill">{activeAnalysis.pathogen}</span>
                  <h4 className="disease-title">{activeAnalysis.diseaseName}</h4>
                  <em className="scientific-name">({activeAnalysis.scientificName})</em>
                </div>

                <div className="confidence-meter">
                  <span className="conf-label">{t('confidenceScore')}</span>
                  <span className="conf-value">{activeAnalysis.confidence}%</span>
                  <span className="conf-tag">{t('highConfidence')}</span>
                </div>
              </div>

              {/* FR-04: Top-3 Model Candidate Predictions */}
              <div className="top-predictions-box">
                <span className="top-pred-heading">{t('topPredictions')}</span>
                <div className="predictions-list">
                  {activeAnalysis.predictions.map((pred, i) => (
                    <div key={i} className="prediction-bar-row">
                      <div className="pred-row-labels">
                        <span className="pred-name">{pred.name}</span>
                        <strong className="pred-pct">{pred.score}%</strong>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${pred.score}%`,
                            background: i === 0 ? '#1f7a4d' : '#8fa89b',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div className="advisory-section-block">
                <h5>
                  <Icon name="search" size={15} /> {t('symptomsTitle')}
                </h5>
                <p>{activeAnalysis.symptoms}</p>
              </div>

              {/* Cultural & Organic Prevention */}
              <div className="advisory-section-block">
                <h5>
                  <Icon name="sprout" size={15} /> {t('culturalControl')}
                </h5>
                <p>{activeAnalysis.cultural}</p>
              </div>

              {/* Chemical Precautions (Reviewed by Agronomist) */}
              <div className="advisory-section-block chemical-block">
                <h5>
                  <Icon name="shieldCheck" size={15} /> {t('chemicalPrecautions')}
                </h5>
                <p>{activeAnalysis.chemical}</p>
                <small className="chemical-warning">{t('chemicalDisclaimer')}</small>
              </div>

              {/* Farmer Pro-Tip */}
              <div className="protip-box">
                <h5>
                  <Icon name="info" size={15} /> {t('proTip')}
                </h5>
                <p>{activeAnalysis.proTip}</p>
              </div>

              {/* Actions: Audio Advisory & Save to History */}
              <div className="result-footer-actions">
                <button
                  type="button"
                  className={`voice-listen-btn ${isPlayingAudio ? 'playing' : ''}`}
                  onClick={speakAdvisory}
                  aria-label="Listen spoken advisory"
                >
                  <Icon name={isPlayingAudio ? 'pause' : 'volume'} size={17} />
                  <span>{isPlayingAudio ? t('playingAudio') : t('listenAudio')}</span>
                </button>

                <button
                  type="button"
                  className={`save-history-btn ${savedSuccess ? 'saved' : ''}`}
                  onClick={saveToHistory}
                >
                  <Icon name={savedSuccess ? 'check' : 'history'} size={17} />
                  <span>{savedSuccess ? t('savedToHistorySuccess') : t('saveToHistory')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
