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
import { ThematicBadgeGroup, type TaxonomyNode } from '@quatrain/ux-taxonomy'

export interface AxisItem {
  id: string
  label?: string
  title?: string
  slug?: string
  path?: string
  description?: string
}

export interface AxisDefinition {
  id: string
  label: string
  folder?: string
  color?: string
  description?: string
  items?: AxisItem[]
}

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
  crops?: string[]
  axes?: Record<string, string[]>
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
  /** Configured dynamic axes (soils, climates, crops, itineraries, etc.) */
  axes?: AxisDefinition[]
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
  axes = [],
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
  
  // Per-axis values state (dynamic dictionary of axisId -> string[])
  const [axisValues, setAxisValues] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = { ...(initialValues.axes || {}) }
    if (initialValues.soils) initial.soils = initialValues.soils
    if (initialValues.climates) initial.climates = initialValues.climates
    if (initialValues.crops) initial.crops = initialValues.crops
    if (initialValues.itineraries) initial.itineraries = initialValues.itineraries
    return initial
  })

  const [latitudes, setLatitudes] = useState<string[]>(initialValues.latitudes || [])
  const [altitudes, setAltitudes] = useState<string[]>(initialValues.altitudes || [])
  const [soa, setSoa] = useState(initialValues.soa || 'bradtech/world-agronomy')
  const [revision, setRevision] = useState(initialValues.revision || 'rev-1.0.0')
  const [source, setSource] = useState(initialValues.source || '')
  const [documentDate, setDocumentDate] = useState(initialValues.documentDate || '')

  const handleAxisChange = (axisId: string, values: string[]) => {
    setAxisValues((prev) => ({
      ...prev,
      [axisId]: values
    }))
  }

  const categoryOptions = thematics.map((t) => ({
    value: t.id,
    label: t.label
  }))
  if (!categoryOptions.some((o) => o.value === 'inbox')) {
    categoryOptions.unshift({ value: 'inbox', label: 'Inbox (Général)' })
  }

  // Generate YAML frontmatter including only selected/non-empty axes
  const renderedAxisBlocks = Object.entries(axisValues)
    .filter(([_, vals]) => vals && vals.length > 0)
    .map(([axisKey, vals]) => `${axisKey}:\n${vals.map((v) => `  - ${v}`).join('\n')}`)
    .join('\n')

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
${renderedAxisBlocks}
${latitudes.length > 0 ? `latitudes:\n${latitudes.map((l) => `  - ${l}`).join('\n')}` : ''}
${altitudes.length > 0 ? `altitudes:\n${altitudes.map((a) => `  - ${a}`).join('\n')}` : ''}
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
      axes: axisValues,
      soils: axisValues.soils || [],
      climates: axisValues.climates || [],
      crops: axisValues.crops || [],
      itineraries: axisValues.itineraries || [],
      latitudes,
      altitudes,
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

              <Divider my="xs" label="Axes de Classification Déclarés (Évolutifs & Optionnels)" labelPosition="center" />

              {axes && axes.length > 0 ? (
                <Stack gap="sm">
                  {axes.map((axis) => {
                    const autocompleteOptions = axis.items?.map((it) => it.slug || it.id) || []
                    return (
                      <TagsInput
                        key={axis.id}
                        label={`${axis.label} (${axis.id})`}
                        description={axis.description || `Sélectionnez des fiches de l'axe ${axis.label} (${axis.items?.length || 0} fiches disponibles)`}
                        placeholder={`Sélectionner ou saisir (${axis.id})...`}
                        data={autocompleteOptions}
                        value={axisValues[axis.id] || []}
                        onChange={(vals) => handleAxisChange(axis.id, vals)}
                      />
                    )
                  })}
                </Stack>
              ) : (
                <Stack gap="xs">
                  <Group grow align="flex-start">
                    <TagsInput
                      label="1. Types de Sols (soils)"
                      description="argilo-calcaire, limoneux, sableux, glomaline..."
                      placeholder="Ajouter un type de sol..."
                      value={axisValues.soils || []}
                      onChange={(v) => handleAxisChange('soils', v)}
                    />

                    <TagsInput
                      label="2. Zones Climatiques (climates)"
                      description="mediterraneen, oceanique, continental, semi-aride..."
                      placeholder="Ajouter un climat..."
                      value={axisValues.climates || []}
                      onChange={(v) => handleAxisChange('climates', v)}
                    />
                  </Group>

                  <Group grow align="flex-start">
                    <TagsInput
                      label="3. Productions Végétales & Filières (crops)"
                      description="viticulture, arboriculture, maraichage, grandes-cultures..."
                      placeholder="Ajouter une production..."
                      value={axisValues.crops || []}
                      onChange={(v) => handleAxisChange('crops', v)}
                    />

                    <TagsInput
                      label="4. Itinéraires Techniques (itineraries)"
                      description="viticulture-bio, enherbement-permanent, rouleau-faca..."
                      placeholder="Ajouter un itinéraire technique..."
                      value={axisValues.itineraries || []}
                      onChange={(v) => handleAxisChange('itineraries', v)}
                    />
                  </Group>
                </Stack>
              )}

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
