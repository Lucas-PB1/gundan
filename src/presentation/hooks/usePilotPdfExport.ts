import { useCallback, useState } from 'react';
import {
  exportPilotSheetPdf,
  pilotSheetPdfFilename,
  pilotSheetJsonFilename,
  downloadPilotJson,
} from '../../application/export/exportPilotSheet';
import type { PilotSheet } from '../../domain/entities/PilotSheet';
import { EXPORT_LABELS } from '../../shared/constants/exportLabels';

export function usePilotPdfExport(pilot: PilotSheet) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPdf = useCallback(async () => {
    setExporting(true);
    setError(null);

    try {
      const filename = pilotSheetPdfFilename(pilot.callSign, pilot.name);
      await exportPilotSheetPdf(pilot, filename);
    } catch {
      setError(EXPORT_LABELS.exportError);
    } finally {
      setExporting(false);
    }
  }, [pilot]);

  const exportJson = useCallback(() => {
    const filename = pilotSheetJsonFilename(pilot.callSign, pilot.name);
    downloadPilotJson(pilot, filename);
  }, [pilot]);

  return { exportPdf, exportJson, exporting, error, clearError: () => setError(null) };
}
