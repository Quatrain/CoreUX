import React, { useEffect } from 'react'

export interface GridModalProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children?: React.ReactNode
  className?: string
}

export const GridModal: React.FC<GridModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  className = '',
}) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={`q-grid-modal-overlay ${className}`} onClick={onClose}>
      <div className="q-grid-modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="q-grid-modal-header">
          {title && <h3>{title}</h3>}
          <button
            type="button"
            className="q-grid-modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </header>
        <div className="q-grid-modal-body">{children}</div>
      </div>
    </div>
  )
}
