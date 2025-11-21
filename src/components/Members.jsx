import React, { useState } from 'react'

export default function Members({ members, owner, currentUser, onAddMember, onRemoveMember, onTransferOwnership, isOwner }) {
  const [memberInput, setMemberInput] = useState('')

  return (
    <div className="members">
      <h3>Členové</h3>
      <ul>
        {members.map(name => (
          <li key={name}>
            <span>
              {name} {owner === name && <strong style={{ color: '#444' }}>(vlastník)</strong>}
            </span>
            <div className="member-controls">
              {isOwner && owner !== name && (
                <>
                  <button className="small-btn" onClick={() => onTransferOwnership(name)}>Předat</button>
                  <button className="small-btn danger" onClick={() => onRemoveMember(name)}>Odebrat</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="member-add">
        <input
          placeholder="Přidat člena"
          value={memberInput}
          onChange={e => setMemberInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onAddMember(memberInput.trim())
              setMemberInput('')
            }
          }}
          disabled={!isOwner}
        />
        <button onClick={() => { onAddMember(memberInput.trim()); setMemberInput('') }} disabled={!isOwner || !memberInput.trim()}>
          Přidat
        </button>
      </div>
    </div>
  )
}