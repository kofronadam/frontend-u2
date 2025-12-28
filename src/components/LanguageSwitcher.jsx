import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const setLang = (lng) => {
    i18n.changeLanguage(lng)
    try { localStorage.setItem('app_lang', lng) } catch {}
  }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button className="btn btn-sm" onClick={() => setLang('cs')}>CS</button>
      <button className="btn btn-sm" onClick={() => setLang('en')}>EN</button>
    </div>
  )
}