export type GridThemeMode = 'pwa' | 'tv' | 'web'

export type GridViewMode = 'simplissime' | 'expert' | string

export interface GridCategoryItem {
  id: string
  label: string
}

export interface GridItemConfig {
  id: string
  category?: string
  isPinned?: boolean
  colSpan?: number
  rowSpan?: number
  [key: string]: any
}

export interface GridCanvasConfig {
  id?: string
  title?: string
  itemOrder: string[]
  hiddenItems?: string[]
  defaultViewMode?: GridViewMode
  themeMode?: GridThemeMode
}

export interface GridReorderEvent {
  fromIndex: number
  toIndex: number
  itemId: string
  newOrder: string[]
}
