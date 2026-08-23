import React from 'react'
import {
  Card,
  Group,
  Text,
  Badge,
  Paper,
  ScrollArea,
  Grid,
  Box,
  TypographyStylesProvider
} from '@mantine/core'
import { IconFileTypePdf, IconFileText, IconSparkles } from '@tabler/icons-react'
import { OKFMetadataForm, type OKFDocumentMetadata, type AxisDefinition } from './OKFMetadataForm'
import type { TaxonomyNode } from '@quatrain/ux-taxonomy'

export interface CurationCardProps {
  /** The document item being curated */
  metadata: OKFDocumentMetadata
  /** Available taxonomy/thematic categories */
  thematics?: TaxonomyNode[]
  /** Configured dynamic axes */
  axes?: AxisDefinition[]
  /** Extracted raw text or markdown body */
  extractedText?: string
  /** Callback fired when curation metadata is saved */
  onSave: (updatedMetadata: OKFDocumentMetadata) => void
  /** Loading state during save/commit */
  loading?: boolean
  /** Custom CSS class */
  className?: string
  /** Custom styles */
  style?: React.CSSProperties
}

/**
 * Split-view Curation card component displaying document extract and OKF metadata editor.
 */
export const CurationCard: React.FC<CurationCardProps> = ({
  metadata,
  thematics = [],
  axes = [],
  extractedText,
  onSave,
  loading = false,
  className = '',
  style
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className={`q-curation-card ${className}`} style={style}>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconFileText size={20} color="var(--mantine-color-blue-filled)" />
          <Text fw={700} size="md">
            {metadata.title || 'Document sans titre'}
          </Text>
        </Group>
        <Group gap="xs">
          <Badge color="blue" variant="light">
            {metadata.category}
          </Badge>
          <Badge color="gray" variant="outline">
            {metadata.type}
          </Badge>
        </Group>
      </Group>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper withBorder p="md" radius="sm" bg="var(--mantine-color-gray-0)" mih={350}>
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm" c="dimmed">
                Extrait / Aperçu du Contenu
              </Text>
              <Badge size="xs" color="teal" leftSection={<IconSparkles size={12} />}>
                Extraction OCR/IA
              </Badge>
            </Group>
            <ScrollArea h={320}>
              <TypographyStylesProvider>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {extractedText || metadata.body || metadata.description || 'Aucun texte extrait disponible.'}
                </div>
              </TypographyStylesProvider>
            </ScrollArea>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <OKFMetadataForm
            initialValues={metadata}
            thematics={thematics}
            axes={axes}
            onSave={onSave}
            loading={loading}
          />
        </Grid.Col>
      </Grid>
    </Card>
  )
}
