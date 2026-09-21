# @quatrain/ux-dropzone

Multi-format file drag-and-drop ingestion and upload preview component for Mantine UI.

## Features

- **Multi-Format Support**: Native presets for PDF (`application/pdf`), Images, Markdown, and Text documents.
- **Upload Progress & Queue State**: Built-in visual indicators for idle, uploading, processing (AI/OCR), completed, and error statuses.
- **Accessible & Responsive**: Built on top of `@mantine/dropzone` and Mantine UI theme tokens.

## Quick Start

```tsx
import { FileIngestDropzone } from '@quatrain/ux-dropzone'

export function MyUploader() {
  return (
    <FileIngestDropzone
      onDropFiles={(files) => console.log('Dropped:', files)}
    />
  )
}
```
