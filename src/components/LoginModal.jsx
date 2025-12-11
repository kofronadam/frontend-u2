import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function LoginModal({ onClose }) {
  const [usernameInput, setUsernameInput] = useState('')
  const { login } = useApp()

  const handleSubmit = (e) => {
    e.preventDefault()
    const username = usernameInput.trim()
    if (username) {
      login(username)
      onClose()
    }
  }

  const handleOverlayClick = (e) => {
    if (e. target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Přihlášení</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="username">Uživatelské jméno:</label>
            <input
              id="username"
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target. value)}
              placeholder="Zadejte své jméno"
              autoFocus
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Zrušit</button>
            <button type="submit" disabled={!usernameInput.trim()}>
              Přihlásit se
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}