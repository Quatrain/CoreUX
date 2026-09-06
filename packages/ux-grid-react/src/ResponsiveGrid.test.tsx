import React from 'react'
import { renderToString } from 'react-dom/server'
import { ResponsiveGrid } from './ResponsiveGrid'
import { GridItemConfig } from '@quatrain/ux-grid'

describe('ResponsiveGrid React Decorator', () => {
  const items: GridItemConfig[] = [
    { id: '1', title: 'Card 1', category: 'parcelles' },
    { id: '2', title: 'Card 2', category: 'sondes' },
  ]

  test('renders grid container and items into markup', () => {
    const html = renderToString(
      <ResponsiveGrid
        items={items}
        renderItem={(item) => <div className="test-card">{item.id}</div>}
      />
    )

    expect(html).toContain('q-grid-wrapper')
    expect(html).toContain('q-grid-canvas')
    expect(html).toContain('test-card')
    expect(html).toContain('Simplissime')
    expect(html).toContain('Expert')
  })
})
