import React, { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const KEY = 'app_lang' // localStorage key

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(KEY) || i18n.language || 'cs'
    } catch {
      return i18n.language || 'cs'
    }
  })

  useEffect(() => {
    // keep i18n and localStorage in sync
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).catch(() => {})
    }
    try { localStorage.setItem(KEY, lang) } catch {}
  }, [lang, i18n])

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'cs' ? 'en' : 'cs'))
  }, [])

  const label = lang === 'cs' ? 'CS' : 'EN'
  const title = lang === 'cs' ? 'Přepnout do angličtiny' : 'Switch to Czech'

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={toggleLang}
      title={title}
      aria-label={title}
    >
      {label}
    </button>
  )
}