import { createContext, useContext } from 'react'
import { translations } from './translations.js'

export const TranslationContext = createContext({
  language: 'mr',
  setLanguage: () => {},
  t: (key) => key,
})

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (typeof context === 'function') {
    return context
  }
  return context.t || ((key) => key)
}

export function useLanguage() {
  const context = useContext(TranslationContext)
  return {
    language: context.language || 'mr',
    setLanguage: context.setLanguage || (() => {}),
    t: context.t || ((key) => key),
  }
}
