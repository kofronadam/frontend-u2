import React from 'react'

export default function LoadingSpinner({ message = "Načítání..." }) {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  )
}