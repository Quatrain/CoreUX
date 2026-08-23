import React, { useState } from 'react'
import {
  Stack,
  TextInput,
  Textarea,
  Select,
  TagsInput,
  Button,
  Group,
  Paper,
  Text,
  Badge,
  Tabs,
  Code,
  Box,
  Divider
} from '@mantine/core'
import { IconDeviceFloppy, IconCheck, IconEye, IconEdit, IconTags } from '@tabler/icons-react'
import { ThematicBadgeGroup, TaxonomyNode } from '@quatrain/ux-taxonomy'

/**
 * Data structure representing curated OKF document metadata.
 */
export interface OKFDocumentMetadata {
  id: string
  type: string
  title: string
  description: string
  category: string
  tags: string[]
  thematics?: string[]
  soils?: string[]
  climates?: string[]
  latitudes?: string[]
  altitudes?: string[]
  itineraries?: string[]
  soa?: string
  revision?: string
  properNouns?: string[]
  timestamp?: string
  documentDate?: string
  originalFileUri?: string
  fileHash?: string
  source?: string
  body?: string
}

export interface OKFMetadataFormProps {
  /** Initial or current metadata values */
  initialValues: Partial<OKFDocumentMetadata>
  /** Available taxonomy/thematic nodes */
  thematics?: TaxonomyNode[]
  /** Callback fired when the form is submitted */
  onSave: (metadata: OKFDocumentMetadata) => void
  /** Whether the save operation is currently in progress */
  loading?: boolean
  /** Custom CSS class */
  className?: string
  /** Custom styles */
  style?: React.CSSProperties
}

/**
 * Form component for editing Open Knowledge Format (OKF v0.1) metadata and frontmatter.
 */
