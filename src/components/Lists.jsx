import React, { useState, useEffect } from 'react'
import Modal from './modal.jsx'

export default function Lists({
  lists,
  selectedId,
  onSelect,
  onCreate,
  onRenameCurrent,
  onDeleteCurrent,
  currentList,
  currentUser,
  isOwner
}) {
  const [newName, setNewName] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // nové stavy pro rename modal
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [renameValue, setRenameValue] = useState('')

  useEffect(() => {
    // když se změní currentList, nastavíme výchozí hodnotu pro rename modal
    if (currentList) setRenameValue(currentList.name || '')
    else setRenameValue('')
  }, [currentList])

  function openCreate() {
    if (!currentUser) {
      alert('Přihlas se, abys mohl vytvořit seznam.')
      return
    }
    setShowCreateModal(true)
  }

  function handleCreate() {
    const v = newName.trim()
    if (!v) return
    onCreate(v)
    setNewName('')
    setShowCreateModal(false)
  }

  function openRename() {
    if (!currentList) return
    if (!isOwner) {
      alert('Přejmenování může provádět pouze vlastník.')
      return
    }
    setRenameValue(currentList.name || '')
    setShowRenameModal(true)
  }

  function handleRenameConfirm() {
    const v = (renameValue || '').trim()
    if (!v) return
    onRenameCurrent(v)
    setShowRenameModal(false)
  }

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

        <button onClick={openCreate} disabled={!currentUser}>
          Vytvořit
        </button>
      </div>

      {currentList && (
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* tlačítko pro otevření rename modalu */}
          <button onClick={openRename} disabled={!isOwner}>
            Přejmenovat
          </button>

          <button onClick={() => onDeleteCurrent()} className="danger" disabled={!isOwner}>
            Smazat seznam
          </button>
        </div>
      )}

      {/* modal pro vytváření nového seznamu */}
      <Modal
        isOpen={showCreateModal}
        title="Vytvořit nový seznam"
        onClose={() => { setShowCreateModal(false); setNewName('') }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            autoFocus
            placeholder="Název nového seznamu"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCreate()
            }}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="small-btn" onClick={() => { setShowCreateModal(false); setNewName('') }}>Zrušit</button>
            <button onClick={handleCreate} disabled={!newName.trim()}>Vytvořit</button>
          </div>
        </div>
      </Modal>

      {/* modal pro přejmenování aktuálního seznamu */}
      <Modal
        isOpen={showRenameModal}
        title="Přejmenovat seznam"
        onClose={() => { setShowRenameModal(false); /* necháme renameValue */ }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            autoFocus
            placeholder="Nový název seznamu"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRenameConfirm()
            }}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="small-btn" onClick={() => setShowRenameModal(false)}>Zrušit</button>
            <button onClick={handleRenameConfirm} disabled={!renameValue.trim()}>Uložit</button>
          </div>
        </div>
      </Modal>
    </section>
  )
}