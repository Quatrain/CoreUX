import React, { useState } from 'react'
import { SquareCardConfig, CardThemeMode, CardViewMode } from '@quatrain/ux-card'
import { ResponsiveGrid, GridCategoryItem, GridModal } from '@quatrain/ux-grid-react'
import { SquareCard } from './SquareCard'
import '@quatrain/ux-grid-react/dist/styles/grid.css'

export interface DashboardGridProps {
  cards: SquareCardConfig[]
  themeMode?: CardThemeMode
  isEditable?: boolean
  defaultViewMode?: CardViewMode
  showToolbar?: boolean
  categories?: GridCategoryItem[]
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
  const [zoomedCard, setZoomedCard] = useState<SquareCardConfig | null>(null)

  const toggleCardMode = (cardId: string, currentMode: CardViewMode) => {
    const nextMode: CardViewMode = currentMode === 'simplissime' ? 'expert' : 'simplissime'
    setCardOverrides((prev) => ({ ...prev, [cardId]: nextMode }))
  }

  const handleZoom = (card: SquareCardConfig) => {
    setZoomedCard(card)
    if (onZoomCard) onZoomCard(card)
  }

  return (
    <>
      <ResponsiveGrid
        items={cards}
        themeMode={themeMode}
        isEditable={isEditable}
        defaultViewMode={defaultViewMode}
        showToolbar={showToolbar}
        categories={categories}
        pinnedItemIds={pinnedCardIds}
        onReorder={onReorder}
        onModeChange={(m) => {
          setGlobalMode(m as CardViewMode)
          setCardOverrides({})
        }}
        className={className}
        style={style}
        renderItem={(card) => {
          const effectiveMode = cardOverrides[card.id] || card.viewMode || globalMode
          const isPinned = pinnedCardIds.includes(card.id) || Boolean(card.isPinned)

          return (
            <SquareCard
              config={{ ...card, isPinned, themeMode }}
              viewMode={effectiveMode}
              onToggleMode={toggleCardMode}
              onTogglePin={onTogglePin}
              onZoom={handleZoom}
              onCardClick={onCardClick}
            />
          )
        }}
      />

      <GridModal
        isOpen={Boolean(zoomedCard)}
        title={zoomedCard?.zoomTitle || zoomedCard?.title}
        onClose={() => setZoomedCard(null)}
      >
        {zoomedCard && (
          <>
            <div className="q-zoom-modal-preview">
              <SquareCard config={zoomedCard} viewMode="expert" className="q-zoom-card-instance" />
            </div>
            {zoomedCard.actionTip && (
              <div className="q-zoom-modal-tip">
                <strong>Conseil : </strong>
                <span>{zoomedCard.actionTip}</span>
              </div>
            )}
          </>
        )}
      </GridModal>
    </>
  )
}
