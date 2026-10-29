import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import { useTranslation, useLanguage } from '../i18n.jsx'
import { apiGetWeather } from '../lib/api.js'
import './Dashboard.css'

const DEFAULT_WEATHER = {
  location: 'Pune, Maharashtra',
  temperature: 28,
  feelsLike: 31,
  humidity: 78,
  windSpeed: 8,
  rainfall: 0,
  condition: 'Partly Cloudy',
  diseaseRisk: {
    level: 'Moderate',
    disease: 'Early Blight',
    severity: 'Medium',
    percentage: 68,
  },
}

export default function Dashboard() {
  const t = useTranslation()
  const { language } = useLanguage()

  const [weatherData, setWeatherData] = useState(DEFAULT_WEATHER)
  const [weatherLoading, setWeatherLoading] = useState(false)

  // Fetch live weather from backend API
  useEffect(() => {
    const savedDistrict = localStorage.getItem('shetimitra-district') || 'Pune'
    setWeatherLoading(true)

    apiGetWeather(savedDistrict)
      .then((res) => {
        if (res?.data && res.data.available !== false) {
          setWeatherData(res.data)
        }
      })
      .catch((err) => {
        console.warn('Weather service offline, using regional defaults:', err.message)
      })
      .finally(() => {
        setWeatherLoading(false)
      })
  }, [])

  const risk = weatherData.diseaseRisk || DEFAULT_WEATHER.diseaseRisk

  // Translations for mobile labels
  const labels = {
    greeting:
      language === 'mr'
        ? 'शेतकरी मित्रा, स्वागत आहे!'
        : language === 'hi'
        ? 'किसान साथी, आपका स्वागत है!'
        : 'Welcome, Farmer!',
    greetingSub:
      language === 'mr'
        ? 'तुमचा विश्वासू AI शेती सल्लागार'
        : language === 'hi'
        ? 'आपका विश्वसनीय AI कृषि सलाहकार'
        : 'Your trusted AI crop health companion',
    checkCropTitle:
      language === 'mr' ? 'पीक रोग तपासणी' : language === 'hi' ? 'फसल रोग जांच' : 'Check Your Crop',
    checkCropDesc:
      language === 'mr'
        ? 'पानाचा फोटो काढून रोगांची अचूक तपासणी व उपाय जाणून घ्या.'
        : language === 'hi'
        ? 'पत्ती की तस्वीर लें और संभावित रोगों की जांच व उपचार जानें।'
        : 'Take a photo of a leaf to check for possible crop problems.',
    takePhoto: language === 'mr' ? 'फोटो काढा' : language === 'hi' ? 'फोटो लें' : 'Take a Photo',
    chooseGallery:
      language === 'mr' ? 'गॅलरीमधून निवडा' : language === 'hi' ? 'गैलरी से चुनें' : 'Choose from Gallery',
    askAiTitle:
      language === 'mr' ? 'शेतीविषयक प्रश्न विचारा' : language === 'hi' ? 'खेती के सवाल पूछें' : 'Ask Your Farming Question',
    askAiSub:
      language === 'mr'
        ? 'मराठी, हिंदी किंवा इंग्रजीत बोला किंवा टाइप करा.'
        : language === 'hi'
        ? 'मराठी, हिन्दी या अंग्रेजी में बोलें या लिखें।'
        : 'Ask questions about your crops in Marathi, Hindi, or English.',
    startSpeaking:
      language === 'mr' ? 'बोलायला सुरुवात करा' : language === 'hi' ? 'बोलना शुरू करें' : 'Start Speaking',
    typeQuestion:
      language === 'mr' ? 'प्रश्न टाइप करा' : language === 'hi' ? 'सवाल लिखें' : 'Type a Question',
    viewWeatherDetails:
      language === 'mr' ? 'हवामान तपशील पाहा' : language === 'hi' ? 'मौसम विवरण देखें' : 'View Weather Details',
    howToCheck:
      language === 'mr' ? 'पिकाची तपासणी कशी करावी?' : language === 'hi' ? 'फसल की जांच कैसे करें?' : 'How to Check My Crop',
    tipsHeading:
      language === 'mr' ? 'महत्त्वाचे शेती सल्ले' : language === 'hi' ? 'जरूरी कृषि सलाह' : 'Field Health Tips',
    viewAllTips:
      language === 'mr' ? 'सर्व सल्ले पाहा →' : language === 'hi' ? 'सभी सलाह देखें →' : 'View All Guidance →',
    historyTitle:
      language === 'mr' ? 'मागील तपासणी इतिहास' : language === 'hi' ? 'पिछला जांच इतिहास' : 'Scan History',
    historyDesc:
      language === 'mr'
        ? 'तुमचे मागील पानांचे रोग निदान व फवारणी अहवाल तपासा.'
        : language === 'hi'
        ? 'अपनी पिछली पत्ती जांच रिपोर्ट और छिड़काव सलाह देखें।'
        : 'View your previous leaf diagnoses and advisory reports.',
    viewAllHistory:
      language === 'mr' ? 'इतिहास उघडा →' : language === 'hi' ? 'इतिहास देखें →' : 'View All Scans →',
  }

  // Exactly two compact field tips for the home screen
  const tips = [
    {
      id: 'tip-1',
      title:
        language === 'mr'
          ? 'टोमॅटोवरील काळे/तपकिरी डाग'
          : language === 'hi'
          ? 'टमाटर पत्तियों पर भूरे धब्बे'
          : 'Brown Spots on Tomato Leaves',
      desc:
        language === 'mr'
          ? 'खालच्या पानांवर गोल रिंग डाग दिसल्यास तातडीने मँकोझेब फवारा.'
          : language === 'hi'
          ? 'निचली पत्तियों पर संकेंद्रित छल्लों की जांच करें और फफूंदनाशक दें।'
          : 'Check lower foliage for dark concentric target spots and yellowing.',
      image: 'photo-1592841200221-a6898f307baa',
    },
    {
      id: 'tip-2',
      title:
        language === 'mr'
          ? 'कापूस गुलाबी बोंडअळी पूर्वसूचना'
          : language === 'hi'
          ? 'कपास गुलाबी सुंडी अलर्ट'
          : 'Cotton Pink Bollworm Alert',
      desc:
        language === 'mr'
          ? 'लहान बोंडांवर बारीक छिद्रे तपासा व एकरी ५ फेरोमोन सापळे लावा.'
          : language === 'hi'
          ? 'छोटे गोल बोंडों पर छेद जांचें व प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं।'
          : 'Inspect young green bolls for tiny entry holes and install traps.',
      image: 'photo-1595872018818-97555653a011',
    },
  ]

  return (
    <div className="dash-mobile-container">
      {/* 1. SHORT WELCOME HEADER */}
      <section className="dash-welcome-strip">
        <div className="dash-welcome-text">
          <h1>{labels.greeting}</h1>
          <p>{labels.greetingSub}</p>
        </div>
        <div className="dash-welcome-pill">
          <span className="live-dot" aria-hidden="true" />
          <span>AI Active</span>
        </div>
      </section>

      {/* DESKTOP 2-COLUMN / MOBILE SINGLE-STREAM WRAPPER */}
      <div className="dash-stream-layout">
        {/* PRIMARY STREAM (Left on Desktop, Top on Mobile) */}
        <div className="dash-primary-stream">
          {/* 2. PROMINENT "CHECK YOUR CROP" PRIMARY ACTION CARD */}
          <section className="crop-check-card" aria-label="Crop disease detection">
            <div className="ccc-header">
              <div className="ccc-icon-badge">
                <Icon name="camera" size={24} />
              </div>
              <div className="ccc-title-wrap">
                <span className="ccc-overline">PRIMARY TOOL</span>
                <h2>{labels.checkCropTitle}</h2>
              </div>
            </div>

            <p className="ccc-description">{labels.checkCropDesc}</p>

            <div className="ccc-actions-row">
              <Link to="/scan" className="ccc-btn primary">
                <Icon name="camera" size={19} />
                <span>{labels.takePhoto}</span>
              </Link>

              <Link to="/scan" className="ccc-btn secondary">
                <Icon name="leaf" size={18} />
                <span>{labels.chooseGallery}</span>
              </Link>
            </div>
          </section>

          {/* 3. SIMPLIFIED CROP DISEASE RISK ALERT (FARMER-FRIENDLY LANGUAGE) */}
          {risk && risk.level !== 'Low' && (
            <section className="crop-alert-box" role="alert" aria-label="Crop risk warning">
              <div className="cab-icon-wrap">
                <span className="cab-alert-badge">!</span>
              </div>
              <div className="cab-content">
                <div className="cab-badge-row">
                  <span className="cab-risk-level">{risk.level} Risk</span>
                  <span className="cab-crop-tag">Tomato & Foliar Crops</span>
                </div>
                <h3 className="cab-title">
                  {language === 'mr'
                    ? 'करपा रोगाची शक्यता'
                    : language === 'hi'
                    ? 'झुलसा रोग की संभावना'
                    : 'Possible Risk: Early Blight'}
                </h3>
                <p className="cab-description">
                  {language === 'mr'
                    ? 'हवेतील अधिक आर्द्रतेमुळे पानावरील करपा वाढू शकतो. खालची पाने तपासा.'
                    : language === 'hi'
                    ? 'अधिक नमी के कारण पत्तियों पर धब्बे बढ़ सकते हैं। निचली पत्तियां जांचें।'
                    : 'Check your tomato leaves for small brown circular spots.'}
                </p>
                <Link to="/guidance" className="cab-action-link">
                  <span>{labels.howToCheck}</span>
                  <Icon name="arrow" size={14} />
                </Link>
              </div>
            </section>
          )}

          {/* 4. COMPACT ASK AI VOICE/TEXT ENTRY POINT */}
          <section className="ask-ai-card" aria-label="Voice Assistant Entry">
            <div className="aac-header">
              <div className="aac-icon">
                <Icon name="mic" size={22} />
              </div>
              <div className="aac-titles">
                <h2>{labels.askAiTitle}</h2>
                <p>{labels.askAiSub}</p>
              </div>
            </div>

            <div className="aac-actions-row">
              <Link to="/assistant" className="aac-voice-btn">
                <Icon name="mic" size={18} />
                <span>{labels.startSpeaking}</span>
              </Link>

              <Link to="/assistant" className="aac-type-btn">
                <span>{labels.typeQuestion}</span>
                <Icon name="arrow" size={14} />
              </Link>
            </div>

            {/* Max two compact suggestion chips */}
            <div className="aac-chips-row">
              <Link to="/assistant" className="aac-chip">
                <span>💬 {language === 'mr' ? 'करपा नियंत्रण उपाय' : language === 'hi' ? 'झुलसा रोकथाम' : 'Blight Spray Remedy'}</span>
              </Link>
              <Link to="/assistant" className="aac-chip">
                <span>💬 {language === 'mr' ? 'बोंडअळी सापळे' : language === 'hi' ? 'सुंडी ट्रैप' : 'Bollworm Traps'}</span>
              </Link>
            </div>
          </section>

          {/* 5. SCAN HISTORY SHORTCUT CARD */}
          <section className="history-shortcut-card">
            <div className="hsc-left">
              <div className="hsc-icon">
                <Icon name="history" size={20} />
              </div>
              <div>
                <h3>{labels.historyTitle}</h3>
                <p>{labels.historyDesc}</p>
              </div>
            </div>
            <Link to="/history" className="hsc-link-btn">
              <span>{labels.viewAllHistory}</span>
            </Link>
          </section>
        </div>

        {/* SECONDARY STREAM (Right on Desktop, Bottom on Mobile) */}
        <aside className="dash-secondary-stream">
          {/* 6. COMPACT MOBILE WEATHER CARD */}
          <section className="compact-weather-card" aria-label="Current field weather">
            <div className="cwc-top-row">
              <div className="cwc-location-wrap">
                <span className="cwc-overline">WEATHER</span>
                <h3 className="cwc-location">
                  {weatherData.location.split(',')[0]} · <strong className="cwc-temp">{weatherData.temperature}°C</strong>
                </h3>
                <span className="cwc-condition">{weatherData.condition}</span>
              </div>
              <div className="cwc-weather-icon">
                <Icon name="weather" size={32} />
              </div>
            </div>

            {/* Compact Secondary Metrics Row */}
            <div className="cwc-metrics-row">
              <div className="cwc-metric">
                <span className="cwc-metric-label">Humidity</span>
                <strong className="cwc-metric-val">{weatherData.humidity}%</strong>
              </div>
              <span className="cwc-metric-divider">|</span>
              <div className="cwc-metric">
                <span className="cwc-metric-label">Wind</span>
                <strong className="cwc-metric-val">{weatherData.windSpeed} km/h</strong>
              </div>
              <span className="cwc-metric-divider">|</span>
              <div className="cwc-metric">
                <span className="cwc-metric-label">Rainfall</span>
                <strong className="cwc-metric-val">{weatherData.rainfall} mm</strong>
              </div>
            </div>

            <Link to="/weather" className="cwc-footer-btn">
              <span>{labels.viewWeatherDetails}</span>
              <Icon name="arrow" size={15} />
            </Link>
          </section>

          {/* 7. COMPACT FIELD HEALTH TIPS (MAX 2 RELEVANT TIPS) */}
          <section className="compact-tips-section" aria-label="Field health guidance">
            <div className="cts-header">
              <h3>{labels.tipsHeading}</h3>
              <Link to="/guidance" className="cts-see-all">
                {labels.viewAllTips}
              </Link>
            </div>

            <div className="cts-list">
              {tips.map((tip) => (
                <Link to="/guidance" key={tip.id} className="cts-item">
                  <img
                    src={`https://images.unsplash.com/${tip.image}?w=140&h=100&fit=crop`}
                    alt=""
                    className="cts-thumb"
                  />
                  <div className="cts-item-copy">
                    <strong>{tip.title}</strong>
                    <p>{tip.desc}</p>
                  </div>
                  <Icon name="chevronRight" size={16} className="cts-arrow" />
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
