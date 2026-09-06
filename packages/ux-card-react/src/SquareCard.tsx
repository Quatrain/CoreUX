import React from 'react'
import { SquareCardConfig, CardSubMetric, CardViewMode, CardSparklineConfig } from '@quatrain/ux-card'

export interface SquareCardProps {
  config: SquareCardConfig
  viewMode?: CardViewMode
  onToggleMode?: (cardId: string, currentMode: CardViewMode) => void
  onTogglePin?: (config: SquareCardConfig) => void
  onZoom?: (config: SquareCardConfig) => void
  onCardClick?: (config: SquareCardConfig) => void
  className?: string
  style?: React.CSSProperties
}

function getDomainDefaultColor(domain?: string): string {
  switch (domain) {
    case 'air':
      return '#0284c7'
    case 'sol':
      return '#b45309'
    case 'lumiere':
      return '#d97706'
    case 'sante':
      return '#6366f1'
    case 'risque':
      return '#e11d48'
    default:
      return '#3b82f6'
  }
}

function renderSparkline(
  sparklineData?: number[] | CardSparklineConfig,
  defaultColor = '#3b82f6',
  cardId = 'spark'
) {
  if (!sparklineData) return null
  const points = Array.isArray(sparklineData) ? sparklineData : sparklineData.points
  if (!points || points.length < 2) return null

  const color = (!Array.isArray(sparklineData) && sparklineData.color) || defaultColor
  const minVal = (!Array.isArray(sparklineData) && sparklineData.min !== undefined) ? sparklineData.min : Math.min(...points)
  const maxVal = (!Array.isArray(sparklineData) && sparklineData.max !== undefined) ? sparklineData.max : Math.max(...points)
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal

  const width = 84
  const height = 32
  const padding = 3

  const coords = points.map((val, idx) => {
    const x = padding + (idx / (points.length - 1)) * (width - 2 * padding)
    const y = height - padding - ((val - minVal) / range) * (height - 2 * padding)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const pathD = `M ${coords.join(' L ')}`
  const areaD = `${pathD} L ${(width - padding).toFixed(1)},${height} L ${padding},${height} Z`
  const gradId = `spark-grad-${cardId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <div className="q-card-sparkline-wrapper" title="Évolution récente">
      <svg viewBox={`0 0 ${width} ${height}`} className="q-card-sparkline-svg" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradId})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export const SquareCard: React.FC<SquareCardProps> = ({
  config,
  viewMode,
  onToggleMode,
  onTogglePin,
  onZoom,
  onCardClick,
  className = '',
  style,
}) => {
  const activeMode: CardViewMode = viewMode || config.viewMode || (config.extremes || config.subMetrics ? 'expert' : 'simplissime')
  const themeClass = config.themeMode ? `q-theme-${config.themeMode}` : ''
  const domainClass = config.domainCategory ? `q-domain-${config.domainCategory}` : ''
  const statusClass = config.interpretation?.status ? `status-${config.interpretation.status}` : 'status-neutral'
  const modeClass = `q-card-${activeMode}`

  const sparklineColor = getDomainDefaultColor(config.domainCategory)

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

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onTogglePin) {
      onTogglePin(config)
    }
  }

  const handleModeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleMode) {
      onToggleMode(config.id, activeMode)
    }
  }

  const isInteractive = Boolean(config.isInteractive || config.onClickUrl || onCardClick)

  return (
    <article
      id={`card-${config.id}`}
      className={`q-square-card ${themeClass} ${domainClass} ${modeClass} ${statusClass} ${isInteractive ? 'q-interactive' : ''} ${className}`}
      style={style}
      onClick={isInteractive ? handleCardClick : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      data-zoomable={config.isZoomable ? 'true' : undefined}
      data-zoom-type={config.zoomType ?? 'detail'}
      data-view-mode={activeMode}
    >
      {/* Zone 1 & 2: Header */}
      <header className="q-card-header">
        <div className="q-card-title-group">
          <div className="q-card-title-row">
            {config.icon && <span className="q-card-icon-badge" aria-hidden="true">{config.icon}</span>}
            <h3 className="q-card-title">{config.title}</h3>
          </div>
          {config.sourceName && <span className="q-card-source">{config.sourceName}</span>}
        </div>
        <div className="q-card-header-actions">
          {onTogglePin && (
            <button
              type="button"
              className={`q-card-action-btn q-card-pin-btn ${config.isPinned ? 'is-pinned' : ''}`}
              title={config.isPinned ? 'Désépingler' : 'Épingler'}
              aria-label="Épingler"
              onClick={handlePinClick}
            >
              {config.isPinned ? '⭐' : '📌'}
            </button>
          )}

          {onToggleMode && (
            <button
              type="button"
              className="q-card-action-btn q-card-mode-btn"
              title={`Basculer en mode ${activeMode === 'simplissime' ? 'Expert' : 'Simplissime'}`}
              aria-label="Changer de mode"
              onClick={handleModeClick}
            >
              {activeMode === 'simplissime' ? '📊' : '✨'}
            </button>
          )}

          {config.isZoomable && (
            <button
              type="button"
              className="q-card-zoom-btn q-card-action-btn"
              title="Agrandir / Zoom"
              aria-label="Agrandir"
              onClick={handleZoomClick}
            >
              ⤢
            </button>
          )}
        </div>
      </header>

      {/* Zone 3 & 4: Body */}
      <div className="q-card-body">
        {activeMode === 'simplissime' ? (
          <div className="q-card-simplissime-content">
            <div className="q-card-main-metric q-metric-simplissime">
              <span className="q-card-value">{config.primaryValue}</span>
              {config.unit && <span className="q-card-unit">{config.unit}</span>}
            </div>
            {config.actionTip ? (
              <p className="q-card-action-tip">💡 {config.actionTip}</p>
            ) : config.interpretation?.description ? (
              <p className="q-card-action-tip">ℹ️ {config.interpretation.description}</p>
            ) : null}
          </div>
        ) : config.isStacked && config.subMetrics && config.subMetrics.length > 0 ? (
          <div className="q-card-stacked-container">
            <div className="q-card-stacked-list">
              {config.subMetrics.map((sub: CardSubMetric) => {
                const numericVal = typeof sub.value === 'number' ? sub.value : parseFloat(String(sub.value))
                const barWidth = !isNaN(numericVal) ? Math.min(Math.max(numericVal, 5), 100) : null

                return (
                  <div key={sub.id} className="q-card-stacked-item">
                    <div className="q-card-stacked-header">
                      <span className="q-card-stacked-label">{sub.label}</span>
                      <strong className="q-card-stacked-val">
                        {sub.value}{sub.unit ? ` ${sub.unit}` : ''}
                      </strong>
                    </div>
                    {barWidth !== null && (
                      <div className="q-card-stacked-bar">
                        <div
                          className="q-card-stacked-fill"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: sparklineColor,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="q-card-expert-content">
            <div className="q-card-main-metric">
              <span className="q-card-value">{config.primaryValue}</span>
              {config.unit && <span className="q-card-unit">{config.unit}</span>}
            </div>
            {config.extremes && (config.extremes.max !== undefined || config.extremes.min !== undefined) && (
              <div className="q-card-extremes">
                {config.extremes.max !== undefined && (
                  <span className="q-card-extreme-item q-card-extreme-max" title="Maximum observé">
                    ▲ {config.extremes.max}{config.extremes.unit ?? config.unit ?? ''}
                  </span>
                )}
                {config.extremes.min !== undefined && (
                  <span className="q-card-extreme-item q-card-extreme-min" title="Minimum observé">
                    ▼ {config.extremes.min}{config.extremes.unit ?? config.unit ?? ''}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone 5 & 6: Footer */}
      <footer className="q-card-footer">
        <div className="q-card-footer-meta">
          {config.relativeTime && (
            <span className="q-card-time">⏱️ {config.relativeTime}</span>
          )}
          {config.interpretation && (
            <span
              className={`q-card-badge q-card-badge-${config.interpretation.status}`}
              style={config.interpretation.badgeColor ? { backgroundColor: config.interpretation.badgeColor } : undefined}
            >
              {config.interpretation.label}
            </span>
          )}
        </div>
        {renderSparkline(config.sparkline, sparklineColor, config.id)}
      </footer>
    </article>
  )
}
