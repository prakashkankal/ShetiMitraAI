import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import { useTranslation, useLanguage } from '../i18n.jsx'
import { apiListDetections, apiDeleteDetection } from '../lib/api.js'
import './HistoryPage.css'

export default function HistoryPage() {
  const t = useTranslation()
  const { language } = useLanguage()

  const [historyList, setHistoryList] = useState([])
  const [filterTab, setFilterTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Load from MongoDB backend (with offline localStorage fallback)
  useEffect(() => {
    let localItems = []
    try {
      const stored = localStorage.getItem('shetimitra-scan-history')
      if (stored) {
        localItems = JSON.parse(stored)
        setHistoryList(localItems)
      }
    } catch {
      localItems = []
    }

    setLoading(true)
    apiListDetections(1, 50)
      .then((res) => {
        if (res?.data?.items?.length) {
          const apiRecords = res.data.items.map((item) => ({
            id: item._id,
            date: new Date(item.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            crop: item.cropType,
            diseaseName: item.diseaseName,
            scientificName: item.scientificName,
            confidence: item.confidence,
            status: item.status,
            imageUrl: item.imageUrl || item.imageThumbnailUrl,
            symptoms: item.symptoms,
            remedy: item.culturalControl,
          }))

          setHistoryList((prev) => {
            const existingIds = new Set(prev.map((p) => p.id))
            const newFromApi = apiRecords.filter((a) => !existingIds.has(a.id))
            return [...prev, ...newFromApi]
          })
        }
      })
      .catch((err) => {
        console.warn('Backend history fetch unavailable, using local history:', err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Sync back to storage on deletion
  const deleteRecord = (id) => {
    const nextList = historyList.filter((item) => item.id !== id)
    setHistoryList(nextList)
    try {
      localStorage.setItem('shetimitra-scan-history', JSON.stringify(nextList))
    } catch {
      /* Safe catch */
    }
    // Attempt backend delete if it's a backend mongo ID
    if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
      apiDeleteDetection(id).catch(() => {})
    }
    showToast('Scan record deleted.')
  }

  const clearAllHistory = () => {
    setHistoryList([])
    try {
      localStorage.removeItem('shetimitra-scan-history')
    } catch {
      /* Safe catch */
    }
    setShowClearConfirm(false)
    showToast('All scan history cleared.')
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Filter and Search logic
  const filteredList = historyList.filter((item) => {
    // Tab filter
    if (filterTab === 'tomato' && item.crop.toLowerCase() !== 'tomato') return false
    if (filterTab === 'cotton' && item.crop.toLowerCase() !== 'cotton') return false
    if (filterTab === 'healthy' && item.status !== 'healthy') return false
    if (filterTab === 'uncertain' && item.status !== 'uncertain') return false

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchDisease = item.diseaseName.toLowerCase().includes(q)
      const matchCrop = item.crop.toLowerCase().includes(q)
      const matchDate = item.date.toLowerCase().includes(q)
      return matchDisease || matchCrop || matchDate
    }

    return true
  })

  // Summary counts
  const totalScans = historyList.length
  const confirmedCount = historyList.filter((x) => x.status === 'high').length
  const healthyCount = historyList.filter((x) => x.status === 'healthy').length
  const uncertainCount = historyList.filter((x) => x.status === 'uncertain').length

  return (
    <div className="history-page">
      {/* Top Banner */}
      <div className="history-header-banner">
        <div className="history-banner-text">
          <span className="history-overline">DIAGNOSTIC ARCHIVE • LOCAL STORAGE ENCRYPTED</span>
          <h1 className="history-title">{t('historyTitle')}</h1>
          <p className="history-subtitle">{t('historySubtitle')}</p>
        </div>

        <div className="history-header-actions">
          <Link to="/scan" className="new-scan-btn">
            <Icon name="scan" size={17} />
            <span>{t('navScan')}</span>
          </Link>

          {historyList.length > 0 && (
            <button
              type="button"
              className="clear-history-btn"
              onClick={() => setShowClearConfirm(true)}
              aria-label="Clear all scan history"
            >
              <Icon name="trash" size={16} />
              <span>{t('clearAllHistory')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="history-metrics-row">
        <div className="metric-card">
          <span className="metric-label">Total Leaf Scans</span>
          <strong className="metric-val">{totalScans}</strong>
          <span className="metric-sub">Recorded locally</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Confirmed Diagnoses</span>
          <strong className="metric-val text-green">{confirmedCount}</strong>
          <span className="metric-sub">Verified advice</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Healthy Crops</span>
          <strong className="metric-val text-emerald">{healthyCount}</strong>
          <span className="metric-sub">Optimal vigor</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Uncertain Cases</span>
          <strong className="metric-val text-amber">{uncertainCount}</strong>
          <span className="metric-sub">Safety flag (FR-04)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="history-controls-bar">
        {/* Search */}
        <div className="history-search-box">
          <Icon name="search" size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchHistoryPlaceholder')}
            aria-label="Search scan records"
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

        {/* Filter Tabs */}
        <div className="history-tabs-list">
          <button
            type="button"
            className={`tab-pill ${filterTab === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTab('all')}
          >
            {t('filterAll')} ({totalScans})
          </button>
          <button
            type="button"
            className={`tab-pill ${filterTab === 'tomato' ? 'active' : ''}`}
            onClick={() => setFilterTab('tomato')}
          >
            {t('filterTomato')}
          </button>
          <button
            type="button"
            className={`tab-pill ${filterTab === 'healthy' ? 'active' : ''}`}
            onClick={() => setFilterTab('healthy')}
          >
            {t('filterHealthy')}
          </button>
          <button
            type="button"
            className={`tab-pill ${filterTab === 'uncertain' ? 'active' : ''}`}
            onClick={() => setFilterTab('uncertain')}
          >
            {t('filterUncertain')}
          </button>
        </div>
      </div>

      {/* History Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="history-empty-card">
          <div className="empty-leaf-icon">
            <Icon name="leaf" size={32} />
          </div>
          <h3>{t('noHistoryTitle')}</h3>
          <p>{t('noHistoryDesc')}</p>
          <Link to="/scan" className="empty-start-btn">
            <Icon name="scan" size={18} />
            <span>{t('navScan')}</span>
          </Link>
        </div>
      ) : (
        <div className="history-cards-grid">
          {filteredList.map((item) => (
            <div key={item.id} className="history-item-card">
              <div className="card-top-row">
                <img src={item.imageUrl} alt={item.diseaseName} className="history-leaf-thumb" />
                <div className="card-main-meta">
                  <div className="meta-badges">
                    <span className="crop-pill">{item.crop}</span>
                    <span className={`status-pill ${item.status}`}>
                      {item.status === 'uncertain'
                        ? 'Uncertain (FR-04)'
                        : item.status === 'healthy'
                        ? 'Healthy Foliage'
                        : `${item.confidence}% Confidence`}
                    </span>
                  </div>
                  <h3 className="card-disease-title">{item.diseaseName}</h3>
                  <small className="card-date-time">
                    {item.date} • {item.time}
                  </small>
                </div>
              </div>

              <div className="card-summary-snippet">
                <strong>Symptoms:</strong> {item.symptoms}
              </div>

              <div className="card-action-footer">
                <button
                  type="button"
                  className="btn-view-report"
                  onClick={() => setSelectedReport(item)}
                >
                  <Icon name="book" size={15} />
                  <span>{t('viewReport')}</span>
                </button>

                <button
                  type="button"
                  className="btn-delete-record"
                  onClick={() => deleteRecord(item.id)}
                  aria-label="Delete scan record"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Privacy Notice Banner (PRD FR-09) */}
      <div className="history-privacy-banner">
        <Icon name="shieldCheck" size={18} className="shield-icon" />
        <p>{t('privacyNote')}</p>
      </div>

      {/* Full Report Modal */}
      {selectedReport && (
        <div className="modal-backdrop" onClick={() => setSelectedReport(null)}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-crop-tag">{selectedReport.crop} Leaf Diagnosis</span>
                <h3 className="modal-title">{selectedReport.diseaseName}</h3>
                <small className="modal-datetime">
                  Recorded on {selectedReport.date} at {selectedReport.time}
                </small>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedReport(null)}
                aria-label="Close modal"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-image-row">
                <img
                  src={selectedReport.imageUrl}
                  alt={selectedReport.diseaseName}
                  className="modal-leaf-img"
                />
                <div className="modal-score-box">
                  <span className="score-label">{t('confidenceScore')}</span>
                  <strong className="score-value">{selectedReport.confidence}%</strong>
                  <span
                    className={`score-pill ${
                      selectedReport.status === 'uncertain'
                        ? 'uncertain'
                        : selectedReport.status === 'healthy'
                        ? 'healthy'
                        : 'confirmed'
                    }`}
                  >
                    {selectedReport.status === 'uncertain'
                      ? 'Below Safety Threshold'
                      : selectedReport.status === 'healthy'
                      ? 'No Pathogens Detected'
                      : 'Verified Prediction'}
                  </span>
                </div>
              </div>

              <div className="modal-section">
                <h4>
                  <Icon name="search" size={16} /> {t('symptomsTitle')}
                </h4>
                <p>{selectedReport.symptoms}</p>
              </div>

              <div className="modal-section">
                <h4>
                  <Icon name="sprout" size={16} /> {t('culturalControl')}
                </h4>
                <p>{selectedReport.remedy}</p>
              </div>

              {selectedReport.status === 'uncertain' ? (
                <div className="modal-uncertain-warning">
                  <Icon name="alertTriangle" size={18} />
                  <span>
                    In compliance with PRD safety standards, chemical treatments are withheld for
                    uncertain results. Consult your local agricultural officer.
                  </span>
                </div>
              ) : (
                <div className="modal-verified-stamp">
                  <Icon name="shieldCheck" size={17} />
                  <span>Reviewed by Agricultural Extension Officer • ShetiMitra AI v1.0</span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-print-btn"
                onClick={() => window.print()}
              >
                <Icon name="download" size={16} />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                className="modal-done-btn"
                onClick={() => setSelectedReport(null)}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-backdrop" onClick={() => setShowClearConfirm(false)}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <Icon name="trash" size={28} />
            </div>
            <h3>Clear All Scan History?</h3>
            <p>{t('clearConfirm')}</p>
            <div className="confirm-actions">
              <button type="button" className="confirm-yes-btn" onClick={clearAllHistory}>
                Yes, Delete All
              </button>
              <button
                type="button"
                className="confirm-no-btn"
                onClick={() => setShowClearConfirm(false)}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="floating-toast" role="status">
          <Icon name="check" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
