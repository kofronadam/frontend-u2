import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function NotificationBell() {
  const { getUnreadNotifications, approveAccessRequest, rejectAccessRequest, markNotificationAsRead } = useApp()
  const [showNotifications, setShowNotifications] = useState(false)
  
  const notifications = getUnreadNotifications()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notification-bell">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="bell-button"
      >
        🔔 {notifications.length}
      </button>
      
      {showNotifications && (
        <div className="notifications-dropdown">
          <h3>Notifikace</h3>
          {notifications.map(notification => (
            <div key={notification.id} className="notification-item">
              <div className="notification-content">
                <strong>{notification.fromUser}</strong> žádá o přístup k seznamu 
                <strong> {notification.listName}</strong>
                <p>{notification. message}</p>
                <small>{new Date(notification.timestamp).toLocaleString()}</small>
              </div>
              <div className="notification-actions">
                <button 
                  onClick={() => {
                    approveAccessRequest(notification. listId, 
                      // Najít request ID
                      (() => {
                        const list = window.appContext.lists.find(l => l.id === notification.listId)
                        const request = (list?.accessRequests || []).find(r => r.username === notification.fromUser)
                        return request?. id
                      })()
                    )
                    markNotificationAsRead(notification.id)
                  }}
                  className="approve-button small"
                >
                  Schválit
                </button>
                <button 
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="dismiss-button small"
                >
                  Označit jako přečtené
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}