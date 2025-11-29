import React, { useState } from 'react'
import Modal from './Modal'

export default function Members({ members, owner, currentUser, onAddMember, onRemoveMember, onTransferOwnership, isOwner }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [addValue, setAddValue] = useState('')

  function openAdd() {
    if (!isOwner) {
      alert('Pouze vlastník může přidávat členy.')
      return
    }
    setAddValue('')
    setShowAddModal(true)
  }

  function handleAddConfirm() {
    const v = (addValue || '').trim()
    if (!v) return
    onAddMember(v)
    setAddValue('')
    setShowAddModal(false)
  }

  return (
    <div className="members">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Členové</h3>
        <button onClick={openAdd} disabled={!isOwner} style={{ marginLeft: 12 }}>
          Přidat člena
        </button>
      </div>

      <ul>
        {members.map(name => (
          <li key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <span>
              {name} {owner === name && <strong style={{ color: '#444' }}></strong>}
            </span>
            <div className="member-controls">
              {isOwner && owner !== name && (
                <>
                  <button className="small-btn" onClick={() => onTransferOwnership(name)}>Převzít</button>
                  <button className="small-btn danger" onClick={() => onRemoveMember(name)}>Odebrat</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal pro přidání člena */}
      <Modal
        isOpen={showAddModal}
        title="Přidat člena"
        onClose={() => { setShowAddModal(false); setAddValue('') }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            autoFocus
            placeholder="Jméno člena"
            value={addValue}
            onChange={e => setAddValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddConfirm() }}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="small-btn" onClick={() => { setShowAddModal(false); setAddValue('') }}>Zrušit</button>
            <button onClick={handleAddConfirm} disabled={!addValue.trim()}>Přidat</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}