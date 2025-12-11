import React, { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Members from '../components/MembersSimple'
import Items from '../components/Items'
import LoginModal from '../components/LoginModal'

export default function ListDetailPage() {
  const { listId } = useParams()
  const { lists, currentUser, logout } = useApp() // přidat logout
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  const list = lists.find(l => l.id === listId)
  
  if (!list) {
    return <Navigate to="/" replace />
  }

  const isOwner = list.owner === currentUser
  const isMember = list.members.includes(currentUser)
  const hasAccess = isOwner || isMember

  const handleLogout = () => {
    if (window.confirm('Opravdu se chcete odhlásit?')) {
      logout()
    }
  }

  return (
    <div className="list-detail-page">
      <header className="detail-header">
        <Link to="/" className="back-button">← Zpět na seznamy</Link>
        <h1>{list.name}</h1>
        <div className="header-actions">
          {currentUser ? (
            <div className="user-section">
              <span className="user-info">
                Přihlášen jako: <strong>{currentUser}</strong>
              </span>
              <button onClick={handleLogout} className="logout-button">
                Odhlásit se
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="login-button">
              Přihlásit se
            </button>
          )}
        </div>
      </header>

      {hasAccess ?  (
        <div className="detail-content">
          <div className="detail-sidebar">
            <Members list={list} />
          </div>
          <div className="detail-main">
            <Items list={list} />
          </div>
        </div>
      ) : (
        <div className="no-access">
          <p>Nemáte oprávnění k zobrazení tohoto seznamu.</p>
          <p>Požádejte vlastníka ({list.owner}) o přidání mezi členy.</p>
          {!currentUser && (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="login-button"
            >
              Nebo se přihlaste
            </button>
          )}
        </div>
      )}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  )
}