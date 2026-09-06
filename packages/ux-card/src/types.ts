export type CardThemeMode = 'pwa' | 'tv' | 'web'

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
  color?: string
  min?: number
  max?: number
}

export interface SquareCardConfig {
  id: string
  title: string
  subtitle?: string
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
  timestamp?: number | string
  relativeTime?: string
  themeMode?: CardThemeMode
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
  defaultViewMode?: CardViewMode
}
