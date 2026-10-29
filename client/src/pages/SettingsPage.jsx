import { useState, useEffect } from 'react'
import { Icon } from '../components/Icons.jsx'
import { useTranslation, useLanguage } from '../i18n.jsx'
import './SettingsPage.css'

export default function SettingsPage() {
  const t = useTranslation()
  const { language, setLanguage } = useLanguage()

  // Settings states backed by localStorage
  const [speechRate, setSpeechRate] = useState(() => {
    return localStorage.getItem('shetimitra-speech-rate') || 'normal'
  })

  const [autoPlayVoice, setAutoPlayVoice] = useState(() => {
    return localStorage.getItem('shetimitra-autoplay-voice') === 'true'
  })

  const [district, setDistrict] = useState(() => {
    return localStorage.getItem('shetimitra-district') || 'Pune'
  })

  const [gpsEnabled, setGpsEnabled] = useState(() => {
    return localStorage.getItem('shetimitra-gps-enabled') !== 'false'
  })

  const [selectedCrops, setSelectedCrops] = useState(() => {
    try {
      const saved = localStorage.getItem('shetimitra-crops')
      return saved ? JSON.parse(saved) : ['Tomato', 'Cotton']
    } catch {
      return ['Tomato', 'Cotton']
    }
  })

  const [farmAcres, setFarmAcres] = useState(() => {
    return localStorage.getItem('shetimitra-farm-acres') || '4.5'
  })

  const [irrigation, setIrrigation] = useState(() => {
    return localStorage.getItem('shetimitra-irrigation') || 'drip'
  })

  const [toastMsg, setToastMsg] = useState('')
  const [storedScansCount, setStoredScansCount] = useState(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shetimitra-scan-history')
      if (stored) {
        const list = JSON.parse(stored)
        setStoredScansCount(list.length)
      }
    } catch {
      /* Safe catch */
    }
  }, [])

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    showToast(`Language set to ${newLang === 'mr' ? 'मराठी' : newLang === 'hi' ? 'हिन्दी' : 'English'}`)
  }

  const toggleCrop = (cropName) => {
    if (selectedCrops.includes(cropName)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter((c) => c !== cropName))
      }
    } else {
      setSelectedCrops([...selectedCrops, cropName])
    }
  }

  const saveAllSettings = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem('shetimitra-speech-rate', speechRate)
      localStorage.setItem('shetimitra-autoplay-voice', String(autoPlayVoice))
      localStorage.setItem('shetimitra-district', district)
      localStorage.setItem('shetimitra-gps-enabled', String(gpsEnabled))
      localStorage.setItem('shetimitra-crops', JSON.stringify(selectedCrops))
      localStorage.setItem('shetimitra-farm-acres', farmAcres)
      localStorage.setItem('shetimitra-irrigation', irrigation)
      showToast(t('savedSettingsSuccess'))
    } catch {
      showToast('Settings saved locally!')
    }
  }

  const resetCacheAndData = () => {
    try {
      localStorage.removeItem('shetimitra-scan-history')
      setStoredScansCount(0)
      showToast(t('clearCacheSuccess'))
    } catch {
      /* Safe catch */
    }
  }

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const availableCrops = [
    { id: 'Tomato', label: 'Tomato (टोमॅटो)' },
    { id: 'Cotton', label: 'Cotton (कापूस)' },
    { id: 'Potato', label: 'Potato (बटाटा)' },
    { id: 'Chilli', label: 'Chilli (मिरची)' },
    { id: 'Soybean', label: 'Soybean (सोयाबीन)' },
    { id: 'Onion', label: 'Onion (कांदा)' },
  ]

  const districtsMaharashtra = [
    'Pune',
    'Nashik',
    'Kolhapur',
    'Solapur',
    'Ahmednagar',
    'Satara',
    'Sangli',
    'Aurangabad (Chhatrapati Sambhajinagar)',
    'Jalgaon',
    'Amravati',
    'Nagpur',
    'Nanded',
  ]

  return (
    <div className="settings-page">
      {/* Header Banner */}
      <div className="settings-header-banner">
        <div className="settings-banner-text">
          <span className="settings-overline">FARM PREFERENCES & SYSTEM CONFIGURATION</span>
          <h1 className="settings-title">{t('settingsTitle')}</h1>
          <p className="settings-subtitle">{t('settingsSubtitle')}</p>
        </div>

        <button type="button" className="save-top-btn" onClick={saveAllSettings}>
          <Icon name="check" size={17} />
          <span>{t('saveSettings')}</span>
        </button>
      </div>

      <form onSubmit={saveAllSettings} className="settings-form-layout">
        {/* Section 1: Application Language */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="card-icon">
              <Icon name="globe" size={20} />
            </div>
            <div>
              <h3>{t('languageSection')}</h3>
              <small>{t('languageDesc')}</small>
            </div>
          </div>

          <div className="lang-tiles-grid">
            <button
              type="button"
              className={`lang-tile ${language === 'mr' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('mr')}
            >
              <span className="lang-native">मराठी</span>
              <span className="lang-sub">Marathi • प्रादेशिक भाषा</span>
              {language === 'mr' && <span className="active-check">✓ Active</span>}
            </button>

            <button
              type="button"
              className={`lang-tile ${language === 'hi' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('hi')}
            >
              <span className="lang-native">हिन्दी</span>
              <span className="lang-sub">Hindi • राष्ट्रभाषा</span>
              {language === 'hi' && <span className="active-check">✓ Active</span>}
            </button>

            <button
              type="button"
              className={`lang-tile ${language === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              <span className="lang-native">English</span>
              <span className="lang-sub">English • Standard UI</span>
              {language === 'en' && <span className="active-check">✓ Active</span>}
            </button>
          </div>
        </section>

        {/* Section 2: Voice & Audio Guidance */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="card-icon">
              <Icon name="volume" size={20} />
            </div>
            <div>
              <h3>{t('voiceSection')}</h3>
              <small>Web Speech Synthesis & Voice Assistant configuration</small>
            </div>
          </div>

          <div className="settings-fields-group">
            <div className="field-row">
              <label htmlFor="speechRateSelect" className="field-label">
                {t('speechRate')}
              </label>
              <select
                id="speechRateSelect"
                value={speechRate}
                onChange={(e) => setSpeechRate(e.target.value)}
                className="select-control"
              >
                <option value="slow">{t('speechRateSlow')}</option>
                <option value="normal">{t('speechRateNormal')}</option>
                <option value="fast">{t('speechRateFast')}</option>
              </select>
            </div>

            <div className="toggle-row">
              <div>
                <strong>{t('autoPlayVoice')}</strong>
                <p>Read out the agricultural advisory automatically when scan finishes.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoPlayVoice}
                  onChange={(e) => setAutoPlayVoice(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Section 3: Farm & Crop Profile */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="card-icon">
              <Icon name="sprout" size={20} />
            </div>
            <div>
              <h3>{t('farmProfileSection')}</h3>
              <small>Helps customize weather risks and relevant disease alerts</small>
            </div>
          </div>

          <div className="settings-fields-group">
            <div className="form-two-cols">
              <div className="field-row">
                <label htmlFor="districtSelect" className="field-label">
                  {t('districtLabel')}
                </label>
                <select
                  id="districtSelect"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="select-control"
                >
                  {districtsMaharashtra.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-row">
                <label htmlFor="acresInput" className="field-label">
                  {t('farmSize')}
                </label>
                <input
                  type="number"
                  id="acresInput"
                  value={farmAcres}
                  step="0.5"
                  min="0.5"
                  max="100"
                  onChange={(e) => setFarmAcres(e.target.value)}
                  className="input-control"
                />
              </div>
            </div>

            <div className="field-row">
              <label className="field-label">{t('primaryCrops')}</label>
              <div className="crops-chips-selector">
                {availableCrops.map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => toggleCrop(crop.id)}
                    className={`crop-chip-btn ${selectedCrops.includes(crop.id) ? 'selected' : ''}`}
                  >
                    <Icon
                      name={selectedCrops.includes(crop.id) ? 'check' : 'sprout'}
                      size={15}
                    />
                    <span>{crop.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <label htmlFor="irrigationSelect" className="field-label">
                {t('irrigationType')}
              </label>
              <select
                id="irrigationSelect"
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value)}
                className="select-control"
              >
                <option value="drip">{t('drip')}</option>
                <option value="sprinkler">{t('sprinkler')}</option>
                <option value="flood">{t('flood')}</option>
                <option value="rainfed">{t('rainfed')}</option>
              </select>
            </div>

            <div className="toggle-row">
              <div>
                <strong>{t('gpsAutoDetect')}</strong>
                <p>Fetch real-time microclimate humidity and precipitation for disease forecasts.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={gpsEnabled}
                  onChange={(e) => setGpsEnabled(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Section 4: Data & Local Storage */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="card-icon">
              <Icon name="shieldCheck" size={20} />
            </div>
            <div>
              <h3>{t('dataPrivacySection')}</h3>
              <small>Local client storage and offline compliance</small>
            </div>
          </div>

          <div className="settings-fields-group">
            <div className="storage-status-row">
              <div>
                <strong>{t('localStorageUsage')}</strong>
                <p>{storedScansCount} scan records currently cached on this device.</p>
              </div>
              <button
                type="button"
                className="btn-clear-cache"
                onClick={resetCacheAndData}
              >
                <Icon name="refresh" size={15} />
                <span>{t('clearCacheBtn')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 5: System About & Helpline */}
        <section className="settings-card about-card">
          <div className="settings-card-header">
            <div className="card-icon">
              <Icon name="info" size={20} />
            </div>
            <div>
              <h3>{t('aboutSystemSection')}</h3>
              <small>Platform specifications & Agricultural extension support</small>
            </div>
          </div>

          <div className="about-details-grid">
            <div className="about-spec-item">
              <span className="spec-label">{t('systemVersion')}</span>
              <strong>ShetiMitra AI v1.0.0 (Responsive Web)</strong>
            </div>

            <div className="about-spec-item">
              <span className="spec-label">Machine Learning Architecture</span>
              <strong>YOLOv8-Tomato (Foliar) + Whisper (STT) + gTTS (TTS)</strong>
            </div>

            <div className="about-spec-item">
              <span className="spec-label">Primary Target Crops</span>
              <strong>Solanum lycopersicum (Tomato) & Gossypium (Cotton)</strong>
            </div>

            <div className="about-spec-item">
              <span className="spec-label">Official Agronomic Helpline</span>
              <strong>Kisan Call Center: 1800-180-1551 (Toll-Free)</strong>
            </div>
          </div>

          <div className="disclaimer-callout">
            <Icon name="shieldCheck" size={17} className="shield-icon" />
            <p>
              <strong>Agricultural Notice:</strong> ShetiMitra AI is an educational diagnostic and
              advisory companion. It does not replace a certified agricultural officer. Always verify
              pesticide dosages with your local Krishi Vigyan Kendra before spraying.
            </p>
          </div>
        </section>

        {/* Bottom Save Action */}
        <div className="settings-bottom-actions">
          <button type="submit" className="save-main-btn">
            <Icon name="check" size={18} />
            <span>{t('saveSettings')}</span>
          </button>
        </div>
      </form>

      {/* Floating Toast */}
      {toastMsg && (
        <div className="floating-toast" role="status">
          <Icon name="check" size={16} />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  )
}

