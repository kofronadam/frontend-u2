import React from 'react'

export default function ErrorMessage({ message, onRetry, className = "" }) {
  return (
    <div className={`error-message ${className}`}>
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-text">
          <p><strong>Chyba:</strong> {message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="error-actions">
          <button onClick={onRetry} className="btn btn-primary">
            Zkusit znovu
          </button>
        </div>
      )}
    </div>
  )
}