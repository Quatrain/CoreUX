/**
 * Interface representing a node within a taxonomy or thematic hierarchy tree.
 */
export interface TaxonomyNode {
  /** Unique slug identifier for the thematic node (e.g., 'soil-health') */
  id: string
  /** Human-readable label displayed in the UI */
  label: string
  /** Short description explaining the thematic domain */
  description?: string
  /** Parent thematic identifier, or null for root-level categories */
  parentId?: string | null
  /** Optional icon identifier from Tabler Icons or UI icon registry */
  icon?: string
  /** Accent color token or hex string */
  color?: string
  /** Number of curated documents associated with this thematic */
  count?: number
  /** Child thematic nodes */
  children?: TaxonomyNode[]
  /** Arbitrary domain metadata */
  metadata?: Record<string, any>
}

/**
 * Configuration options for initializing a TaxonomyController instance.
 */
export interface TaxonomyControllerOptions {
  /** Initial tree or flat list of taxonomy nodes */
  initialNodes?: TaxonomyNode[]
  /** Initially selected thematic identifier */
  selectedId?: string | null
  /** If true, allows multiple simultaneous thematic selections */
  multiSelect?: boolean
}

export type TaxonomyListener = (nodes: TaxonomyNode[], selectedIds: string[]) => void

/**
 * Headless, framework-agnostic controller managing hierarchical thematics,
 * category trees, transversal tag taxonomies, and active filter selections.
 */
export class TaxonomyController {
  protected nodes: Map<string, TaxonomyNode> = new Map()
  protected selectedIds: Set<string> = new Set()
  protected expandedIds: Set<string> = new Set()
  protected listeners: Set<TaxonomyListener> = new Set()
  protected multiSelect: boolean

  /**
   * Instantiates a new TaxonomyController.
   * 
   * @param options - Configuration options.
   */
  constructor(options: TaxonomyControllerOptions = {}) {
    this.multiSelect = Boolean(options.multiSelect)
    if (options.initialNodes && options.initialNodes.length > 0) {
      this.loadNodes(options.initialNodes)
    }
    if (options.selectedId) {
      this.selectedIds.add(options.selectedId)
    }
  }

  /**
   * Loads or replaces nodes in the taxonomy manager.
   * 
   * @param nodes - Array of hierarchical or flat taxonomy nodes.
   */
  public loadNodes(nodes: TaxonomyNode[]): void {
    this.nodes.clear()
    const flatten = (items: TaxonomyNode[], parentId: string | null = null) => {
      for (const item of items) {
        const node: TaxonomyNode = {
          ...item,
          parentId: item.parentId !== undefined ? item.parentId : parentId,
          children: []
        }
        this.nodes.set(node.id, node)
        if (item.children && item.children.length > 0) {
          flatten(item.children, item.id)
        }
      }
    }
    flatten(nodes)
    this.notify()
  }

  /**
   * Adds or updates a thematic node in the taxonomy.
   * 
   * @param node - The thematic node to insert or update.
   */
  public addNode(node: TaxonomyNode): void {
    this.nodes.set(node.id, {
      ...node,
      children: []
    })
    this.notify()
  }

  /**
   * Removes a node and recursively removes its sub-thematics.
   * 
   * @param id - The identifier of the node to remove.
   */
  public removeNode(id: string): void {
    const childrenToRemove: string[] = []
    const findDescendants = (parentId: string) => {
      for (const [nodeId, node] of this.nodes.entries()) {
        if (node.parentId === parentId) {
          childrenToRemove.push(nodeId)
          findDescendants(nodeId)
        }
      }
    }
    findDescendants(id)
    childrenToRemove.push(id)

    for (const childId of childrenToRemove) {
      this.nodes.delete(childId)
      this.selectedIds.delete(childId)
      this.expandedIds.delete(childId)
    }
    this.notify()
  }

