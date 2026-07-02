import { migratePilot, type PilotSheet } from '../../domain/entities/PilotSheet';

export function parsePilotImportJson(json: string, fallbackId: string): PilotSheet {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Não foi possível ler o arquivo JSON.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Arquivo JSON inválido.');
  }

  const data = parsed as Partial<PilotSheet> & { id?: string };
  const id = typeof data.id === 'string' && data.id.trim() ? data.id.trim() : fallbackId;
  return migratePilot({ ...data, id });
}
