import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LoginModal from '../components/LoginModal'
import ListCard from '../components/ListCard'
import ListFilter from '../components/ListFilter'
import NotificationBell from '../components/NotificationBell'

export default function ListsPage() {
  const { lists, currentUser, createList, logout } = useApp() // přidat logout
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [filterOwner, setFilterOwner] = useState('all')

  const filteredLists = lists.filter(list => {
    const matchesText = list.name. toLowerCase().includes(filterText.toLowerCase())
    const matchesOwner = filterOwner === 'all' || 
                        (filterOwner === 'mine' && list.owner === currentUser) ||
                        (filterOwner === 'shared' && list.members.includes(currentUser))
    return matchesText && matchesOwner
  })

  const handleCreateList = () => {
    if (!currentUser) {
      setShowLoginModal(true)
      return
    }
    const name = prompt('Název seznamu:')
    if (name) {
      createList(name)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Opravdu se chcete odhlásit?')) {
      logout()
    }
  }

  return (
    <div className="lists-page">
      <header className="page-header">
        <h1>Nákupní seznamy</h1>
        <div className="header-actions">
          {currentUser && <NotificationBell />}
          {currentUser ?  (
            <div className="user-section">
              <span className="user-info">
                Přihlášen: <strong>{currentUser}</strong>
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

      <div className="actions">
        <button onClick={handleCreateList} className="create-button">
          + Nový seznam
        </button>
      </div>

      <ListFilter 
        filterText={filterText}
        setFilterText={setFilterText}
        filterOwner={filterOwner}
        setFilterOwner={setFilterOwner}
        currentUser={currentUser}
      />

      <div className="lists-grid">
        {filteredLists.map(list => (
          <ListCard key={list.id} list={list} />
        ))}
        {filteredLists.length === 0 && (
          <div className="no-lists">
            {filterText || filterOwner !== 'all' 
              ? 'Žádné seznamy neodpovídají filtru'
              : 'Zatím nemáte žádné seznamy'
            }
          </div>
        )}
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  )
}