import type { PilotSheet } from '../../domain/entities/PilotSheet';
import { downloadBlob, saveBlobWithPicker } from './saveFile';

function slugify(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'piloto'
  );
}

export function pilotSheetPdfFilename(callSign: string, name: string): string {
  const label = callSign.trim() || name.trim() || 'piloto';
  return `beam-saber-${slugify(label)}.pdf`;
}

export function pilotSheetJsonFilename(callSign: string, name: string): string {
  const label = callSign.trim() || name.trim() || 'piloto';
  return `beam-saber-${slugify(label)}.json`;
}

async function buildPilotSheetPdfBlob(pilot: PilotSheet): Promise<Blob> {
  const { buildPilotPdfBlob } = await import('../../presentation/components/export/PilotPdfDocument');
  return buildPilotPdfBlob(pilot);
}

/** Gera o PDF e abre o diálogo para escolher onde salvar (com fallback para download). */
export async function exportPilotSheetPdf(
  pilot: PilotSheet,
  filename: string,
): Promise<'saved' | 'cancelled' | 'downloaded'> {
  const blob = await buildPilotSheetPdfBlob(pilot);
  const result = await saveBlobWithPicker(blob, filename);

  if (result === 'saved' || result === 'cancelled') {
    return result === 'saved' ? 'saved' : 'cancelled';
  }

  downloadBlob(blob, filename);
  return 'downloaded';
}

export function downloadPilotJson(pilot: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(pilot, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  downloadBlob(blob, filename);
}
