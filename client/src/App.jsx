import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import { translations } from './translations.js'
import { TranslationContext } from './i18n.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScanPage from './pages/ScanPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import WeatherPage from './pages/WeatherPage.jsx'
import GuidancePage from './pages/GuidancePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import AssistantPage from './pages/AssistantPage.jsx'

export default function App() {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('shetimitra-language')
      return translations[saved] ? saved : 'mr'
    } catch {
      return 'mr'
    }
  })

  document.documentElement.lang = language
  const t = (key) => translations[language][key] ?? translations.en[key] ?? key

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    try { localStorage.setItem('shetimitra-language', nextLanguage) } catch { /* Optional preference storage. */ }
  }

  return <TranslationContext.Provider value={t}><Routes><Route element={<AppLayout language={language} setLanguage={changeLanguage} />}><Route index element={<Dashboard />} /><Route path="scan" element={<ScanPage />} /><Route path="assistant" element={<AssistantPage language={language} />} /><Route path="history" element={<HistoryPage />} /><Route path="settings" element={<GuidancePage />} /><Route path="weather" element={<WeatherPage />} /><Route path="guidance" element={<GuidancePage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes></TranslationContext.Provider>
}
