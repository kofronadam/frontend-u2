import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Items from '../components/Items'
import Members from '../components/Members'
import AccessRequest from '../components/AccessRequest'
import AccessRequests from '../components/AccessRequests'
import NotificationBell from '../components/NotificationBell'
import LoginModal from '../components/LoginModal'
import ProgressDonut from '../components/ProgressDonut'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function ListDetailPage() {
  const { t } = useTranslation()
  const { listId } = useParams()
  const navigate = useNavigate()
  const { 
    lists, 
    currentUser, 
    loading, 
    error, 
    updateList,
    deleteList,
    logout,
    isListMember,
    clearError,
    refreshData
  } = useApp()

  // Local state
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  // Find current list
  const list = lists.find(l => l.id === listId)
  const hasAccess = list && currentUser && isListMember(list)
  const isOwner = list && currentUser && list.owner === currentUser
  const isMember = list && currentUser && (list.members || []).includes(currentUser)

  // compute counts for donut
  const doneCount = (list?.items || []).filter(i => i.done).length
  const totalCount = (list?.items || []).length

  // Effects
  useEffect(() => {
    if (list && isEditing) {
      setEditedName(list.name)
    }
  }, [list, isEditing])

  // Pokud seznam neexistuje a není loading, přesměruj na hlavní stránku
  useEffect(() => {
    if (! loading && !list && currentUser) {
      console.warn(`List ${listId} not found, redirecting... `)
      navigate('/', { replace: true })
    }
  }, [list, loading, listId, navigate, currentUser])

  // Event handlers
  const handleLogout = () => {
    if (window.confirm('Opravdu se chcete odhlásit?')) {
      logout()
      navigate('/')
    }
  }

  const handleEditName = () => {
    if (! isOwner) {
      alert('Pouze vlastník může upravovat název seznamu')
      return
    }
    setIsEditing(true)
    setEditedName(list.name)
  }

  const handleSaveName = async () => {
    const newName = editedName.trim()
    if (!newName) {
      alert('Název seznamu nemůže být prázdný')
      return
    }

    if (newName === list.name) {
      setIsEditing(false)
      return
    }

    setLocalLoading(true)
    try {
      await updateList(list.id, { name: newName })
      setIsEditing(false)
      console.log('✅ List name updated')
    } catch (err) {
      console.error('❌ Error updating list name:', err)
      alert('Chyba při ukládání názvu')
    } finally {
      setLocalLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedName(list.name)
  }

  const handleDeleteList = async () => {
    if (! isOwner) {
      alert('Pouze vlastník může smazat seznam')
      return
    }

    const confirmed = window.confirm(
      `Opravdu chcete smazat seznam "${list.name}"?\n\nTato akce je nevratná a smaže všechny položky a členy. `
    )

    if (confirmed) {
      setLocalLoading(true)
      try {
        await deleteList(list.id)
        navigate('/')
        console.log('✅ List deleted, redirected to home')
      } catch (err) {
        console. error('❌ Error deleting list:', err)
        setLocalLoading(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleRefresh = async () => {
    await refreshData()
  }

  // Loading state for initial load
  if (loading && lists.length === 0) {
    return (
      <div className="list-detail-page">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // List not found
  if (! loading && !list) {
    return (
      <div className="list-detail-page">
        <div className="container">
          <div className="no-access">
            <h3>📋 Seznam nenalezen</h3>
            <p>Seznam s ID "{listId}" neexistuje nebo k němu nemáte přístup.</p>
            <Link to="/" className="btn btn-primary">
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Not logged in
  if (! currentUser) {
    return (
      <div className="list-detail-page">
        <div className="container">
          <header className="detail-header">
            <div>
              <Link to="/" className="back-button">
                ← Zpět na seznamy
              </Link>
              <h1>Přihlášení vyžadováno</h1>
            </div>
            <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">
              Přihlásit se
            </button>
          </header>

          <div className="no-access">
            <h3>🔐 Přístup omezen</h3>
            <p>Pro zobrazení detailu seznamu se musíte přihlásit. </p>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="btn btn-primary btn-lg"
            >
              Přihlásit se
            </button>
          </div>

          {showLoginModal && (
            <LoginModal onClose={() => setShowLoginModal(false)} />
          )}
        </div>
      </div>
    )
  }

  // No access to list
  if (! hasAccess) {
    return (
      <div className="list-detail-page">
        <div className="container">
          <header className="detail-header">
            <div>
              <Link to="/" className="back-button">
                ← Zpět na seznamy
              </Link>
              <h1>{list.name}</h1>
            </div>
            <div className="header-actions">
              <NotificationBell />
              <div className="user-section">
                <div className="user-info">
                  Přihlášen: <strong>{currentUser}</strong>
                </div>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">
                  Odhlásit se
                </button>
              </div>
            </div>
          </header>

          <AccessRequest list={list} />
        </div>
      </div>
    )
  }

  // Main render - user has access
  return (
    <div className="list-detail-page">
      <div className="container">
        {/* Header */}
        <header className="detail-header">
          <div className="flex items-center gap-4">
            <Link to="/" className="back-button">
             Zpět na seznamy
            </Link>
            
            {isEditing ?  (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e. target.value)}
                  onKeyPress={handleKeyPress}
                  onBlur={handleSaveName}
                  className="form-input text-2xl font-bold"
                  style={{ fontSize: '1.5rem', padding: '8px 12px' }}
                  autoFocus
                  disabled={localLoading}
                />
                <button 
                  onClick={handleSaveName}
                  disabled={localLoading}
                  className="btn btn-success btn-sm"
                  title="Uložit (Enter)"
                >
                  ✓
                </button>
                <button 
                  onClick={handleCancelEdit}
                  disabled={localLoading}
                  className="btn btn-secondary btn-sm"
                  title="Zrušit (Esc)"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="mb-0">{list.name}</h1>
                {isOwner && (
                  <button 
                    onClick={handleEditName}
                    className="btn btn-secondary btn-sm"
                    title="Upravit název"
                    disabled={localLoading}
                  >
                    ✏️
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="header-actions">
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationBell />
            
            <button 
              onClick={handleRefresh} 
              className="btn btn-secondary btn-sm" 
              title="Obnovit data"
              disabled={localLoading}
            >
              🔄
            </button>
            
            {isOwner && (
              <button 
                onClick={handleDeleteList}
                className="btn btn-danger btn-sm"
                title="Smazat seznam"
                disabled={localLoading}
              >
                🗑️ Smazat seznam
              </button>
            )}
            
            <div className="user-section">
              <div className="user-info">
                {isOwner && <span className="badge owner-badge mr-2">Vlastník</span>}
                {isMember && <span className="badge member-badge mr-2">Člen</span>}
                <strong>{currentUser}</strong>
              </div>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Odhlásit se
              </button>
            </div>
          </div>
        </header>

        {/* Error handling */}
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={clearError}
          />
        )}

        {/* Loading overlay for local actions */}
        {localLoading && (
          <div className="mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-blue-700">Aktualizuje se...</span>
            </div>
          </div>
        )}

        {/* List info + Progress donut */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
            <ProgressDonut done={doneCount} total={totalCount} size={140} />
            <div>
              <div><strong>{t('owner') || 'Vlastník'}:</strong> {list.owner}</div>
              <div><strong>{t('members') || 'Členové'}:</strong> {(list.members || []).length}</div>
              <div><strong>{t('items_done', { done: doneCount, total: totalCount })}</strong></div>
            </div>
          </div>
        </div>

        {/* Access requests panel (only for owner) */}
        <AccessRequests list={list} />

        {/* Main content */}
        <div className="detail-content">
          {/* Sidebar - Members */}
          <aside className="detail-sidebar">
            <Members list={list} />
          </aside>

          {/* Main content - Items */}
          <main className="detail-main">
            <Items list={list} />
          </main>
        </div>
      </div>
    </div>
  )
}