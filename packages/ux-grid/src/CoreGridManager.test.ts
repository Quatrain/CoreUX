import { CoreGridManager } from './CoreGridManager'
import { GridItemConfig } from './types'

describe('CoreGridManager', () => {
  const sampleItems: GridItemConfig[] = [
    { id: 'item-1', category: 'metrics' },
    { id: 'item-2', category: 'charts' },
    { id: 'item-3', category: 'metrics' },
  ]

  test('initializes with default item order', () => {
    const manager = new CoreGridManager(sampleItems)
    const sorted = manager.getSortedItems()
    expect(sorted.map((i) => i.id)).toEqual(['item-1', 'item-2', 'item-3'])
  })

  test('reorders items properly', () => {
    const manager = new CoreGridManager(sampleItems)
    manager.reorderItem('item-3', 0)
    const sorted = manager.getSortedItems()
    expect(sorted.map((i) => i.id)).toEqual(['item-3', 'item-1', 'item-2'])
  })

  test('filters items by category', () => {
    const manager = new CoreGridManager(sampleItems)
    const metricsOnly = manager.getSortedItems('metrics')
    expect(metricsOnly.map((i) => i.id)).toEqual(['item-1', 'item-3'])
  })

  test('extracts unique categories', () => {
    const manager = new CoreGridManager(sampleItems)
    const categories = manager.extractCategories()
    expect(categories.map((c) => c.id)).toEqual(['all', 'metrics', 'charts'])
  })

  test('toggles item visibility and serializes state', () => {
    const manager = new CoreGridManager(sampleItems)
    const isNowVisible = manager.toggleItemVisibility('item-2')
    expect(isNowVisible).toBe(false)
    expect(manager.getSortedItems().map((i) => i.id)).toEqual(['item-1', 'item-3'])

    const serialized = manager.serialize()
    expect(serialized.hiddenItems).toEqual(['item-2'])
  })
})
