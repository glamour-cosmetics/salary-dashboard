import { useLanguage } from '../context/LanguageContext'
import translations from './translations'

export function useT(page) {
  const { language } = useLanguage()
  return translations[language][page]
}
