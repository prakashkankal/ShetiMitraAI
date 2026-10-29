import { createContext, useContext } from 'react'

export const TranslationContext = createContext((key) => key)
export const LanguageContext = createContext(null)

export function useTranslation() {
  return useContext(TranslationContext)
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageContext')
  }
  return context
}
