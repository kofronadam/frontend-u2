import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

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
        members:  members.filter(m => m !== memberName)
      })
    }
  }

  function handleTransferOwnership(newOwner) {
    if (!isOwner) {
      alert('Pouze vlastník může převádět vlastnictví.')
      return
    }
    
    if (window. confirm(`Opravdu chcete převést vlastnictví na ${newOwner}?`)) {
      updateList(list.id, {
        owner: newOwner
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddConfirm()
    }
  }

  return (
    <div className="members">
      <div className="flex items-center justify-between mb-4">
        <h3 className="mb-0">Členové</h3>
        <button 
          onClick={openAdd} 
          disabled={!isOwner}
          className="btn btn-primary btn-sm"
        >
          Přidat člena
        </button>
      </div>

      <ul>
        {members. map(name => (
          <li key={name} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-gray-900">
              {name} {owner === name && <strong className="text-gray-600">(vlastník)</strong>}
            </span>
            <div className="member-controls flex gap-2">
              {isOwner && owner !== name && (
                <>
                  <button 
                    className="btn-sm btn-success" 
                    onClick={() => handleTransferOwnership(name)}
                  >
                    Převést
                  </button>
                  <button 
                    className="btn-sm btn-danger" 
                    onClick={() => handleRemoveMember(name)}
                  >
                    Odebrat
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
        {members.length === 0 && (
          <li className="text-gray-500 italic py-4 text-center">
            Žádní členové
          </li>
        )}
      </ul>

      {/* Modal pro přidání člena */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Přidat člena</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="member-name">
                  Jméno člena: 
                </label>
                <input
                  id="member-name"
                  type="text"
                  className="form-input"
                  placeholder="Zadejte jméno člena"
                  value={addValue}
                  onChange={(e) => setAddValue(e. target.value)}
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
                  disabled={!addValue. trim()}
                  className="btn btn-primary"
                >
                  Přidat člena
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}