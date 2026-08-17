import React, { useState } from 'react'
import { SquareCardConfig, CardThemeMode } from '@quatrain/ux-card'
import { SquareCard } from './SquareCard'

export interface DashboardGridProps {
  cards: SquareCardConfig[]
  themeMode?: CardThemeMode
  isEditable?: boolean
  onReorder?: (newOrder: string[]) => void
  onZoomCard?: (card: SquareCardConfig) => void
  onCardClick?: (card: SquareCardConfig) => void
  className?: string
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  cards,
  themeMode = 'web',
  isEditable = true,
  onReorder,
  onZoomCard,
  onCardClick,
  className = '',
}) => {
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    if (!isEditable) return
    setDraggedCardId(cardId)
    e.dataTransfer.setData('text/plain', cardId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditable) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetCardId: string) => {
    if (!isEditable || !draggedCardId || draggedCardId === targetCardId) return
    e.preventDefault()

    const currentOrder = cards.map((c) => c.id)
    const fromIndex = currentOrder.indexOf(draggedCardId)
    const toIndex = currentOrder.indexOf(targetCardId)

    if (fromIndex !== -1 && toIndex !== -1) {
      const newOrder = [...currentOrder]
      const [removed] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, removed)

      if (onReorder) {
        onReorder(newOrder)
      }
    }
    setDraggedCardId(null)
  }

  return (
    <div className={`q-dashboard-canvas q-theme-${themeMode} ${className}`}>
      {cards.map((card) => (
        <div
          key={card.id}
          className="q-dashboard-grid-item"
          draggable={isEditable}
          onDragStart={(e) => handleDragStart(e, card.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, card.id)}
        >
          <SquareCard
            config={{ ...card, themeMode }}
            onZoom={onZoomCard}
            onCardClick={onCardClick}
          />
        </div>
      ))}
    </div>
  )
}
