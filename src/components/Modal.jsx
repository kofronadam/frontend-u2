import React from 'react'

export default function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        {title && <div className="modal-header"><h3>{title}</h3></div>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}