import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function AccessRequests({ list }) {
  const { currentUser, approveAccessRequest, rejectAccessRequest } = useApp()
  const [selectedRequest, setSelectedRequest] = useState(null)
  
  const isOwner = list.owner === currentUser
  const requests = list.accessRequests || []

  if (! isOwner || requests.length === 0) {
    return null
  }

  const handleApprove = (request) => {
    approveAccessRequest(list.id, request.id)
    setSelectedRequest(null)
  }

  const handleReject = (request) => {
    rejectAccessRequest(list.id, request.id)
    setSelectedRequest(null)
  }

  const openRequestDetail = (request) => {
    setSelectedRequest(request)
  }

  return (
    <div className="access-requests-panel">
      <h3 className="flex items-center gap-2 mb-4">
        <span className="text-yellow-600">🔔</span>
        Žádosti o přístup ({requests.length})
      </h3>
      
      <div className="space-y-3">
        {requests.map(request => (
          <div key={request.id} className="access-request-item">
            <div className="request-info">
              <div className="flex items-center gap-2 mb-1">
                <strong className="text-gray-900">{request.username}</strong>
                <span className="badge bg-gray-100 text-gray-600 text-xs">
                  {new Date(request.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {request.message || "Žádá o přístup k seznamu"}
              </p>
              
              <button 
                onClick={() => openRequestDetail(request)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Zobrazit detail →
              </button>
            </div>
            
            <div className="request-actions">
              <button 
                onClick={() => handleApprove(request)}
                className="btn btn-success btn-sm"
                title="Schválit žádost"
              >
                ✓
              </button>
              <button 
                onClick={() => handleReject(request)}
                className="btn btn-danger btn-sm"
                title="Zamítnout žádost"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal s detailem žádosti */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail žádosti o přístup</h3>
              <button 
                onClick={() => setSelectedRequest(null)} 
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-content-center text-xl">
                    👤
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedRequest.username}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedRequest.timestamp).toLocaleString('cs-CZ')}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Seznam:</strong> {list.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Současní členové:</strong> {list.members.length > 0 ? list.members. join(', ') : 'Žádní'}
                  </p>
                </div>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-900 mb-2">Zpráva od žadatele:</h5>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedRequest.message || "Žádný specifický vzkaz nebyl přiložen. "}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="btn btn-secondary"
                >
                  Zavřít
                </button>
                <button 
                  onClick={() => handleReject(selectedRequest)}
                  className="btn btn-danger"
                >
                  Zamítnout
                </button>
                <button 
                  onClick={() => handleApprove(selectedRequest)}
                  className="btn btn-success"
                >
                  Schválit žádost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}