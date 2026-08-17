import React from 'react'
import { SquareCardConfig, CardSubMetric } from '@quatrain/ux-card'

export interface SquareCardProps {
  config: SquareCardConfig
  onZoom?: (config: SquareCardConfig) => void
  onCardClick?: (config: SquareCardConfig) => void
  className?: string
  style?: React.CSSProperties
}

export const SquareCard: React.FC<SquareCardProps> = ({
  config,
  onZoom,
  onCardClick,
  className = '',
  style,
}) => {
  const themeClass = config.themeMode ? `q-theme-${config.themeMode}` : ''

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(config)
    } else if (config.onClickUrl) {
      window.location.href = config.onClickUrl
    }
  }

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onZoom) {
      onZoom(config)
    }
  }

  const isInteractive = Boolean(config.isInteractive || config.onClickUrl || onCardClick)

  return (
    <article
      id={`card-${config.id}`}
      className={`q-square-card ${themeClass} ${isInteractive ? 'q-interactive' : ''} ${className}`}
      style={style}
      onClick={isInteractive ? handleCardClick : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      data-zoomable={config.isZoomable ? 'true' : undefined}
      data-zoom-type={config.zoomType ?? 'detail'}
    >
      {/* Zone 1 & 2: Header */}
      <header className="q-card-header">
        <div className="q-card-title-group">
          <span className="q-card-title">{config.title}</span>
          {config.sourceName && <span className="q-card-source">{config.sourceName}</span>}
        </div>
        <div className="q-card-header-actions">
          {config.isZoomable && (
            <button
              type="button"
              className="q-card-zoom-btn"
              title="Agrandir / Zoom"
              aria-label="Agrandir"
              onClick={handleZoomClick}
            >
              ⤢
            </button>
          )}
          {config.icon && <div className="q-card-icon-badge">{config.icon}</div>}
        </div>
      </header>

      {/* Zone 3 & 4: Body */}
      <div className="q-card-body">
        {config.isStacked && config.subMetrics && config.subMetrics.length > 0 ? (
          <div className="q-card-stacked-list">
            {config.subMetrics.map((sub: CardSubMetric) => (
              <div key={sub.id} className="q-card-stacked-item">
                <span className="q-card-stacked-label">{sub.label}</span>
                <strong className="q-card-stacked-val">
                  {sub.value} {sub.unit ?? ''}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          <>
            {config.extremes && (config.extremes.max !== undefined || config.extremes.min !== undefined) && (
              <div className="q-card-extremes">
                {config.extremes.max !== undefined && (
                  <span className="q-card-extreme-item q-card-extreme-max">
                    ▲ {config.extremes.max}{config.extremes.unit ?? config.unit ?? ''}
                  </span>
                )}
                {config.extremes.min !== undefined && (
                  <span className="q-card-extreme-item q-card-extreme-min">
                    ▼ {config.extremes.min}{config.extremes.unit ?? config.unit ?? ''}
                  </span>
                )}
              </div>
            )}
            <div className="q-card-main-metric">
              <span className="q-card-value">{config.primaryValue}</span>
              {config.unit && <span className="q-card-unit">{config.unit}</span>}
            </div>
          </>
        )}
      </div>

      {/* Zone 5 & 6: Footer */}
      <footer className="q-card-footer">
        <span className="q-card-time">{config.relativeTime ?? ''}</span>
        {config.interpretation && (
          <span
            className={`q-card-badge q-card-badge-${config.interpretation.status}`}
            style={config.interpretation.badgeColor ? { backgroundColor: config.interpretation.badgeColor } : undefined}
          >
            {config.interpretation.label}
          </span>
        )}
      </footer>
    </article>
  )
}
