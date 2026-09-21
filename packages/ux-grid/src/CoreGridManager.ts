import { GridCanvasConfig, GridCategoryItem, GridItemConfig } from './types'

export class CoreGridManager<T extends GridItemConfig = GridItemConfig> {
  private items: T[]
  private itemOrder: string[]
  private hiddenItemIds: Set<string>

  constructor(initialItems: T[] = [], initialConfig?: GridCanvasConfig) {
    this.items = [...initialItems]
    this.itemOrder = initialConfig?.itemOrder ? [...initialConfig.itemOrder] : initialItems.map((i) => i.id)
    this.hiddenItemIds = new Set(initialConfig?.hiddenItems ?? [])
  }

  public setItems(items: T[]): void {
    this.items = [...items]
    const existingIds = new Set(this.items.map((i) => i.id))
    // Clean up order list of items that no longer exist
    this.itemOrder = this.itemOrder.filter((id) => existingIds.has(id))
    // Append any new item ids
    for (const item of this.items) {
      if (!this.itemOrder.includes(item.id)) {
        this.itemOrder.push(item.id)
      }
    }
  }

  public getSortedItems(categoryFilter?: string): T[] {
    const itemMap = new Map<string, T>()
    for (const item of this.items) {
      itemMap.set(item.id, item)
    }

    const sorted: T[] = []
    for (const id of this.itemOrder) {
      if (this.hiddenItemIds.has(id)) continue
      const item = itemMap.get(id)
      if (item) {
        if (!categoryFilter || categoryFilter === 'all' || item.category === categoryFilter) {
          sorted.push(item)
        }
      }
    }

    return sorted
  }

  public reorderItem(itemId: string, targetIndex: number): string[] {
    const currentIndex = this.itemOrder.indexOf(itemId)
    if (currentIndex === -1) return [...this.itemOrder]

    const [removed] = this.itemOrder.splice(currentIndex, 1)
    const clampedIndex = Math.max(0, Math.min(targetIndex, this.itemOrder.length))
    this.itemOrder.splice(clampedIndex, 0, removed)

    return [...this.itemOrder]
  }

  public toggleItemVisibility(itemId: string): boolean {
    if (this.hiddenItemIds.has(itemId)) {
      this.hiddenItemIds.delete(itemId)
      return true
    } else {
      this.hiddenItemIds.add(itemId)
      return false
    }
  }

  public extractCategories(): GridCategoryItem[] {
    const unique = Array.from(
      new Set(this.items.map((i) => i.category).filter((c): c is string => Boolean(c)))
    )

    if (unique.length === 0) return []

    return [
      { id: 'all', label: `Tout (${this.items.length})` },
      ...unique.map((cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ]
  }

  public serialize(): GridCanvasConfig {
    return {
      itemOrder: [...this.itemOrder],
      hiddenItems: Array.from(this.hiddenItemIds),
    }
  }
}