  /**
   * Selects a thematic node. Clears previous selection unless multiSelect is enabled.
   * 
   * @param id - The node identifier to select.
   */
  public select(id: string): void {
    if (!this.multiSelect) {
      this.selectedIds.clear()
    }
    this.selectedIds.add(id)
    this.notify()
  }

  /**
   * Deselects a thematic node.
   * 
   * @param id - The node identifier to deselect.
   */
  public deselect(id: string): void {
    this.selectedIds.delete(id)
    this.notify()
  }

  /**
   * Toggles the selection status of a thematic node.
   * 
   * @param id - The node identifier to toggle.
   */
  public toggleSelect(id: string): void {
    if (this.selectedIds.has(id)) {
      this.deselect(id)
    } else {
      this.select(id)
    }
  }

  /**
   * Clears all active selections.
   */
  public clearSelection(): void {
    this.selectedIds.clear()
    this.notify()
  }

  /**
   * Retrieves the set of currently selected thematic node identifiers.
   * 
   * @returns Array of selected IDs.
   */
  public getSelected(): string[] {
    return Array.from(this.selectedIds)
  }

  /**
   * Checks whether a specific thematic node is currently selected.
   * 
   * @param id - The thematic identifier to verify.
   * @returns True if selected, false otherwise.
   */
  public isSelected(id: string): boolean {
    return this.selectedIds.has(id)
  }

  /**
   * Toggles the expansion collapse state of a parent thematic node.
   * 
   * @param id - The thematic identifier to toggle.
   */
  public toggleExpand(id: string): void {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id)
    } else {
      this.expandedIds.add(id)
    }
    this.notify()
  }

  /**
   * Checks whether a thematic node is currently expanded.
   * 
   * @param id - The thematic identifier to check.
   * @returns True if expanded, false otherwise.
   */
  public isExpanded(id: string): boolean {
    return this.expandedIds.has(id)
  }

  /**
   * Reconstructs and returns the full hierarchical taxonomy tree.
   * 
   * @returns Array of root-level TaxonomyNodes with nested children.
   */
  public getTree(): TaxonomyNode[] {
    const rootNodes: TaxonomyNode[] = []
    const nodeMap = new Map<string, TaxonomyNode>()

    for (const [id, node] of this.nodes.entries()) {
      nodeMap.set(id, { ...node, children: [] })
    }

    for (const node of nodeMap.values()) {
      if (node.parentId && nodeMap.has(node.parentId)) {
        const parent = nodeMap.get(node.parentId)!
        parent.children = parent.children || []
        parent.children.push(node)
      } else {
        rootNodes.push(node)
      }
    }

    return rootNodes
  }

  /**
   * Returns a flat array of all registered taxonomy nodes.
   * 
   * @returns Array of TaxonomyNode objects.
   */
  public getFlatNodes(): TaxonomyNode[] {
    return Array.from(this.nodes.values())
  }

  /**
   * Finds a specific thematic node by identifier.
   * 
   * @param id - The node identifier to locate.
   * @returns The TaxonomyNode or undefined if not found.
   */
  public getNode(id: string): TaxonomyNode | undefined {
    return this.nodes.get(id)
  }

  /**
   * Updates the document counter for a thematic node.
   * 
   * @param id - The thematic identifier.
   * @param count - The updated count.
   */
  public updateCount(id: string, count: number): void {
    const existing = this.nodes.get(id)
    if (existing) {
      existing.count = count
      this.notify()
    }
  }

  /**
   * Subscribes a listener callback to state changes.
   * 
   * @param listener - Callback receiving updated nodes and active selection.
   * @returns Unsubscribe function.
   */
  public subscribe(listener: TaxonomyListener): () => void {
    this.listeners.add(listener)
    listener(this.getTree(), this.getSelected())
    return () => {
      this.listeners.delete(listener)
    }
  }

  protected notify(): void {
    const tree = this.getTree()
    const selected = this.getSelected()
    for (const listener of this.listeners) {
      listener(tree, selected)
    }
  }
}
