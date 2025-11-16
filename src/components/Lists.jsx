import React, { useState } from 'react'

export default function Lists({ lists, selectedId, onSelect, onCreate, onRenameCurrent, onDeleteCurrent, currentList, currentUser, isOwner }) {
  const [newName, setNewName] = useState('')
  const [renameInput, setRenameInput] = useState('')

  return (
    <section style={{ marginTop: 14, marginBottom: 6 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select value={selectedId || ''} onChange={e => onSelect(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          {lists.map(l => (
            <option key={l.id} value={l.id}>
              {l.name} {l.owner ? ` (vlastník: ${l.owner})` : ''}
            </option>
          ))}
        </select>

        <input
          placeholder="Nový seznam — název"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onCreate(newName.trim())
              setNewName('')
            }
          }}
          style={{ padding: 8, borderRadius: 6, flex: 1 }}
        />
        <button onClick={() => { onCreate(newName.trim()); setNewName('') }} disabled={!newName.trim()}>
          Vytvořit
        </button>
      </div>

      {currentList && (
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Přejmenovat aktuální (pouze vlastník)"
            value={renameInput}
            onChange={e => setRenameInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && renameInput.trim()) {
                onRenameCurrent(renameInput.trim())
                setRenameInput('')
              }
            }}
            disabled={!isOwner}
            style={{ padding: 8, borderRadius: 6, flex: 1 }}
          />
          <button
            onClick={() => {
              if (!renameInput.trim()) return
              onRenameCurrent(renameInput.trim())
              setRenameInput('')
            }}
            disabled={!isOwner || !renameInput.trim()}
          >
            Přejmenovat
          </button>

          <button onClick={() => onDeleteCurrent()} className="danger" disabled={!isOwner}>
            Smazat seznam
          </button>
        </div>
      )}
    </section>
  )
}