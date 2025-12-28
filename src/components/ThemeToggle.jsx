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
    try {
      document.documentElement.setAttribute('data-theme', theme)
      // optional: body class for easier scoping
      document.body.classList.toggle('theme-dark', theme === 'dark')
      localStorage.setItem(KEY, theme)
    } catch (e) {}
  }, [theme])

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      title="Přepnout Light / Dark"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}