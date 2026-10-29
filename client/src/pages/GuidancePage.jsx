import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import { useTranslation, useLanguage } from '../i18n.jsx'
import { apiListCrops } from '../lib/api.js'
import './GuidancePage.css'

export default function GuidancePage() {
  const t = useTranslation()
  const { language } = useLanguage()

  const [selectedCrop, setSelectedCrop] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState('')
  const [diseasesData, setDiseasesData] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch crop disease database directly from MongoDB
  useEffect(() => {
    setLoading(true)
    apiListCrops()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((doc, index) => ({
            id: doc._id || `crop-${index}`,
            crop: doc.crop,
            cropKey: `crop${doc.crop}`,
            name: doc.name,
            scientificName: doc.scientificName,
            pathogenType: doc.pathogenType,
            reviewedBy: doc.reviewedBy || 'Agronomist Extension Board',
            weatherRisk: doc.weatherRisk || 'Warm humid weather',
            symptoms: Array.isArray(doc.symptoms) ? doc.symptoms : [doc.symptoms],
            cultural: Array.isArray(doc.cultural) ? doc.cultural : [doc.cultural],
            chemical: Array.isArray(doc.chemical) ? doc.chemical : [doc.chemical],
          }))
          setDiseasesData(mapped)
          if (mapped.length > 0) setExpandedId(mapped[0].id)
        }
      })
      .catch((err) => {
        console.warn('Could not fetch crops from database:', err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const tomatoCount = diseasesData.filter((d) => d.crop.toLowerCase() === 'tomato').length
  const cottonCount = diseasesData.filter((d) => d.crop.toLowerCase() === 'cotton').length
  const potatoCount = diseasesData.filter((d) => d.crop.toLowerCase() === 'potato').length

  const filteredDiseases = diseasesData.filter((item) => {
    if (selectedCrop !== 'all' && item.crop.toLowerCase() !== selectedCrop.toLowerCase()) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = item.name.toLowerCase().includes(q)
      const matchScientific = item.scientificName.toLowerCase().includes(q)
      const matchCrop = item.crop.toLowerCase().includes(q)
      return matchName || matchScientific || matchCrop
    }
    return true
  })

  return (
    <div className="guidance-page">
      {/* Top Banner */}
      <div className="guidance-header-banner">
        <div className="guidance-banner-text">
          <span className="guidance-overline">AGRICULTURAL ADVISORY DATABASE • EXPERT REVIEWED</span>
          <h1 className="guidance-title">{t('guidanceTitle')}</h1>
          <p className="guidance-subtitle">{t('guidanceSubtitle')}</p>
        </div>

        <Link to="/scan" className="scan-leaf-action-btn">
          <Icon name="camera" size={17} />
          <span>{t('navScan')}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="guidance-controls-bar">
        <div className="guidance-search-box">
          <Icon name="search" size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchDiseases')}
            aria-label="Search diseases"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>

        <div className="crop-filter-pills">
          <button
            type="button"
            className={`crop-pill-btn ${selectedCrop === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCrop('all')}
          >
            All Crops ({diseasesData.length})
          </button>
          <button
            type="button"
            className={`crop-pill-btn ${selectedCrop === 'tomato' ? 'active' : ''}`}
            onClick={() => setSelectedCrop('tomato')}
          >
            Tomato ({tomatoCount})
          </button>
          <button
            type="button"
            className={`crop-pill-btn ${selectedCrop === 'cotton' ? 'active' : ''}`}
            onClick={() => setSelectedCrop('cotton')}
          >
            Cotton ({cottonCount})
          </button>
          <button
            type="button"
            className={`crop-pill-btn ${selectedCrop === 'potato' ? 'active' : ''}`}
            onClick={() => setSelectedCrop('potato')}
          >
            Potato ({potatoCount})
          </button>
        </div>
      </div>

      {/* Disease Cards Directory */}
      <div className="disease-directory-list">
        {loading && (
          <div style={{ padding: '2.5rem', textAlign: 'center', opacity: 0.7 }}>
            Loading agricultural advisory database from server...
          </div>
        )}
        {!loading && filteredDiseases.length === 0 && (
          <div style={{ padding: '2.5rem', textAlign: 'center', opacity: 0.7 }}>
            No diseases found matching your query.
          </div>
        )}
        {filteredDiseases.map((dis) => {
          const isExpanded = expandedId === dis.id
          return (
            <article key={dis.id} className="disease-accordion-card">
              <div
                className="card-summary-header"
                onClick={() => setExpandedId(isExpanded ? '' : dis.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <div className="summary-left">
                  <div className="crop-indicator-badge">
                    <Icon name="leaf" size={16} />
                    <span>{dis.crop}</span>
                  </div>

                  <div>
                    <h3 className="disease-card-title">{dis.name}</h3>
                    <em className="scientific-latin">{dis.scientificName}</em>
                  </div>
                </div>

                <div className="summary-right">
                  <span className="reviewer-tag">
                    <Icon name="shieldCheck" size={14} />
                    <span>{t('reviewedByBadge')}</span>
                  </span>

                  <span className="expand-chevron">
                    <Icon name={isExpanded ? 'chevronDown' : 'chevronRight'} size={18} />
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="disease-full-details">
                  <div className="weather-risk-box">
                    <strong>
                      <Icon name="weather" size={15} /> {t('favoredWeather')}:
                    </strong>
                    <p>{dis.weatherRisk}</p>
                  </div>

                  <div className="details-grid-two">
                    <div className="detail-pane">
                      <h4>
                        <Icon name="search" size={16} /> {t('symptomsTitle')}
                      </h4>
                      <ul>
                        {dis.symptoms.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="detail-pane">
                      <h4>
                        <Icon name="sprout" size={16} /> {t('culturalControl')}
                      </h4>
                      <ul>
                        {dis.cultural.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="chemical-precautions-box">
                    <h4>
                      <Icon name="shieldCheck" size={16} /> {t('chemicalPrecautions')}
                    </h4>
                    <ul>
                      {dis.chemical.map((ch, i) => (
                        <li key={i}>{ch}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-footer-stamp">
                    <span>
                      <strong>Agronomic Review:</strong> {dis.reviewedBy}
                    </span>
                    <Link to="/scan" className="scan-compare-link">
                      <Icon name="scan" size={14} />
                      <span>Scan Leaf for this Disease</span>
                    </Link>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
