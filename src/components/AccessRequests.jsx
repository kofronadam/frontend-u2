import React from 'react'
import { useApp } from '../context/AppContext'

export default function AccessRequests({ list }) {
  const { currentUser, approveAccessRequest, rejectAccessRequest } = useApp()
  
  const isOwner = list. owner === currentUser
  const requests = list.accessRequests || []

  if (!isOwner || requests.length === 0) {
    return null
  }

  return (
    <div className="access-requests-panel">
      <h3>Žádosti o přístup ({requests.length})</h3>
      {requests.map(request => (
        <div key={request. id} className="access-request-item">
          <div className="request-info">
            <strong>{request.username}</strong>
            <small>{new Date(request.timestamp).toLocaleString()}</small>
            <p>{request. message}</p>
          </div>
          <div className="request-actions">
            <button 
              onClick={() => approveAccessRequest(list.id, request. id)}
              className="approve-button"
            >
              Schválit
            </button>
            <button 
              onClick={() => rejectAccessRequest(list.id, request.id)}
              className="small-btn reject-button"
            >
              Zamítnout
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}