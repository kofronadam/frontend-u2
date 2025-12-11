import React from 'react'

export default function MembersSimple({ list }) {
  return (
    <div className="members">
      <h3>Členové</h3>
      <p>Vlastník: {list.owner}</p>
      <ul>
        {list.members?.map(member => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  )
}