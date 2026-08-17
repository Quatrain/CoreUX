import { useState, useEffect } from 'react'
import { CoreDashboardCanvasManager, DashboardCanvasConfig } from '@quatrain/ux-card'

export function useDashboardCanvas(
  storageKey: string,
  initialConfig?: DashboardCanvasConfig
) {
  const [manager] = useState(() => {
    let saved: DashboardCanvasConfig | undefined = undefined
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(storageKey)
        if (raw) saved = JSON.parse(raw)
      } catch (e) {
        // Fallback to initial
      }
    }
    return new CoreDashboardCanvasManager(saved ?? initialConfig)
  })

  const [visibleCardIds, setVisibleCardIds] = useState<string[]>(() => manager.getVisibleCards())

  const reorder = (newOrder: string[]) => {
    manager.setCardOrder(newOrder)
    const updated = manager.getVisibleCards()
    setVisibleCardIds(updated)
    persist()
  }

  const toggleVisibility = (cardId: string) => {
    manager.toggleCardVisibility(cardId)
    const updated = manager.getVisibleCards()
    setVisibleCardIds(updated)
    persist()
  }

  const persist = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(manager.serialize()))
      } catch (e) {
        // Local storage full or unavailable
      }
    }
  }

  return {
    visibleCardIds,
    reorder,
    toggleVisibility,
  }
}
