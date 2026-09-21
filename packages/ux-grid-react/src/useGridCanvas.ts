import { useState, useCallback } from 'react'
import { GridCanvasConfig, GridViewMode } from '@quatrain/ux-grid'

export interface UseGridCanvasOptions {
  storageKey?: string
  initialConfig?: GridCanvasConfig
  defaultMode?: GridViewMode
}

export function useGridCanvas(options: UseGridCanvasOptions = {}) {
  const { storageKey, initialConfig, defaultMode = 'simplissime' } = options

  const [itemOrder, setItemOrder] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && storageKey && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(`${storageKey}_order`)
        if (raw) return JSON.parse(raw)
      } catch (e) {}
    }
    return initialConfig?.itemOrder ?? []
  })

  const [activeCategory, setActiveCategory] = useState<string>('all')

  const [activeMode, setActiveMode] = useState<GridViewMode>(() => {
    if (typeof window !== 'undefined' && storageKey && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(`${storageKey}_mode`)
        if (raw) return raw as GridViewMode
      } catch (e) {}
    }
    return defaultMode
  })

  const reorder = useCallback(
    (newOrder: string[]) => {
      setItemOrder(newOrder)
      if (typeof window !== 'undefined' && storageKey && window.localStorage) {
        try {
          window.localStorage.setItem(`${storageKey}_order`, JSON.stringify(newOrder))
        } catch (e) {}
      }
    },
    [storageKey]
  )

  const switchMode = useCallback(
    (mode: GridViewMode) => {
      setActiveMode(mode)
      if (typeof window !== 'undefined' && storageKey && window.localStorage) {
        try {
          window.localStorage.setItem(`${storageKey}_mode`, mode)
        } catch (e) {}
      }
    },
    [storageKey]
  )

  return {
    itemOrder,
    reorder,
    activeCategory,
    setActiveCategory,
    activeMode,
    switchMode,
  }
}
