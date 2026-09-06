import React, { useState, useMemo } from 'react'
import { GridItemConfig, GridThemeMode, GridViewMode, GridCategoryItem } from '@quatrain/ux-grid'
import { GridToolbar } from './GridToolbar'

export interface ResponsiveGridProps<T extends GridItemConfig = GridItemConfig> {
  items: T[]
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode
  themeMode?: GridThemeMode
  isEditable?: boolean
  defaultViewMode?: GridViewMode
  showToolbar?: boolean
  categories?: GridCategoryItem[]
  pinnedItemIds?: string[]
  onReorder?: (newOrder: string[]) => void
  onModeChange?: (mode: GridViewMode) => void
  className?: string
  style?: React.CSSProperties
  toolbarAddon?: React.ReactNode
}

export function ResponsiveGrid<T extends GridItemConfig = GridItemConfig>({
  items,
  renderItem,
  themeMode = 'web',
  isEditable = true,
  defaultViewMode = 'simplissime',
  showToolbar = true,
  categories,
  pinnedItemIds = [],
  onReorder,
  onModeChange,
  className = '',
  style,
  toolbarAddon,
}: ResponsiveGridProps<T>) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeMode, setActiveMode] = useState<GridViewMode>(defaultViewMode)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  // Auto-discover categories if not provided
  const resolvedCategories: GridCategoryItem[] = useMemo(() => {
    if (categories && categories.length > 0) return categories

    const unique = Array.from(
      new Set(items.map((i) => i.category).filter((c): c is string => Boolean(c)))
    )

    if (unique.length === 0) return []

    return [
      { id: 'all', label: `Tout (${items.length})` },
      ...unique.map((cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ]
  }, [categories, items])

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items
    return items.filter((i) => i.category === activeCategory)
  }, [items, activeCategory])

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isEditable) return
    setDraggedId(id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditable) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (!isEditable || !draggedId || draggedId === targetId) return
    e.preventDefault()

    const currentOrder = items.map((i) => i.id)
    const fromIndex = currentOrder.indexOf(draggedId)
    const toIndex = currentOrder.indexOf(targetId)

    if (fromIndex !== -1 && toIndex !== -1) {
      const newOrder = [...currentOrder]
      const [removed] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, removed)

      if (onReorder) {
        onReorder(newOrder)
      }
    }
    setDraggedId(null)
  }

  const handleModeToggle = (mode: GridViewMode) => {
    setActiveMode(mode)
    if (onModeChange) {
      onModeChange(mode)
    }
  }

  return (
    <div className={`q-grid-wrapper q-theme-${themeMode} ${className}`} style={style}>
      {showToolbar && (
        <GridToolbar
          activeMode={activeMode}
          onModeChange={handleModeToggle}
          categories={resolvedCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          pinnedCount={pinnedItemIds.length}
        >
          {toolbarAddon}
        </GridToolbar>
      )}

      <div className="q-grid-canvas">
        {filteredItems.map((item, index) => {
          const isDragging = draggedId === item.id

          return (
            <div
              key={item.id}
              className={`q-grid-item ${isDragging ? 'is-dragging' : ''}`}
              draggable={isEditable}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              {renderItem(item, index, isDragging)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
