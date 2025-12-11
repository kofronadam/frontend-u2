import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function AccessRequest({ list }) {
  const { currentUser, requestAccess } = useApp()
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  const hasRequested = (list.accessRequests || []).some(r => r.username === currentUser)

  const handleRequest = () => {
    if (!showForm) {
      setShowForm(true)
      return
    }

    requestAccess(list. id, message)
    setShowForm(false)
    setMessage('')
  }

  if (hasRequested) {
    return (
      <div className="access-request sent">
        <p>✅ Žádost o přístup byla odeslána</p>
        <p>Čekáte na schválení od vlastníka seznamu.</p>
      </div>
    )
  }

  return (
    <div className="access-request">
      {!showForm ?  (
        <div>
          <p>Nemáte přístup k tomuto seznamu.</p>
          <button onClick={handleRequest} className="request-button">
            Požádat o přístup
          </button>
        </div>
      ) : (
        <div className="request-form">
          <h3>Žádost o přístup</h3>
          <textarea
            placeholder="Volitelná zpráva pro vlastníka seznamu..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
          />
          <div className="form-actions">
            <button onClick={() => setShowForm(false)} className="cancel-button">
              Zrušit
            </button>
            <button onClick={handleRequest} className="send-button">
              Odeslat žádost
            </button>
          </div>
        </div>
      )}
    </div>
  )
}