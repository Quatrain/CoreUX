import React, { useState } from 'react'
import {
  Modal,
  Stack,
  TextInput,
  TagsInput,
  NumberInput,
  Group,
  Button,
  Text,
  Paper,
  Badge,
  Alert,
  Divider
} from '@mantine/core'
import { IconFilter, IconDownload, IconPlant, IconInfoCircle } from '@tabler/icons-react'

export interface UserContextProfile {
  userId: string
  userName?: string
  soils: string[]
  climates: string[]
  latitude?: number
  altitude?: number
  itineraries: string[]
  crops?: string[]
  destinationPath?: string
}

export interface ContextExtractionModalProps {
  opened: boolean
  onClose: () => void
  onExtract: (profile: UserContextProfile) => Promise<void> | void
  availableSoils?: string[]
  availableClimates?: string[]
  availableItineraries?: string[]
  availableCrops?: string[]
  loading?: boolean
}

/**
 * Modal component allowing administrators to filter and extract a tailored OKF bundle
 * matching a specific farmer or user context profile for consumption in Modaka ("Hey Brad").
 */
export const ContextExtractionModal: React.FC<ContextExtractionModalProps> = ({
  opened,
  onClose,
  onExtract,
  availableSoils = ['argilo-calcaire', 'limoneux', 'sableux', 'schisteux', 'glomaline'],
  availableClimates = ['mediterraneen', 'oceanique', 'continental', 'semi-aride'],
  availableItineraries = ['viticulture-biologique', 'enherbement-permanent', 'rouleau-faca', 'agroforesterie-intra-parcellaire'],
  availableCrops = ['viticulture', 'arboriculture', 'maraichage', 'grandes-cultures', 'ppam', 'fourrages'],
  loading = false
}) => {
  const [userId, setUserId] = useState('user-vignoble-occitanie')
  const [userName, setUserName] = useState('Domaine des Vignes Vivantes')
  const [soils, setSoils] = useState<string[]>(['argilo-calcaire'])
  const [climates, setClimates] = useState<string[]>(['mediterraneen'])
  const [latitude, setLatitude] = useState<number | string>(43.6)
  const [altitude, setAltitude] = useState<number | string>(140)
  const [itineraries, setItineraries] = useState<string[]>(['viticulture-biologique', 'enherbement-permanent'])
  const [crops, setCrops] = useState<string[]>(['viticulture'])
  const [destinationPath, setDestinationPath] = useState('/Users/crapougnax/CODE/CRAPOUGNAX/second-brain-data')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onExtract({
      userId,
      userName,
      soils,
      climates,
      latitude: typeof latitude === 'number' ? latitude : parseFloat(latitude) || undefined,
      altitude: typeof altitude === 'number' ? altitude : parseFloat(altitude) || undefined,
      itineraries,
      crops,
      destinationPath
    })
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconPlant size={20} color="var(--mantine-color-green-6)" />
          <Text fw={700}>Extraction Contextuelle pour Modaka & "Hey Brad"</Text>
        </Group>
      }
      size="lg"
      radius="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Alert
            variant="light"
            color="blue"
            icon={<IconInfoCircle size={16} />}
            title="Extraction Sur-Mesure"
          >
            Sélectionnez les critères du terroir et des pratiques de l'Utilisateur X pour générer un sous-arbre OKF dédié avec mention de la Source d'Autorité (SOA: bradtech/world-agronomy) et révision.
          </Alert>

          <Group grow>
            <TextInput
              label="Identifiant Utilisateur / Exploitation"
              placeholder="user-vignoble-occitanie"
              value={userId}
              onChange={(e) => setUserId(e.currentTarget.value)}
              required
            />
            <TextInput
              label="Nom de l'exploitation / Espace"
              placeholder="Domaine des Vignes Vivantes"
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
            />
          </Group>

          <Divider label="Critères du Terroir (Axes Multi-Axiaux)" labelPosition="center" />

          <TagsInput
            label="Types de Sols cibles"
            description="Ex: argilo-calcaire, limoneux..."
            data={availableSoils}
            value={soils}
            onChange={setSoils}
          />

          <TagsInput
            label="Zones Climatiques cibles"
            description="Ex: mediterraneen, semi-aride..."
            data={availableClimates}
            value={climates}
            onChange={setClimates}
          />

          <Group grow>
            <NumberInput
              label="Latitude (°N)"
              placeholder="43.6"
              decimalScale={4}
              value={latitude}
              onChange={setLatitude}
            />
            <NumberInput
              label="Altitude moyenne (m)"
              placeholder="140"
              value={altitude}
              onChange={setAltitude}
            />
          </Group>

          <TagsInput
            label="Itinéraires Techniques & Pratiques"
            description="Ex: viticulture-biologique, enherbement-permanent, rouleau-faca..."
            data={availableItineraries}
            value={itineraries}
            onChange={setItineraries}
          />

          <TagsInput
            label="Productions Végétales Cibles (Filières)"
            description="Ex: viticulture, arboriculture, maraichage, grandes-cultures, ppam..."
            data={availableCrops}
            value={crops}
            onChange={setCrops}
          />

          <TextInput
            label="Répertoire de destination Modaka (OKF)"
            description="Chemin local ou dépôt Git de l'utilisateur où exposer 'Hey Brad'"
            value={destinationPath}
            onChange={(e) => setDestinationPath(e.currentTarget.value)}
          />

          <Divider />

          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button
              type="submit"
              color="green"
              leftSection={<IconDownload size={16} />}
              loading={loading}
            >
              Extraire & Déployer l'arbre OKF
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
