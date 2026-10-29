import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import { translations } from './translations.js'
import { TranslationContext } from './i18n.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScanPage from './pages/ScanPage.jsx'
import TapToSpeak from './pages/TapToSpeak.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import WeatherPage from './pages/WeatherPage.jsx'
import GuidancePage from './pages/GuidancePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('shetimitra-language')
      return translations[saved] ? saved : 'mr'
    } catch {
      return 'mr'
    }
  })

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = (key) => translations[language]?.[key] ?? translations.en[key] ?? key

  const changeLanguage = (nextLanguage) => {
    if (translations[nextLanguage]) {
      setLanguage(nextLanguage)
      try {
        localStorage.setItem('shetimitra-language', nextLanguage)
      } catch {
        /* LocalStorage safe fallback */
      }
    }
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      <Routes>
        <Route element={<AppLayout language={language} setLanguage={changeLanguage} />}>
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="assistant" element={<TapToSpeak />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="guidance" element={<GuidancePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </TranslationContext.Provider>
  )
}
