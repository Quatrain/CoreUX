import { 
  SquareCardConfig, 
  CardStatusLevel, 
  CardInterpretation, 
  CardExtremes, 
  CardSubMetric,
  DashboardCanvasConfig 
} from './types'

export class CoreCardManager {
  private config: SquareCardConfig

  constructor(config: SquareCardConfig) {
    this.config = { ...config }
  }

  public getConfig(): SquareCardConfig {
    return { ...this.config }
  }

  public getId(): string {
    return this.config.id
  }

  public updatePrimaryValue(value: number | string, timestamp?: number | string): void {
    this.config.primaryValue = value
    if (timestamp !== undefined) {
      this.config.timestamp = timestamp
    }
  }

  public setExtremes(extremes: CardExtremes): void {
    this.config.extremes = extremes
  }

  public updateExtremesWithSample(value: number): void {
    if (typeof value !== 'number' || isNaN(value)) return

    const currentMax = this.config.extremes?.max
    const currentMin = this.config.extremes?.min

    const newMax = currentMax === undefined ? value : Math.max(currentMax, value)
    const newMin = currentMin === undefined ? value : Math.min(currentMin, value)

    this.config.extremes = {
      ...this.config.extremes,
      max: newMax,
      min: newMin,
    }
  }

  public setInterpretation(interpretation: CardInterpretation): void {
    this.config.interpretation = interpretation
  }

  public evaluateThreshold(
    value: number, 
    rules: {
      optimal: [number, number]
      warning?: [number, number]
      optimalLabel?: string
      warningLabel?: string
      alertLabel?: string
    }
  ): CardInterpretation {
    if (value >= rules.optimal[0] && value <= rules.optimal[1]) {
      return {
        label: rules.optimalLabel ?? 'Optimal',
        status: 'optimal',
      }
    }

    if (rules.warning && value >= rules.warning[0] && value <= rules.warning[1]) {
      return {
        label: rules.warningLabel ?? 'Vigilance',
        status: 'warning',
      }
    }

    return {
      label: rules.alertLabel ?? 'Alerte',
      status: 'alert',
    }
  }

  public setSubMetrics(subMetrics: CardSubMetric[]): void {
    this.config.subMetrics = subMetrics
    this.config.isStacked = subMetrics.length > 0
  }
}

export class CoreDashboardCanvasManager {
  private cardIds: string[]
  private hiddenCardIds: Set<string>

  constructor(initialConfig?: DashboardCanvasConfig) {
    this.cardIds = initialConfig?.cardOrder ? [...initialConfig.cardOrder] : []
    this.hiddenCardIds = new Set(initialConfig?.hiddenCards ?? [])
  }

  public getVisibleCards(): string[] {
    return this.cardIds.filter((id) => !this.hiddenCardIds.has(id))
  }

  public getAllCards(): string[] {
    return [...this.cardIds]
  }

  public setCardOrder(newOrder: string[]): void {
    this.cardIds = [...newOrder]
  }

  public reorderCard(cardId: string, targetIndex: number): void {
    const currentIndex = this.cardIds.indexOf(cardId)
    if (currentIndex === -1) return

    const [removed] = this.cardIds.splice(currentIndex, 1)
    const clampedIndex = Math.max(0, Math.min(targetIndex, this.cardIds.length))
    this.cardIds.splice(clampedIndex, 0, removed)
  }

  public toggleCardVisibility(cardId: string): boolean {
    if (this.hiddenCardIds.has(cardId)) {
      this.hiddenCardIds.delete(cardId)
      return true
    } else {
      this.hiddenCardIds.add(cardId)
      return false
    }
  }

  public serialize(): DashboardCanvasConfig {
    return {
      cardOrder: [...this.cardIds],
      hiddenCards: Array.from(this.hiddenCardIds),
    }
  }
}
