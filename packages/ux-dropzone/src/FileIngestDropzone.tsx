import React from 'react'
import {
  Group,
  Text,
  rem,
  Stack,
  Paper,
  Progress,
  Badge,
  ActionIcon,
  Box
} from '@mantine/core'
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  PDF_MIME_TYPE,
  IMAGE_MIME_TYPE
} from '@mantine/dropzone'
import {
  IconUpload,
  IconFileTypePdf,
  IconPhoto,
  IconX,
  IconFileText,
  IconCheck,
  IconTrash
} from '@tabler/icons-react'

/**
 * Interface representing a pending or ingested file item.
 */
export interface IngestFileItem {
  id: string
  file?: File
  name: string
  size: number
  type: string
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
  progress?: number
  error?: string
}

/**
 * Props for FileIngestDropzone.
 */
export interface FileIngestDropzoneProps extends Partial<DropzoneProps> {
  /** Callback fired when files are dropped or selected */
  onDropFiles: (files: FileWithPath[]) => void
  /** List of currently queued or processing file items */
  items?: IngestFileItem[]
  /** Optional callback to remove a queued file item */
  onRemoveItem?: (id: string) => void
  /** Primary label */
  title?: string
  /** Sub-label or format instructions */
  description?: string
  /** Maximum allowable file size in bytes (default 50MB) */
  maxSize?: number
  /** Allowed MIME types */
  accept?: string[]
  /** Custom CSS class */
  className?: string
  /** Custom styles */
  style?: React.CSSProperties
}

/**
 * Multi-format drag-and-drop document upload and queue preview component.
 */
export const FileIngestDropzone: React.FC<FileIngestDropzoneProps> = ({
  onDropFiles,
  items = [],
  onRemoveItem,
  title = 'Glissez-déposez vos documents ici',
  description = 'PDF, EPUB, Markdown ou images jusqu’à 50 Mo',
  maxSize = 50 * 1024 * 1024,
  accept = [...PDF_MIME_TYPE, ...IMAGE_MIME_TYPE, 'text/plain', 'text/markdown'],
  className = '',
  style,
  ...dropzoneProps
}) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (mimeOrName: string) => {
    if (mimeOrName.includes('pdf') || mimeOrName.endsWith('.pdf')) {
      return <IconFileTypePdf size={24} color="var(--mantine-color-red-filled)" />
    }
    if (mimeOrName.includes('image')) {
      return <IconPhoto size={24} color="var(--mantine-color-teal-filled)" />
    }
    return <IconFileText size={24} color="var(--mantine-color-blue-filled)" />
  }

  return (
    <Box className={`q-file-ingest-dropzone ${className}`} style={style}>
      <Dropzone
        onDrop={onDropFiles}
        maxSize={maxSize}
        accept={accept}
        p="xl"
        radius="md"
        {...dropzoneProps}
      >
        <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(48), height: rem(48), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(48), height: rem(48), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconFileTypePdf
              style={{ width: rem(48), height: rem(48), color: 'var(--mantine-color-dimmed)' }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <Stack gap={2} align="center">
            <Text size="md" fw={600} inline>
              {title}
            </Text>
            <Text size="xs" c="dimmed" inline mt={4}>
              {description}
            </Text>
          </Stack>
        </Group>
      </Dropzone>

      {items.length > 0 && (
        <Stack gap="xs" mt="md">
          {items.map((item) => (
            <Paper key={item.id} withBorder p="xs" radius="sm">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                  {getFileIcon(item.type || item.name)}
                  <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" fw={500} truncate>
                      {item.name}
                    </Text>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">
                        {formatSize(item.size)}
                      </Text>
                      {item.status === 'completed' && (
                        <Badge size="xs" color="green" leftSection={<IconCheck size={10} />}>
                          Traité
                        </Badge>
                      )}
                      {item.status === 'processing' && (
                        <Badge size="xs" color="blue">
                          Analyse IA & Extraction...
                        </Badge>
                      )}
                      {item.status === 'error' && (
                        <Badge size="xs" color="red">
                          {item.error || 'Erreur'}
                        </Badge>
                      )}
                    </Group>
                  </Stack>
                </Group>

                {onRemoveItem && (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                )}
              </Group>

              {item.status === 'processing' && typeof item.progress === 'number' && (
                <Progress value={item.progress} size="xs" animated mt="xs" />
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}
