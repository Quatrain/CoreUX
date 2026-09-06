export type CardThemeMode = 'pwa' | 'tv' | 'web'

export type CardPaletteMode = 'pastel' | 'vivid' | string

export type CardViewMode = 'simplissime' | 'expert'

export type CardDataSourceType = 'plot' | 'probe' | 'sensor' | string

export type CardStatusLevel = 'optimal' | 'warning' | 'alert' | 'info' | 'neutral'

export interface CardInterpretation {
  label: string
  status: CardStatusLevel
  badgeColor?: string
  description?: string
}

export interface CardExtremes {
  max?: number
  min?: number
  unit?: string
  maxLabel?: string
  minLabel?: string
}

export interface CardSubMetric {
  id: string
  label: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  status?: CardStatusLevel
}

export type CardDomainCategory = 'air' | 'sol' | 'lumiere' | 'sante' | 'risque' | string

export interface CardSparklineConfig {
  points: number[]
  forecastPoints?: number[]
  color?: string
  forecastColor?: string
  min?: number
  max?: number
}

export interface CardGaugeZone {
  from: number
  to: number
  color: string
  label?: string
}

export interface CardGaugeConfig {
  min: number
  max: number
  current?: number
  unit?: string
  zones?: CardGaugeZone[]
  showExtremes?: boolean
}

export interface SquareCardConfig {
  id: string
  title: string
  subtitle?: string
  scopeName?: string
  scopeType?: 'plot' | 'production' | 'batch' | 'site' | 'zone' | string
  scopeIcon?: string
  sourceType?: CardDataSourceType
  sourceName?: string
  category?: string
  domainCategory?: CardDomainCategory
  icon?: string
  primaryValue: number | string
  unit?: string
  extremes?: CardExtremes
  interpretation?: CardInterpretation
  actionTip?: string
  viewMode?: CardViewMode
  subMetrics?: CardSubMetric[]
  sparkline?: number[] | CardSparklineConfig
  gauge?: CardGaugeConfig
  timestamp?: number | string
  relativeTime?: string
  themeMode?: CardThemeMode
  palette?: CardPaletteMode
  isStacked?: boolean
  isInteractive?: boolean
  isPinned?: boolean
  isZoomable?: boolean
  zoomType?: 'map' | 'chart' | 'detail' | string
  zoomTitle?: string
  zoomPayload?: any
  onClickUrl?: string
}

export interface DashboardCanvasConfig {
  id?: string
  title?: string
  cardOrder: string[]
  hiddenCards?: string[]
  themeMode?: CardThemeMode
  palette?: CardPaletteMode
  defaultViewMode?: CardViewMode
}
