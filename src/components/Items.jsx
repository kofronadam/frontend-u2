import React, { useState } from 'react'

export default function Items({ items, currentUser, members, onAddItem, onToggleDone, onRemoveItem }) {
  const [itemInput, setItemInput] = useState('')
  const [filterUnresolved, setFilterUnresolved] = useState(false)

  const isMember = currentUser && members.includes(currentUser)

  const itemsToShow = items.filter(it => !filterUnresolved || !it.done)

  return (
    <section className="items">
      <h2>Položky</h2>

      <div className="item-add">
        <input
          placeholder="Přidat položku..."
          value={itemInput}
          onChange={e => setItemInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (!isMember) {
                alert('Musíš být členem seznamu, abys přidal položku.')
                return
              }
              onAddItem(itemInput.trim())
              setItemInput('')
            }
          }}
          disabled={!isMember}
        />
        <button onClick={() => { if (isMember) { onAddItem(itemInput.trim()); setItemInput('') } else alert('Pouze člen může přidávat položky') }} disabled={!isMember || !itemInput.trim()}>
          Přidat
        </button>
      </div>

      <div className="filters">
        <label><input type="checkbox" checked={filterUnresolved} onChange={e => setFilterUnresolved(e.target.checked)} /> Zobrazit jen nevyřešené</label>
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
    </section>
  )
}