import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function AccessRequest({ list }) {
  const { currentUser, requestAccess } = useApp()
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  const hasRequested = (list.accessRequests || []).some(r => r.username === currentUser)

  const handleRequest = () => {
    requestAccess(list.id, message)
    setMessage('')
    setShowModal(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) { // Ctrl+Enter pro odeslání (textarea)
      handleRequest()
    }
  }

  if (hasRequested) {
    return (
      <div className="access-request sent">
        <div className="text-center">
          <div className="text-2xl mb-4">✅</div>
          <h3 className="mb-2">Žádost odeslána</h3>
          <p className="text-gray-600">
            Čekáte na schválení od vlastníka seznamu <strong>{list.owner}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="access-request">
      <div className="text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="mb-4">Nemáte přístup k tomuto seznamu</h3>
        <p className="text-gray-600 mb-6">
          Seznam <strong>"{list.name}"</strong> patří uživateli <strong>{list. owner}</strong>. 
          <br />
          Můžete požádat o přidání mezi členy. 
        </p>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          Požádat o přístup
        </button>
      </div>

      {/* Modal pro žádost o přístup */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Žádost o přístup</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Seznam:</strong> {list.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Vlastník:</strong> {list.owner}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="access-message">
                  Zpráva pro vlastníka (volitelná):
                </label>
                <textarea
                  id="access-message"
                  className="form-textarea"
                  placeholder="Ahoj! Rád bych se připojil k vašemu nákupnímu seznamu..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows="4"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Stiskněte Ctrl+Enter pro rychlé odeslání
                </p>
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Zrušit
                </button>
                <button 
                  onClick={handleRequest}
                  className="btn btn-primary"
                >
                  Odeslat žádost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}