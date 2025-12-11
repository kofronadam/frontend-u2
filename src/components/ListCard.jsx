import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ListCard({ list }) {
  const { currentUser, deleteList, canDeleteList } = useApp()

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Opravdu chcete smazat seznam "${list.name}"?`)) {
      deleteList(list.id)
    }
  }

  const isOwner = list.owner === currentUser
  const isMember = list.members.includes(currentUser)
  const itemsCount = list. items?.length || 0
  const completedCount = list. items?.filter(item => item.resolved)?.length || 0

  return (
    <Link to={`/list/${list.id}`} className="list-card">
      <div className="list-card-header">
        <h3>{list.name}</h3>
        {canDeleteList(list) && (
          <button 
            onClick={handleDelete}
            className="delete-button"
            title="Smazat seznam"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="list-card-info">
        <div className="owner">
          Vlastník: {list.owner || 'Neznámý'}
        </div>
        
        {list.members.length > 0 && (
          <div className="members">
            Členové: {list.members.join(', ')}
          </div>
        )}
        
        <div className="progress">
          {completedCount}/{itemsCount} položek dokončeno
        </div>
        
        <div className="access-info">
          {isOwner && <span className="badge owner-badge">Vlastník</span>}
          {isMember && <span className="badge member-badge">Člen</span>}
        </div>
      </div>
    </Link>
  )
}