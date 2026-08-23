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
import { OKFMetadataForm, type OKFDocumentMetadata } from './OKFMetadataForm'
import type { TaxonomyNode } from '@quatrain/ux-taxonomy'

export interface CurationCardProps {
  /** The document item being curated */
  metadata: OKFDocumentMetadata
  /** Available taxonomy/thematic categories */
  thematics?: TaxonomyNode[]
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
  extractedText,
  onSave,
  loading = false,
  className = '',
  style
}) => {
  return (
    <Card withBorder shadow="sm" radius="md" p="lg" className={`q-curation-card ${className}`} style={style}>
      <Card.Section withBorder inheritPadding py="xs" mb="md" bg="var(--mantine-color-gray-light)">
        <Group justify="space-between">
          <Group gap="xs">
            <IconFileTypePdf size={20} color="var(--mantine-color-red-filled)" />
            <Text fw={600} size="sm">
              {metadata.title || 'Nouveau Document'}
            </Text>
          </Group>
          <Group gap="xs">
            {metadata.properNouns && metadata.properNouns.length > 0 && (
              <Badge size="xs" color="grape" variant="light" leftSection={<IconSparkles size={10} />}>
                {metadata.properNouns.length} concepts détectés
              </Badge>
            )}
            <Badge size="xs" color="blue" variant="filled">
              {metadata.type || 'document'}
            </Badge>
          </Group>
        </Group>
      </Card.Section>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper withBorder p="md" radius="sm" h="100%">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">
              Extrait du contenu / Texte extrait
            </Text>
            <ScrollArea h={420} offsetScrollbars>
              <TypographyStylesProvider>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {extractedText || metadata.body || 'Aucun texte extrait.'}
                </div>
              </TypographyStylesProvider>
            </ScrollArea>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <OKFMetadataForm
            initialValues={metadata}
            thematics={thematics}
            onSave={onSave}
            loading={loading}
          />
        </Grid.Col>
      </Grid>
    </Card>
  )
}
