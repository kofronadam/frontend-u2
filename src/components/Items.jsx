import React, { useState } from 'react'
import Modal from './Modal'

export default function Items({ items, currentUser, members, onAddItem, onToggleDone, onRemoveItem }) {
  const [filterUnresolved, setFilterUnresolved] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [itemValue, setItemValue] = useState('')

  const isMember = currentUser && members.includes(currentUser)

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
    onAddItem(v)
    setItemValue('')
    setShowAddModal(false)
  }

  const itemsToShow = items.filter(it => !filterUnresolved || !it.done)

  return (
    <section className="items">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Položky</h2>
        <button onClick={openAdd} disabled={!isMember}>Přidat položku</button>
      </div>

      <div className="filters" style={{ marginBottom: 8 }}>
        <label>
          <input type="checkbox" checked={filterUnresolved} onChange={e => setFilterUnresolved(e.target.checked)} />
          {' '}Zobrazit jen nevyřešené
        </label>
      </div>

      <ul className="items-list">
        {itemsToShow.map(it => (
          <li key={it.id} className={it.done ? 'done' : ''}>
            <input type="checkbox" checked={it.done} onChange={e => onToggleDone(it.id, e.target.checked)} />
            <div className="item-text">{it.text}</div>
            <div className="item-meta">{it.addedBy || '—'} • {new Date(it.ts).toLocaleString()}</div>
            {isMember && <button className="small-btn danger" onClick={() => onRemoveItem(it.id)}>Odstranit</button>}
          </li>
        ))}
        {itemsToShow.length === 0 && <li className="empty">Žádné položky k zobrazení</li>}
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
            <button className="small-btn" onClick={() => { setShowAddModal(false); setItemValue('') }}>Zrušit</button>
            <button onClick={handleAddConfirm} disabled={!itemValue.trim()}>Přidat</button>
          </div>
        </div>
      </Modal>
    </section>
  )
}