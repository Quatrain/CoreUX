import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Group,
  Text,
  Badge,
  ActionIcon,
  UnstyledButton,
  Stack,
  Tooltip,
  Collapse,
  TextInput
} from '@mantine/core'
import {
  IconChevronRight,
  IconChevronDown,
  IconFolder,
  IconFolderOpen,
  IconPlus,
  IconSearch
} from '@tabler/icons-react'
import { TaxonomyController, TaxonomyNode } from './TaxonomyController'

/**
 * Properties for rendering the ThematicTree component.
 */
export interface ThematicTreeProps {
  /** The taxonomy controller managing state */
  controller: TaxonomyController
  /** Optional callback fired when a node is selected */
  onSelect?: (node: TaxonomyNode) => void
  /** Optional callback fired when the 'Add Sub-thematic' button is clicked */
  onAddSubThematic?: (parentNode?: TaxonomyNode) => void
  /** Whether to show a live search filter input on top */
  searchable?: boolean
  /** Custom CSS class */
  className?: string
  /** Custom styles */
  style?: React.CSSProperties
}

/**
 * Tree node item presentation component.
 */
interface TreeNodeItemProps {
  node: TaxonomyNode
  level: number
  controller: TaxonomyController
  selectedIds: string[]
  searchQuery: string
  onSelect?: (node: TaxonomyNode) => void
  onAddSubThematic?: (parentNode?: TaxonomyNode) => void
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level,
  controller,
  selectedIds,
  searchQuery,
  onSelect,
  onAddSubThematic
}) => {
  const hasChildren = Boolean(node.children && node.children.length > 0)
  const isExpanded = controller.isExpanded(node.id) || Boolean(searchQuery.trim())
  const isSelected = selectedIds.includes(node.id)

  const matchesSearch = useMemo(() => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const matchSelf = node.label.toLowerCase().includes(q) || (node.description && node.description.toLowerCase().includes(q))
    return matchSelf
  }, [node, searchQuery])

  if (!matchesSearch && !hasChildren) {
    return null
  }

  return (
    <Box style={{ marginLeft: level * 14 }}>
      <Group
        justify="space-between"
        wrap="nowrap"
        p={6}
        style={{
          borderRadius: 6,
          backgroundColor: isSelected ? 'var(--mantine-color-blue-light)' : 'transparent',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
        onClick={() => {
          controller.select(node.id)
          if (onSelect) onSelect(node)
        }}
      >
        <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          {hasChildren ? (
            <ActionIcon
              size="xs"
              variant="subtle"
              color="gray"
              onClick={(e) => {
                e.stopPropagation()
                controller.toggleExpand(node.id)
              }}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
            </ActionIcon>
          ) : (
            <Box style={{ width: 18 }} />
          )}

          {hasChildren ? (
            isExpanded ? <IconFolderOpen size={16} color="var(--mantine-color-blue-filled)" /> : <IconFolder size={16} color="gray" />
          ) : (
            <IconFolder size={16} color="gray" />
          )}

          <Text size="sm" fw={isSelected ? 600 : 400} truncate style={{ flex: 1 }}>
            {node.label}
          </Text>
        </Group>

        <Group gap={4} wrap="nowrap">
          {node.count !== undefined && (
            <Badge size="xs" variant={isSelected ? 'filled' : 'light'} color={node.color || 'blue'}>
              {node.count}
            </Badge>
          )}

          {onAddSubThematic && (
            <Tooltip label="Ajouter une sous-thématique" withArrow position="right">
              <ActionIcon
                size="xs"
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddSubThematic(node)
                }}
                aria-label="Add sub-thematic"
              >
                <IconPlus size={12} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>

      {hasChildren && (
        <Collapse in={isExpanded}>
          <Stack gap={2} mt={2}>
            {node.children!.map((child) => (
              <TreeNodeItem
                key={child.id}
                node={child}
                level={level + 1}
                controller={controller}
                selectedIds={selectedIds}
                searchQuery={searchQuery}
                onSelect={onSelect}
                onAddSubThematic={onAddSubThematic}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  )
}

/**
 * Tree component rendering interactive taxonomic hierarchies with Mantine styling.
 */
export const ThematicTree: React.FC<ThematicTreeProps> = ({
  controller,
  onSelect,
  onAddSubThematic,
  searchable = true,
  className = '',
  style
}) => {
  const [tree, setTree] = useState<TaxonomyNode[]>(controller.getTree())
  const [selectedIds, setSelectedIds] = useState<string[]>(controller.getSelected())
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    return controller.subscribe((updatedTree, updatedSelected) => {
      setTree(updatedTree)
      setSelectedIds(updatedSelected)
    })
  }, [controller])

  return (
    <Box className={`q-thematic-tree ${className}`} style={style}>
      {searchable && (
        <TextInput
          placeholder="Filtrer les thématiques..."
          size="xs"
          mb="xs"
          leftSection={<IconSearch size={14} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      )}

      <Stack gap={2}>
        {tree.length === 0 ? (
          <Text size="sm" c="dimmed" fs="italic" p="xs">
            Aucune thématique définie.
          </Text>
        ) : (
          tree.map((node) => (
            <TreeNodeItem
              key={node.id}
              node={node}
              level={0}
              controller={controller}
              selectedIds={selectedIds}
              searchQuery={searchQuery}
              onSelect={onSelect}
              onAddSubThematic={onAddSubThematic}
            />
          ))
        )}
      </Stack>
    </Box>
  )
}
