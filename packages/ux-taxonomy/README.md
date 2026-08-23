# @quatrain/ux-taxonomy

Headless taxonomy controller and interactive React Mantine components for managing thematic trees, categories, and transversal tagging.

## Features

- **Framework-Agnostic Headless Controller**: `TaxonomyController` handles hierarchical nodes, single/multi-selection, expansions, and listener notifications with zero external framework dependencies.
- **ThematicTree Component**: Accessible, interactive Mantine-based tree view with live filtering, badge counts, and add-subthematic triggers.
- **ThematicBadgeGroup Component**: Interactive badge cluster for managing multi-thematic tag associations.

## Installation

```bash
yarn add @quatrain/ux-taxonomy
```

## Quick Start

```tsx
import { TaxonomyController, ThematicTree } from '@quatrain/ux-taxonomy'

const controller = new TaxonomyController({
  initialNodes: [
    {
      id: 'soil-health',
      label: 'Soil Health & Biology',
      children: [{ id: 'mycorrhizae', label: 'Mycorrhizae' }]
    },
    { id: 'cover-crops', label: 'Cover Crops' }
  ]
})

export function MyThematicExplorer() {
  return (
    <ThematicTree
      controller={controller}
      onSelect={(node) => console.log('Selected:', node.id)}
    />
  )
}
```
