import { TaxonomyController, TaxonomyNode } from './TaxonomyController'

describe('TaxonomyController', () => {
  const sampleNodes: TaxonomyNode[] = [
    {
      id: 'soil-health',
      label: 'Soil Health & Biology',
      description: 'Soil microbiology and structure',
      children: [
        {
          id: 'mycorrhizae',
          label: 'Mycorrhizae & Fungi',
          description: 'Symbiotic fungal networks'
        }
      ]
    },
    {
      id: 'cover-crops',
      label: 'Cover Crops & Mulching',
      description: 'Biomass and species selection'
    }
  ]

  it('initializes correctly with provided nodes and active selection', () => {
    const controller = new TaxonomyController({
      initialNodes: sampleNodes,
      selectedId: 'soil-health'
    })

    const tree = controller.getTree()
    expect(tree).toHaveLength(2)
    expect(tree[0].id).toBe('soil-health')
    expect(tree[0].children).toHaveLength(1)
    expect(tree[0].children![0].id).toBe('mycorrhizae')
    expect(controller.getSelected()).toEqual(['soil-health'])
    expect(controller.isSelected('soil-health')).toBe(true)
    expect(controller.isSelected('cover-crops')).toBe(false)
  })

  it('handles single selection mode correctly', () => {
    const controller = new TaxonomyController({ initialNodes: sampleNodes })
    controller.select('soil-health')
    expect(controller.getSelected()).toEqual(['soil-health'])

    controller.select('cover-crops')
    expect(controller.getSelected()).toEqual(['cover-crops'])
  })

  it('handles multi-selection mode when configured', () => {
    const controller = new TaxonomyController({
      initialNodes: sampleNodes,
      multiSelect: true
    })

    controller.select('soil-health')
    controller.select('cover-crops')
    expect(controller.getSelected()).toEqual(['soil-health', 'cover-crops'])

    controller.deselect('soil-health')
    expect(controller.getSelected()).toEqual(['cover-crops'])

    controller.toggleSelect('mycorrhizae')
    expect(controller.getSelected()).toEqual(['cover-crops', 'mycorrhizae'])
    controller.toggleSelect('cover-crops')
    expect(controller.getSelected()).toEqual(['mycorrhizae'])
  })

  it('adds and removes nodes with cascade deletion', () => {
    const controller = new TaxonomyController({ initialNodes: sampleNodes })

    controller.addNode({
      id: 'irrigation',
      label: 'Irrigation & Water',
      parentId: null
    })

    expect(controller.getNode('irrigation')).toBeDefined()
    expect(controller.getTree()).toHaveLength(3)

    // Remove soil-health should also remove mycorrhizae
    controller.removeNode('soil-health')
    expect(controller.getNode('soil-health')).toBeUndefined()
    expect(controller.getNode('mycorrhizae')).toBeUndefined()
    expect(controller.getTree()).toHaveLength(2)
  })

  it('notifies subscribers upon state change', () => {
    const controller = new TaxonomyController({ initialNodes: sampleNodes })
    const listener = jest.fn()

    const unsubscribe = controller.subscribe(listener)
    expect(listener).toHaveBeenCalledTimes(1)

    controller.select('cover-crops')
    expect(listener).toHaveBeenCalledTimes(2)

    controller.updateCount('cover-crops', 42)
    expect(listener).toHaveBeenCalledTimes(3)
    expect(controller.getNode('cover-crops')?.count).toBe(42)

    unsubscribe()
    controller.select('soil-health')
    expect(listener).toHaveBeenCalledTimes(3)
  })

  it('manages expand and collapse state', () => {
    const controller = new TaxonomyController({ initialNodes: sampleNodes })
    expect(controller.isExpanded('soil-health')).toBe(false)

    controller.toggleExpand('soil-health')
    expect(controller.isExpanded('soil-health')).toBe(true)

    controller.toggleExpand('soil-health')
    expect(controller.isExpanded('soil-health')).toBe(false)
  })
})
