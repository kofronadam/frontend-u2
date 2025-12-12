import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Items({ list }) {
  const { currentUser, updateList } = useApp()
  const [filterUnresolved, setFilterUnresolved] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [itemValue, setItemValue] = useState('')

  const items = list.items || []
  const members = list.members || []
  const isOwner = list. owner === currentUser
  const isMember = currentUser && (members.includes(currentUser) || isOwner)

  function openAdd() {
    if (!isMember) {
      alert('Musíš být členem seznamu, abys přidal položku.')
      return
    }
    setItemValue('')
    setShowAddModal(true)
  }

  function handleAddConfirm() {
    const v = (itemValue || '').trim()
    if (!v) return
    
    const newItem = {
      id: Date. now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: v,
      done: false,
      addedBy: currentUser,
      ts: Date.now()
    }
    
    updateList(list. id, {
      items: [...items, newItem]
    })
    
    setItemValue('')
    setShowAddModal(false)
  }

  function handleToggleDone(itemId, done) {
    updateList(list.id, {
      items: items.map(item => 
        item. id === itemId ? { ...item, done } : item
      )
    })
  }

  function handleRemoveItem(itemId) {
    if (!isMember) {
      alert('Nemáš oprávnění odstranit položku.')
      return
    }
    
    if (window.confirm('Opravdu chcete odstranit tuto položku?')) {
      updateList(list.id, {
        items: items. filter(item => item.id !== itemId)
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e. key === 'Enter') {
      handleAddConfirm()
    }
  }

  const itemsToShow = items.filter(it => !filterUnresolved || ! it.done)

  return (
    <section className="items">
      <div className="flex items-center justify-between mb-6">
        <h2 className="mb-0">Položky</h2>
        <button 
          onClick={openAdd} 
          disabled={!isMember}
          className="btn btn-primary"
        >
          Přidat položku
        </button>
      </div>

      <div className="filters mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={filterUnresolved} 
            onChange={(e) => setFilterUnresolved(e.target.checked)} 
          />
          Zobrazit jen nevyřešené
        </label>
      </div>

      <ul className="items-list">
        {itemsToShow.map(it => (
          <li key={it. id} className={it.done ? 'done' : ''}>
            <input 
              type="checkbox" 
              checked={it.done} 
              onChange={(e) => handleToggleDone(it.id, e. target.checked)} 
            />
            <div className="item-text">{it.text}</div>
            <div className="item-meta">
              {it.addedBy || '—'} • {new Date(it.ts).toLocaleString()}
            </div>
            {isMember && (
              <button 
                className="btn btn-sm btn-danger" 
                onClick={() => handleRemoveItem(it.id)}
              >
                Odstranit
              </button>
            )}
          </li>
        ))}
        {itemsToShow.length === 0 && (
          <li className="empty">
            {items.length === 0 ? 'Zatím žádné položky' : 'Žádné položky k zobrazení'}
          </li>
        )}
      </ul>

      {/* Modal pro přidání položky */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Přidat položku</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="item-text">
                  Název položky:
                </label>
                <input
                  id="item-text"
                  type="text"
                  className="form-input"
                  placeholder="Co potřebujete koupit/udělat?"
                  value={itemValue}
                  onChange={(e) => setItemValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Zrušit
                </button>
                <button 
                  onClick={handleAddConfirm}
                  disabled={!itemValue.trim()}
                  className="btn btn-primary"
                >
                  Přidat položku
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}