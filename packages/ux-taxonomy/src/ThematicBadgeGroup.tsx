import React from 'react'
import { Group, Badge, Text, Box } from '@mantine/core'
import type { TaxonomyNode } from './TaxonomyController'

export interface ThematicBadgeGroupProps {
  /** Available taxonomy nodes / thematics */
  nodes: TaxonomyNode[]
  /** Array of currently selected thematic slugs/ids */
  value: string[]
  /** Callback fired when the selection changes */
  onChange: (selectedIds: string[]) => void
  /** Label displayed above the badges */
  label?: string
  /** Description or subtext */
  description?: string
  /** Custom CSS class */
  className?: string
  /** Custom styles */
  style?: React.CSSProperties
}

/**
 * Interactive badge group component allowing multi-selection of transversal thematics.
 */
export const ThematicBadgeGroup: React.FC<ThematicBadgeGroupProps> = ({
  nodes,
  value = [],
  onChange,
  label,
  description,
  className = '',
  style
}) => {
  const handleToggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <Box className={`q-thematic-badge-group ${className}`} style={style}>
      {label && (
        <Text size="sm" fw={500} mb={2}>
          {label}
        </Text>
      )}
      {description && (
        <Text size="xs" c="dimmed" mb="xs">
          {description}
        </Text>
      )}
      <Group gap="xs">
        {nodes.map((node) => {
          const isSelected = value.includes(node.id)
          return (
            <Badge
              key={node.id}
              size="md"
              variant={isSelected ? 'filled' : 'outline'}
              color={node.color || (isSelected ? 'blue' : 'gray')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => handleToggle(node.id)}
            >
              {node.label}
            </Badge>
          )
        })}
      </Group>
    </Box>
  )
}
