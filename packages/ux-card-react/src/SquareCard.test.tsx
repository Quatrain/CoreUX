import { describe, expect, test } from 'bun:test'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { SquareCard } from './SquareCard'
import { SquareCardConfig } from '@quatrain/ux-card'

describe('SquareCard React Decorator', () => {
  test('renders temperature card markup to string correctly', () => {
    const config: SquareCardConfig = {
      id: 'temp-1',
      title: 'Air : Température',
      sourceName: 'Parcelle Les Vignes',
      icon: '☀️',
      primaryValue: '24.5',
      unit: '°C',
      extremes: {
        max: 28.2,
        min: 14.1,
      },
      interpretation: {
        label: 'Idéal',
        status: 'optimal',
      },
      isZoomable: true,
      zoomType: 'chart',
      relativeTime: 'Il y a 5 min',
      themeMode: 'pwa',
    }

    const html = renderToString(<SquareCard config={config} />)
    expect(html).toContain('Air : Température')
    expect(html).toContain('Parcelle Les Vignes')
    expect(html).toContain('24.5')
    expect(html).toContain('28.2')
    expect(html).toContain('14.1')
    expect(html).toContain('Idéal')
    expect(html).toContain('data-zoomable="true"')
    expect(html).toContain('data-zoom-type="chart"')
    expect(html).toContain('q-theme-pwa')
  })
})
