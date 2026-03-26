import { createContext, useContext, useState } from 'react'

const LANGUAGES = [
  { code: 'ru', label: 'РУССКИЙ' },
  { code: 'uz', label: "O'ZBEKCHA" },
  { code: 'en', label: 'ENGLISH' },
]

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('lang') ?? 'ru'
  )

  function changeLanguage(code) {
    localStorage.setItem('lang', code)
    setLanguage(code)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
