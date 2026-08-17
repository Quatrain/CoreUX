import { describe, expect, test } from 'bun:test'
import { CoreCardManager, CoreDashboardCanvasManager } from './CoreCardManager'
import { SquareCardConfig } from './types'

describe('CoreCardManager', () => {
  test('initializes and updates primary values', () => {
    const config: SquareCardConfig = {
      id: 'temp-card',
      title: 'Air : Température',
      primaryValue: 22.0,
      unit: '°C',
    }

    const manager = new CoreCardManager(config)
    expect(manager.getId()).toBe('temp-card')
    expect(manager.getConfig().primaryValue).toBe(22.0)

    manager.updatePrimaryValue(24.5, 1723938000000)
    expect(manager.getConfig().primaryValue).toBe(24.5)
    expect(manager.getConfig().timestamp).toBe(1723938000000)
  })

  test('updates extreme min and max samples', () => {
    const manager = new CoreCardManager({
      id: 'temp-card',
      title: 'Air : Température',
      primaryValue: 20.0,
    })

    manager.updateExtremesWithSample(15.2)
    manager.updateExtremesWithSample(28.4)
    manager.updateExtremesWithSample(19.0)

    expect(manager.getConfig().extremes?.min).toBe(15.2)
    expect(manager.getConfig().extremes?.max).toBe(28.4)
  })

  test('evaluates thresholds for status', () => {
    const manager = new CoreCardManager({
      id: 'temp-card',
      title: 'Air : Température',
      primaryValue: 24.0,
    })

    const interpretation = manager.evaluateThreshold(24.0, {
      optimal: [18, 26],
      warning: [10, 18],
      optimalLabel: 'Idéal',
      warningLabel: 'Frais',
      alertLabel: 'Gelée',
    })

    expect(interpretation.status).toBe('optimal')
    expect(interpretation.label).toBe('Idéal')

    const alertInterp = manager.evaluateThreshold(2.0, {
      optimal: [18, 26],
      warning: [10, 18],
      optimalLabel: 'Idéal',
      warningLabel: 'Frais',
      alertLabel: 'Gelée',
    })

    expect(alertInterp.status).toBe('alert')
    expect(alertInterp.label).toBe('Gelée')
  })
})

describe('CoreDashboardCanvasManager', () => {
  test('manages card reordering and visibility', () => {
    const canvas = new CoreDashboardCanvasManager({
      cardOrder: ['temp', 'soil', 'battery', 'frost'],
      hiddenCards: ['frost'],
    })

    expect(canvas.getVisibleCards()).toEqual(['temp', 'soil', 'battery'])

    canvas.reorderCard('battery', 0)
    expect(canvas.getVisibleCards()).toEqual(['battery', 'temp', 'soil'])

    canvas.toggleCardVisibility('frost')
    expect(canvas.getVisibleCards()).toEqual(['battery', 'temp', 'soil', 'frost'])
  })
})
