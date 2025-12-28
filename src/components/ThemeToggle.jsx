import React, { useEffect, useState } from 'react'

const KEY = 'app_theme' // 'light' | 'dark'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(KEY, theme) } catch {}
  }, [theme])

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      title="Přepnout Light / Dark"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}