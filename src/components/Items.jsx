import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

export default function Items({ list }) {
  const { currentUser, updateList } = useApp()
  const [filterUnresolved, setFilterUnresolved] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [itemValue, setItemValue] = useState('')

  const items = list.items || []
  const members = list.members || []
  const isOwner = list.owner === currentUser
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
      id:  Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: v,
      done: false,
      addedBy: currentUser,
      ts: Date.now()
    }
    
    updateList(list.id, {
      items: [... items, newItem]
    })
    
    setItemValue('')
    setShowAddModal(false)
  }

  function handleToggleDone(itemId, done) {
    updateList(list.id, {
      items: items.map(item => 
        item.id === itemId ? { ...item, done } : item
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

  const itemsToShow = items. filter(it => !filterUnresolved || !it.done)

  return (
    <section className="items">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent:  'space-between', marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Položky</h2>
        <button onClick={openAdd} disabled={!isMember}>Přidat položku</button>
      </div>

      <div className="filters" style={{ marginBottom: 8 }}>
        <label>
          <input 
            type="checkbox" 
            checked={filterUnresolved} 
            onChange={e => setFilterUnresolved(e.target.checked)} 
          />
          {' '}Zobrazit jen nevyřešené
        </label>
      </div>

      <ul className="items-list">
        {itemsToShow.map(it => (
          <li key={it.id} className={it.done ? 'done' : ''}>
            <input 
              type="checkbox" 
              checked={it.done} 
              onChange={e => handleToggleDone(it.id, e.target.checked)} 
            />
            <div className="item-text">{it.text}</div>
            <div className="item-meta">
              {it.addedBy || '—'} • {new Date(it.ts).toLocaleString()}
            </div>
            {isMember && (
              <button 
                className="small-btn danger" 
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

      <Modal
        isOpen={showAddModal}
        title="Přidat položku"
        onClose={() => { setShowAddModal(false); setItemValue('') }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            autoFocus
            placeholder="Název položky"
            value={itemValue}
            onChange={e => setItemValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddConfirm() }}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button 
              className="small-btn" 
              onClick={() => { setShowAddModal(false); setItemValue('') }}
            >
              Zrušit
            </button>
            <button 
              onClick={handleAddConfirm} 
              disabled={!itemValue.trim()}
            >
              Přidat
            </button>
          </div>
        </div>
      </Modal>
    </section>
  )
}