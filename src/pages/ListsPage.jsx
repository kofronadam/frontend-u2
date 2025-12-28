import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import ListCard from '../components/ListCard'
import ListFilter from '../components/ListFilter'
import LoginModal from '../components/LoginModal'
import NotificationBell from '../components/NotificationBell'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { apiService } from '../services/apiService'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function ListsPage() {
  const { 
    lists, 
    currentUser, 
    loading, 
    error, 
    login, 
    logout, 
    createList, 
    getListsByFilter,
    clearError,
    refreshData
  } = useApp()

  // Local state
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [filterText, setFilterText] = useState('')
  const [filterOwner, setFilterOwner] = useState('all')

  // Filtered lists based on search and owner filter
  const filteredLists = useMemo(() => {
    let filtered = getListsByFilter(filterOwner)
    
    if (filterText. trim()) {
      const searchTerm = filterText.trim().toLowerCase()
      filtered = filtered.filter(list =>
        list.name.toLowerCase().includes(searchTerm) ||
        list.owner.toLowerCase().includes(searchTerm) ||
        (list.members || []).some(member => member.toLowerCase().includes(searchTerm))
      )
    }
    
    return filtered
  }, [lists, filterOwner, filterText, getListsByFilter])

  // Event handlers
  const handleLogout = () => {
    if (window.confirm('Opravdu se chcete odhlásit?')) {
      logout()
    }
  }

  const handleCreateList = async () => {
    const name = newListName.trim()
    if (!name) {
      alert('Zadejte název seznamu')
      return
    }

    const listId = await createList(name)
    if (listId) {
      setNewListName('')
      setShowCreateModal(false)
      // Můžeme přesměrovat na nový seznam
      // navigate(`/list/${listId}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateList()
    }
  }

  const handleRefresh = async () => {
    await refreshData()
  }

  // Render loading state
  if (loading && lists.length === 0) {
    return (
      <div className="lists-page">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="lists-page">
      <div className="container">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1>Nákupní seznamy</h1>
            <p className="text-gray-600">
              {currentUser ? (
                <>Správa vašich nákupních seznamů • {filteredLists.length} seznamů</>
              ) : (
                'Přihlaste se pro správu nákupních seznamů'
              )}
            </p>
          </div>
          
          
            <div className="header-actions">
              {currentUser && <NotificationBell />}

              {/* Language + Theme */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginRight: 8 }}>
                <LanguageSwitcher />
                <ThemeToggle />
                </div>
            
            {currentUser ? (
              <div className="user-section">
                <div className="user-info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                </svg> <strong>{currentUser}</strong>
                </div>
                
                <button onClick={handleLogout} className="btn btn-danger btn-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">
                Přihlásit se
              </button>
            )}
          </div>
        </header>

        {/* Error handling */}
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={clearError}
          />
        )}

        {currentUser ?  (
          <>
            {/* Create new list button */}
            <div className="mb-6">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn btn-success btn-lg"
              >
                + Vytvořit nový seznam
              </button>
            </div>

            {/* Filters */}
            {lists.length > 0 && (
              <ListFilter
                filterText={filterText}
                setFilterText={setFilterText}
                filterOwner={filterOwner}
                setFilterOwner={setFilterOwner}
                currentUser={currentUser}
              />
            )}

            {/* Lists grid */}
            {filteredLists.length > 0 ? (
              <>
                {filterText && (
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Nalezeno {filteredLists. length} seznamů pro "{filterText}"
                    </p>
                  </div>
                )}
                
                <div className="lists-grid">
                  {filteredLists.map(list => (
                    <ListCard key={list.id} list={list} />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-lists">
                {filterText ?  (
                  <>
                    <h3>🔍 Žádné výsledky</h3>
                    <p>Nenalezeny žádné seznamy pro hledaný výraz "{filterText}"</p>
                    <button 
                      onClick={() => setFilterText('')}
                      className="btn btn-secondary"
                    >
                      Zrušit vyhledávání
                    </button>
                  </>
                ) : lists.length === 0 ? (
                  <>
                    <h3>📝 Žádné seznamy</h3>
                    <p>Zatím nemáte žádné nákupní seznamy. </p>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="btn btn-primary"
                    >
                      Vytvořit první seznam
                    </button>
                  </>
                ) : (
                  <>
                    <h3>🚫 Žádný přístup</h3>
                    <p>Nemáte přístup k žádným seznamům v kategorii "{
                      filterOwner === 'mine' ? 'Moje seznamy' : 
                      filterOwner === 'shared' ? 'Sdílené se mnou' :  'Všechny'
                    }"</p>
                    <button 
                      onClick={() => setFilterOwner('all')}
                      className="btn btn-secondary"
                    >
                      Zobrazit všechny dostupné
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="no-access">
            <h3>👋 Vítejte!</h3>
            <p>Pro správu nákupních seznamů se musíte přihlásit. </p>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="btn btn-primary btn-lg"
            >
              Přihlásit se
            </button>
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}

        {/* Create List Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Vytvořit nový seznam</h3>
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="list-name">
                    Název seznamu: 
                  </label>
                  <input
                    id="list-name"
                    type="text"
                    className="form-input"
                    placeholder="např. Nákup do Tesca, Víkendový výlet..."
                    value={newListName}
                    onChange={(e) => setNewListName(e. target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                    maxLength={100}
                  />
                </div>
                
                <div className="modal-actions">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn-secondary"
                  >
                    Zrušit
                  </button>
                  <button 
                    onClick={handleCreateList}
                    disabled={!newListName.trim() || loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Vytváří se...' : 'Vytvořit seznam'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}