export const OKFMetadataForm: React.FC<OKFMetadataFormProps> = ({
  initialValues,
  thematics = [],
  onSave,
  loading = false,
  className = '',
  style
}) => {
  const [title, setTitle] = useState(initialValues.title || '')
  const [type, setType] = useState(initialValues.type || 'document')
  const [category, setCategory] = useState(initialValues.category || 'inbox')
  const [description, setDescription] = useState(initialValues.description || '')
  const [tags, setTags] = useState<string[]>(initialValues.tags || [])
  const [selectedThematics, setSelectedThematics] = useState<string[]>(initialValues.thematics || [])
  const [soils, setSoils] = useState<string[]>(initialValues.soils || [])
  const [climates, setClimates] = useState<string[]>(initialValues.climates || [])
  const [latitudes, setLatitudes] = useState<string[]>(initialValues.latitudes || [])
  const [altitudes, setAltitudes] = useState<string[]>(initialValues.altitudes || [])
  const [itineraries, setItineraries] = useState<string[]>(initialValues.itineraries || [])
  const [soa, setSoa] = useState(initialValues.soa || 'bradtech/world-agronomy')
  const [revision, setRevision] = useState(initialValues.revision || 'rev-1.0.0')
  const [source, setSource] = useState(initialValues.source || '')
  const [documentDate, setDocumentDate] = useState(initialValues.documentDate || '')

  const categoryOptions = thematics.map((t) => ({
    value: t.id,
    label: t.label
  }))
  if (!categoryOptions.some((o) => o.value === 'inbox')) {
    categoryOptions.unshift({ value: 'inbox', label: 'Inbox (Général)' })
  }

  const generatedYaml = `---
soa: "${soa}"
revision: "${revision}"
type: ${type}
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
category: ${category}
tags:
${tags.map((t) => `  - ${t}`).join('\n')}
${selectedThematics.length > 0 ? `thematics:\n${selectedThematics.map((th) => `  - ${th}`).join('\n')}` : ''}
${soils.length > 0 ? `soils:\n${soils.map((s) => `  - ${s}`).join('\n')}` : ''}
${climates.length > 0 ? `climates:\n${climates.map((c) => `  - ${c}`).join('\n')}` : ''}
${latitudes.length > 0 ? `latitudes:\n${latitudes.map((l) => `  - ${l}`).join('\n')}` : ''}
${altitudes.length > 0 ? `altitudes:\n${altitudes.map((a) => `  - ${a}`).join('\n')}` : ''}
${itineraries.length > 0 ? `itineraries:\n${itineraries.map((it) => `  - ${it}`).join('\n')}` : ''}
${documentDate ? `documentDate: "${documentDate}"` : ''}
${source ? `source: "${source.replace(/"/g, '\\"')}"` : ''}
timestamp: "${initialValues.timestamp || new Date().toISOString()}"
---`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: initialValues.id || 'new-document',
      title,
      type,
      category,
      description,
      tags,
      thematics: selectedThematics,
      soils,
      climates,
      latitudes,
      altitudes,
      itineraries,
      soa,
      revision,
      properNouns: initialValues.properNouns || [],
      source,
      documentDate,
      timestamp: initialValues.timestamp || new Date().toISOString(),
      originalFileUri: initialValues.originalFileUri,
      fileHash: initialValues.fileHash,
      body: initialValues.body || ''
    })
  }

  return (
    <Box className={`q-okf-metadata-form ${className}`} style={style}>
      <Tabs defaultValue="edit">
        <Tabs.List mb="md">
          <Tabs.Tab value="edit" leftSection={<IconEdit size={14} />}>
            Formulaire de Curation
          </Tabs.Tab>
          <Tabs.Tab value="preview" leftSection={<IconEye size={14} />}>
            Aperçu YAML Frontmatter
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="edit">
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Titre du document"
                placeholder="Ex: Guide pratique des couverts végétaux en viticulture"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                required
              />

              <Group grow>
                <Select
                  label="Type de ressource"
                  data={[
                    { value: 'document', label: 'Document technique' },
                    { value: 'guide', label: 'Guide / Manuel' },
                    { value: 'recipe', label: 'Fiche pratique / Recette' },
                    { value: 'specification', label: 'Spécification / Norme' },
                    { value: 'concept', label: 'Fiche Concept' },
                    { value: 'note', label: 'Note de veille' }
                  ]}
                  value={type}
                  onChange={(val) => setType(val || 'document')}
                  required
                />

                <Select
                  label="Thématique principale (Dossier OKF)"
                  data={categoryOptions}
                  value={category}
                  onChange={(val) => setCategory(val || 'inbox')}
                  required
                />
              </Group>

              <Textarea
                label="Résumé exécutif / Description"
                placeholder="Synthèse claire en 2-3 phrases des points clés..."
                minRows={3}
                autosize
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                required
              />

              {thematics.length > 0 && (
                <ThematicBadgeGroup
                  label="Thématiques transversales associées"
                  description="Cliquez pour lier ce document à d'autres thématiques sans le déplacer"
                  nodes={thematics}
                  value={selectedThematics}
                  onChange={setSelectedThematics}
                />
              )}

              <TagsInput
                label="Tags & Mots-clés"
                description="Pressez Entrée pour ajouter un tag (en minuscules)"
                placeholder="agronomie, sol, azote..."
                value={tags}
                onChange={setTags}
                leftSection={<IconTags size={14} />}
              />

              <Group grow>
                <TextInput
                  label="Source d'Autorité (SOA)"
                  description="Dépôt d'origine certifié"
                  placeholder="bradtech/world-agronomy"
                  value={soa}
                  onChange={(e) => setSoa(e.currentTarget.value)}
                  required
                />

                <TextInput
                  label="Numéro de Révision"
                  description="Identifiant de version / Git SHA"
                  placeholder="rev-1.0.0"
                  value={revision}
                  onChange={(e) => setRevision(e.currentTarget.value)}
                  required
                />
              </Group>

              <Divider my="xs" label="Axes de Classification Multi-Axiale Bradtech" labelPosition="center" />

              <Group grow align="flex-start">
                <TagsInput
                  label="1. Types de Sols (soils)"
                  description="argilo-calcaire, limoneux, sableux, glomaline..."
                  placeholder="Ajouter un type de sol..."
                  value={soils}
                  onChange={setSoils}
                />

                <TagsInput
                  label="2. Zones Climatiques (climates)"
                  description="mediterraneen, oceanique, continental, semi-aride..."
                  placeholder="Ajouter un climat..."
                  value={climates}
                  onChange={setClimates}
                />
              </Group>

              <Group grow align="flex-start">
                <TagsInput
                  label="3. Zonage Géographique & Altitude (latitudes / altitudes)"
                  description="40-45N, plaine-0-200m, colline-200-500m..."
                  placeholder="Ajouter latitude/altitude..."
                  value={[...latitudes, ...altitudes]}
                  onChange={(vals) => {
                    const lats = vals.filter(v => v.includes('N') || v.includes('S') || v.includes('lat'))
                    const alts = vals.filter(v => !lats.includes(v))
                    setLatitudes(lats.length > 0 ? lats : vals.slice(0, 1))
                    setAltitudes(alts)
                  }}
                />

                <TagsInput
                  label="4. Itinéraires Techniques (itineraries)"
                  description="viticulture-bio, enherbement-permanent, rouleau-faca..."
                  placeholder="Ajouter un itinéraire technique..."
                  value={itineraries}
                  onChange={setItineraries}
                />
              </Group>

              <Divider my="xs" />

              <Group justify="flex-end">
                <Button
                  type="submit"
                  leftSection={<IconDeviceFloppy size={16} />}
                  loading={loading}
                  color="blue"
                >
                  Enregistrer & Valider OKF
                </Button>
              </Group>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="preview">
          <Paper withBorder p="md" radius="sm" bg="var(--mantine-color-dark-8)">
            <Code block style={{ whiteSpace: 'pre-wrap' }}>
              {generatedYaml}
            </Code>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}
