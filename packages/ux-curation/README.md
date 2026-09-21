# @quatrain/ux-curation

Curation card and Open Knowledge Format (OKF v0.1) metadata editor components for Mantine UI.

## Features

- **OKF Metadata Form**: Form editor supporting standard OKF frontmatter fields (title, type, description, category, tags, transversal thematics, source, dates).
- **Live YAML Preview**: Instant view of the generated OKF frontmatter block.
- **Split Curation View**: Side-by-side layout displaying the extracted document text alongside the metadata editor.

## Quick Start

```tsx
import { CurationCard } from '@quatrain/ux-curation'

export function MyCurationView() {
  return (
    <CurationCard
      metadata={{
        id: 'soil-health-guide',
        title: 'Guide des sols vivants',
        description: 'Pratiques de régénération des sols.',
        type: 'guide',
        category: 'soil-health',
        tags: ['sol', 'fertilité']
      }}
      thematics={[
        { id: 'soil-health', label: 'Soil Health & Biology' },
        { id: 'cover-crops', label: 'Cover Crops' }
      ]}
      onSave={(updated) => console.log('Saved OKF Metadata:', updated)}
    />
  )
}
```
