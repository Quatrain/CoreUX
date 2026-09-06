import React from 'react'
import { GridCategoryItem, GridViewMode } from '@quatrain/ux-grid'

export interface GridToolbarProps {
  activeMode?: GridViewMode
  onModeChange?: (mode: GridViewMode) => void
  categories?: GridCategoryItem[]
  activeCategory?: string
  onCategoryChange?: (categoryId: string) => void
  pinnedCount?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export const GridToolbar: React.FC<GridToolbarProps> = ({
  activeMode = 'simplissime',
  onModeChange,
  categories = [],
  activeCategory = 'all',
  onCategoryChange,
  pinnedCount,
  className = '',
  style,
  children,
}) => {
  return (
    <div className={`q-grid-toolbar ${className}`} style={style}>
      <div className="q-grid-toolbar-left">
        {onModeChange && (
          <div className="q-grid-mode-group">
            <button
              type="button"
              className={`q-grid-mode-btn ${activeMode === 'simplissime' ? 'active' : ''}`}
              onClick={() => onModeChange('simplissime')}
              title="Mode Simplissime"
            >
              ✨ Simplissime
            </button>
            <button
              type="button"
              className={`q-grid-mode-btn ${activeMode === 'expert' ? 'active' : ''}`}
              onClick={() => onModeChange('expert')}
              title="Mode Expert"
            >
              📊 Expert
            </button>
          </div>
        )}

        {categories.length > 0 && onCategoryChange && (
          <div className="q-grid-category-group">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`q-grid-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {children}
      </div>

      {pinnedCount !== undefined && pinnedCount > 0 && (
        <div className="q-grid-toolbar-right">
          <span className="q-grid-counter">
            ⭐ {pinnedCount} épinglé{pinnedCount > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
