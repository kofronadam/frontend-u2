import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProgressDonut from './ProgressDonut'
import { useTranslation } from 'react-i18next'


export default function ListCard({ list }) {
  const { currentUser, deleteList, canDeleteList } = useApp()
  const { t } = useTranslation()

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Opravdu chcete smazat seznam "${list.name}"?`)) {
      deleteList(list.id)
    }
  }

  const isOwner = list.owner === currentUser
  const isMember = list.members.includes(currentUser)
  const itemsCount = list.items?.length || 0
  const completedCount = list.items?.filter(item => item.done)?.length || 0

  return (
    <Link to={`/list/${list.id}`} className="list-card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ flex: '0 0 auto' }}>
        <ProgressDonut done={completedCount} total={itemsCount} size={64} />
      </div>

      <div style={{ flex: 1 }}>
        <div className="list-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <h3 style={{ margin: 0 }}>{list.name}</h3>
          {canDeleteList(list) && (
            <button onClick={handleDelete} className="delete-button" title="Smazat seznam">×</button>
          )}
        </div>
        <div className="list-card-info">
          <div className="owner">{t('owner')}: {list.owner || '—'}</div>
          <div className="progress">{t('items_done', { done: completedCount, total: itemsCount })}</div>
        </div>
      </div>
    </Link>
  )
}