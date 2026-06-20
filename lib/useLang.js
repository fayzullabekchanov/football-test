// lib/useLang.js
import { createContext, useContext, useState, useEffect } from 'react'
import { translations, getLang, setLang } from './i18n'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('uz')

  useEffect(() => {
    setLangState(getLang())
  }, [])

  const changeLang = (code) => {
    setLang(code)
    setLangState(code)
  }

  const t = translations[lang] || translations['uz']

  return (
      <LangContext.Provider value={{ lang, changeLang, t }}>
        {children}
      </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}