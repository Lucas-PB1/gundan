export interface SaveFilePickerType {
  description: string;
  accept: Record<string, string[]>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: SaveFilePickerType[];
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

const PDF_PICKER_TYPE: SaveFilePickerType = {
  description: 'Documento PDF',
  accept: { 'application/pdf': ['.pdf'] },
};

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function getSaveFilePicker():
  | ((options: SaveFilePickerOptions) => Promise<FileSystemFileHandle>)
  | undefined {
  const w = window as Window & {
    showSaveFilePicker?: (options: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  };
  return typeof w.showSaveFilePicker === 'function' ? w.showSaveFilePicker : undefined;
}

/** Abre o diálogo do sistema para escolher pasta/arquivo. Retorna true se salvou. */
export async function saveBlobWithPicker(
  blob: Blob,
  suggestedName: string,
  types: SaveFilePickerType[] = [PDF_PICKER_TYPE],
): Promise<'saved' | 'cancelled' | 'unsupported'> {
  const showSaveFilePicker = getSaveFilePicker();
  if (!showSaveFilePicker) {
    return 'unsupported';
  }

  try {
    const handle = await showSaveFilePicker({
      suggestedName,
      types,
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return 'saved';
  } catch (error) {
    if (isAbortError(error)) return 'cancelled';
    throw error;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
