import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

export default function Members({ list }) {
  const { currentUser, updateList } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [addValue, setAddValue] = useState('')

  const isOwner = list.owner === currentUser
  const members = list.members || []
  const owner = list.owner

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
    
    // Kontrola, zda člen už není v seznamu
    if (members.includes(v)) {
      alert('Tento člen už je v seznamu.')
      return
    }
    
    updateList(list.id, {
      members: [... members, v]
    })
    
    setAddValue('')
    setShowAddModal(false)
  }

  function handleRemoveMember(memberName) {
    if (!isOwner) {
      alert('Pouze vlastník může odebírat členy.')
      return
    }
    
    if (window.confirm(`Opravdu chcete odebrat člena ${memberName}?`)) {
      updateList(list.id, {
        members: members.filter(m => m !== memberName)
      })
    }
  }

  function handleTransferOwnership(newOwner) {
    if (!isOwner) {
      alert('Pouze vlastník může převádět vlastnictví.')
      return
    }
    
    if (window.confirm(`Opravdu chcete převést vlastnictví na ${newOwner}?`)) {
      updateList(list.id, {
        owner: newOwner
      })
    }
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
              {name} {owner === name && <strong style={{ color: '#444' }}>(vlastník)</strong>}
            </span>
            <div className="member-controls">
              {isOwner && owner !== name && (
                <>
                  <button className="small-btn" onClick={() => handleTransferOwnership(name)}>Převést</button>
                  <button className="small-btn danger" onClick={() => handleRemoveMember(name)}>Odebrat</button>
                </>
              )}
            </div>
          </li>
        ))}
        {members.length === 0 && (
          <li style={{ color: '#666', fontStyle: 'italic' }}>
            Žádní členové
          </li>
        )}
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
            <button onClick={handleAddConfirm} disabled={! addValue.trim()}>Přidat</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}