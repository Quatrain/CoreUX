import React from 'react'
import { SquareCardConfig, CardSubMetric, CardViewMode, CardSparklineConfig, CardGaugeConfig } from '@quatrain/ux-card'

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

function renderGauge(
  gauge: CardGaugeConfig,
  primaryValue: number | string,
  unit?: string,
  domainColor = '#3b82f6'
) {
  const currentVal = typeof gauge.current === 'number' ? gauge.current : parseFloat(String(primaryValue))
  const min = gauge.min
  const max = gauge.max
  const range = max - min === 0 ? 1 : max - min
  const ratio = Math.max(0, Math.min(1, (currentVal - min) / range))

  const radius = 38
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference * (1 - ratio)

  // Determine active zone or color
  let activeColor = domainColor
  if (gauge.zones && gauge.zones.length > 0) {
    for (const zone of gauge.zones) {
      if (currentVal >= zone.from && currentVal <= zone.to) {
        activeColor = zone.color
        break
      }
    }
  }

  const angleRad = Math.PI - ratio * Math.PI
  const dotX = 50 + radius * Math.cos(angleRad)
  const dotY = 48 - radius * Math.sin(angleRad)

  return (
    <div className="q-card-gauge-wrapper">
      <svg viewBox="0 0 100 58" className="q-card-gauge-svg" aria-hidden="true">
        {/* Background Track */}
        <path
          d="M 12 48 A 38 38 0 0 1 88 48"
          fill="none"
          stroke="rgba(0, 0, 0, 0.08)"
          strokeWidth="7.5"
          strokeLinecap="round"
        />

        {/* Optional Zone Segments */}
        {gauge.zones &&
          gauge.zones.map((zone, idx) => {
            const zStartRatio = Math.max(0, Math.min(1, (zone.from - min) / range))
            const zEndRatio = Math.max(0, Math.min(1, (zone.to - min) / range))
            const zLength = (zEndRatio - zStartRatio) * circumference
            const zOffset = circumference * (1 - zStartRatio)
            return (
              <path
                key={idx}
                d="M 12 48 A 38 38 0 0 1 88 48"
                fill="none"
                stroke={zone.color}
                strokeWidth="7.5"
                strokeDasharray={`${zLength.toFixed(1)} ${circumference.toFixed(1)}`}
                strokeDashoffset={zOffset.toFixed(1)}
                opacity="0.30"
              />
            )
          })}

        {/* Progress Arc */}
        <path
          d="M 12 48 A 38 38 0 0 1 88 48"
          fill="none"
          stroke={activeColor}
          strokeWidth="7.5"
          strokeDasharray={circumference.toFixed(1)}
          strokeDashoffset={strokeDashoffset.toFixed(1)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />

        {/* Needle Dot Cursor */}
        <circle
          cx={dotX.toFixed(1)}
          cy={dotY.toFixed(1)}
          r="4"
          fill="#ffffff"
          stroke={activeColor}
          strokeWidth="2.5"
        />
      </svg>

      {/* Center Value */}
      <div className="q-card-gauge-center">
        <span className="q-card-value">{primaryValue}</span>
        {unit && <span className="q-card-unit">{unit}</span>}
      </div>

      {/* Extremes / Bounds */}
      <div className="q-card-gauge-bounds">
        <span className="q-card-gauge-bound q-card-gauge-min">{gauge.min}{gauge.unit ?? unit ?? ''}</span>
        <span className="q-card-gauge-bound q-card-gauge-max">{gauge.max}{gauge.unit ?? unit ?? ''}</span>
      </div>
    </div>
  )
}

function renderSparkline(
  sparklineData?: number[] | CardSparklineConfig,
  defaultColor = '#3b82f6',
  cardId = 'spark'
) {
  if (!sparklineData) return null
  const isConfig = !Array.isArray(sparklineData)
  const historyPoints = isConfig ? sparklineData.points : sparklineData
  const forecastPoints = isConfig ? (sparklineData.forecastPoints ?? []) : []

  if (!historyPoints || historyPoints.length === 0) return null
  const allPoints = [...historyPoints, ...forecastPoints]
  if (allPoints.length < 2) return null

  const color = (isConfig && sparklineData.color) || defaultColor
  const forecastColor = (isConfig && sparklineData.forecastColor) || color

  const minVal = (isConfig && sparklineData.min !== undefined) ? sparklineData.min : Math.min(...allPoints)
  const maxVal = (isConfig && sparklineData.max !== undefined) ? sparklineData.max : Math.max(...allPoints)
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal

  const width = 76
  const height = 28
  const padding = 2

  const totalCount = allPoints.length
  const coords = allPoints.map((val, idx) => {
    const x = padding + (idx / (totalCount - 1)) * (width - 2 * padding)
    const y = height - padding - ((val - minVal) / range) * (height - 2 * padding)
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) }
  })

  // History path (solid)
  const historyCoords = coords.slice(0, historyPoints.length)
  const historyPathD = `M ${historyCoords.map((c) => `${c.x},${c.y}`).join(' L ')}`

  // Forecast path (dashed): connects last history point to the end
  let forecastPathD = ''
  if (forecastPoints.length > 0) {
    const forecastCoords = coords.slice(historyPoints.length - 1)
    forecastPathD = `M ${forecastCoords.map((c) => `${c.x},${c.y}`).join(' L ')}`
  }

  const gradId = `spark-grad-${cardId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const allCoords = coords.map((c) => `${c.x},${c.y}`).join(' L ')
  const areaD = `M ${allCoords} L ${(width - padding).toFixed(1)},${height} L ${padding},${height} Z`

  return (
    <div
      className="q-card-sparkline-wrapper"
      title={forecastPoints.length > 0 ? "Historique (plein) & Prévisions (pointillé)" : "Évolution récente"}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="q-card-sparkline-svg" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.30" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradId})`} />
        {/* Solid historical line */}
        <path d={historyPathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dashed forecast line */}
        {forecastPathD && (
          <path
            d={forecastPathD}
            fill="none"
            stroke={forecastColor}
            strokeWidth="2.2"
            strokeDasharray="3 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        )}
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
          {(config.scopeName || config.sourceName) && (
            <div className="q-card-scope-row">
              {config.scopeName ? (
                <span className="q-card-scope-badge" title={config.scopeName}>
                  <span className="q-card-scope-icon" aria-hidden="true">
                    {config.scopeIcon ?? (config.scopeType === 'production' ? '🏭' : '🌱')}
                  </span>
                  <span className="q-card-scope-text">{config.scopeName}</span>
                </span>
              ) : config.sourceType === 'plot' || config.sourceType === 'production' ? (
                <span className="q-card-scope-badge" title={config.sourceName}>
                  <span className="q-card-scope-icon" aria-hidden="true">
                    {config.scopeIcon ?? (config.sourceType === 'production' ? '🏭' : '🌱')}
                  </span>
                  <span className="q-card-scope-text">{config.sourceName}</span>
                </span>
              ) : null}

              {config.sourceName && (config.scopeName || (config.sourceType !== 'plot' && config.sourceType !== 'production')) && (
                <span className="q-card-source-tag" title={config.sourceName}>
                  {config.sourceName}
                </span>
              )}
            </div>
          )}
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
        {config.gauge ? (
          <div className="q-card-gauge-container">
            {renderGauge(config.gauge, config.primaryValue, config.unit, sparklineColor)}
            {activeMode === 'simplissime' && config.actionTip && (
              <p className="q-card-action-tip" style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                💡 {config.actionTip}
              </p>
            )}
          </div>
        ) : activeMode === 'simplissime' ? (
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
