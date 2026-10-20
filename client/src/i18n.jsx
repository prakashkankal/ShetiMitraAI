import { createContext, useContext } from 'react'

export const TranslationContext = createContext((key) => key)

export function useTranslation() {
  return useContext(TranslationContext)
}
