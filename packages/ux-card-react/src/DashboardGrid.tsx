import React, { useState, useMemo } from 'react'
import { SquareCardConfig, CardThemeMode, CardViewMode } from '@quatrain/ux-card'
import { SquareCard } from './SquareCard'

export interface DashboardCategoryItem {
  id: string
  label: string
}

export interface DashboardGridProps {
  cards: SquareCardConfig[]
  themeMode?: CardThemeMode
  isEditable?: boolean
  defaultViewMode?: CardViewMode
  showToolbar?: boolean
  categories?: DashboardCategoryItem[]
  pinnedCardIds?: string[]
  onReorder?: (newOrder: string[]) => void
  onTogglePin?: (card: SquareCardConfig) => void
  onZoomCard?: (card: SquareCardConfig) => void
  onCardClick?: (card: SquareCardConfig) => void
  className?: string
  style?: React.CSSProperties
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  cards,
  themeMode = 'web',
  isEditable = true,
  defaultViewMode = 'simplissime',
  showToolbar = true,
  categories,
  pinnedCardIds = [],
  onReorder,
  onTogglePin,
  onZoomCard,
  onCardClick,
  className = '',
  style,
}) => {
  const [globalMode, setGlobalMode] = useState<CardViewMode>(defaultViewMode)
  const [cardOverrides, setCardOverrides] = useState<Record<string, CardViewMode>>({})
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [zoomedCard, setZoomedCard] = useState<SquareCardConfig | null>(null)
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)

  // Auto-discover categories if not explicitly passed
  const resolvedCategories: DashboardCategoryItem[] = useMemo(() => {
    if (categories && categories.length > 0) return categories

    const uniqueCategories = Array.from(
      new Set(cards.map((c) => c.category).filter((c): c is string => Boolean(c)))
    )

    if (uniqueCategories.length === 0) return []

    return [
      { id: 'all', label: `Tout (${cards.length})` },
      ...uniqueCategories.map((cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ]
  }, [categories, cards])

  // Filtered cards by category
  const filteredCards = useMemo(() => {
    if (activeCategory === 'all') return cards
    return cards.filter((c) => c.category === activeCategory)
  }, [cards, activeCategory])

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

  const toggleCardMode = (cardId: string, currentMode: CardViewMode) => {
    const nextMode: CardViewMode = currentMode === 'simplissime' ? 'expert' : 'simplissime'
    setCardOverrides((prev) => ({ ...prev, [cardId]: nextMode }))
  }

  const handleZoom = (card: SquareCardConfig) => {
    setZoomedCard(card)
    if (onZoomCard) {
      onZoomCard(card)
    }
  }

  return (
    <div className={`q-dashboard-wrapper q-theme-${themeMode} ${className}`} style={style}>
      {/* Optional Toolbar with Mode switch and Category pills */}
      {showToolbar && (
        <div className="q-dashboard-toolbar">
          <div className="q-dashboard-toolbar-left">
            <div className="q-mode-toggle-group">
              <button
                type="button"
                className={`q-mode-toggle-btn ${globalMode === 'simplissime' ? 'active' : ''}`}
                onClick={() => {
                  setGlobalMode('simplissime')
                  setCardOverrides({})
                }}
                title="Mode Simplissime (Focus interprétation et conseil)"
              >
                ✨ Simplissime
              </button>
              <button
                type="button"
                className={`q-mode-toggle-btn ${globalMode === 'expert' ? 'active' : ''}`}
                onClick={() => {
                  setGlobalMode('expert')
                  setCardOverrides({})
                }}
                title="Mode Expert (Focus valeurs et extrêmes)"
              >
                📊 Expert
              </button>
            </div>

            {resolvedCategories.length > 0 && (
              <div className="q-category-filter-group">
                {resolvedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`q-category-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {pinnedCardIds.length > 0 && (
            <div className="q-dashboard-toolbar-right">
              <span className="q-pinned-counter">
                ⭐ {pinnedCardIds.length} épinglée{pinnedCardIds.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Grid Canvas */}
      <div className="q-dashboard-canvas">
        {filteredCards.map((card) => {
          const effectiveMode = cardOverrides[card.id] || card.viewMode || globalMode
          const isPinned = pinnedCardIds.includes(card.id) || Boolean(card.isPinned)

          return (
            <div
              key={card.id}
              className="q-dashboard-grid-item"
              draggable={isEditable}
              onDragStart={(e) => handleDragStart(e, card.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, card.id)}
            >
              <SquareCard
                config={{ ...card, isPinned, themeMode }}
                viewMode={effectiveMode}
                onToggleMode={toggleCardMode}
                onTogglePin={onTogglePin}
                onZoom={handleZoom}
                onCardClick={onCardClick}
              />
            </div>
          )
        })}
      </div>

      {/* Zoom Modal Overlay */}
      {zoomedCard && (
        <div className="q-zoom-modal-overlay" onClick={() => setZoomedCard(null)}>
          <div className="q-zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="q-zoom-modal-header">
              <h3>{zoomedCard.zoomTitle || zoomedCard.title}</h3>
              <button
                type="button"
                className="q-zoom-modal-close"
                onClick={() => setZoomedCard(null)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </header>
            <div className="q-zoom-modal-body">
              <div className="q-zoom-modal-preview">
                <SquareCard
                  config={zoomedCard}
                  viewMode="expert"
                  className="q-zoom-card-instance"
                />
              </div>
              {zoomedCard.actionTip && (
                <div className="q-zoom-modal-tip">
                  <strong>Conseil : </strong>
                  <span>{zoomedCard.actionTip}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
