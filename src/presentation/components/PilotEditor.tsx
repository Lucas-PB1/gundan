import { useState } from 'react';
import type { PilotSheet } from '../../domain/entities/PilotSheet';
import { getPlaybookById } from '../../shared/data/beamSaberPilotData';
import { EXPORT_LABELS } from '../../shared/constants/exportLabels';
import { usePilotPdfExport } from '../hooks/usePilotPdfExport';
import { PilotPdfContent } from './export/PilotPdfContent';
import { ActionsTab } from './tabs/ActionsTab';
import { ConditionTab } from './tabs/ConditionTab';
import { ConnectionsTab } from './tabs/ConnectionsTab';
import { IdentityTab } from './tabs/IdentityTab';
import { LoadoutTab } from './tabs/LoadoutTab';
import { VehicleTab } from './tabs/VehicleTab';
import '../styles/pilot-pdf.css';

const TABS = [
  { id: 'identity', label: 'Identidade' },
  { id: 'actions', label: 'Ações' },
  { id: 'condition', label: 'Condição' },
  { id: 'connections', label: 'Conexões' },
  { id: 'loadout', label: 'Equip.' },
  { id: 'vehicle', label: 'Veículo' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function PilotEditor({
  pilot,
  otherPilots,
  savedAt,
  onChange,
}: {
  pilot: PilotSheet;
  otherPilots: PilotSheet[];
  savedAt: Date | null;
  onChange: (p: PilotSheet) => void;
}) {
  const [tab, setTab] = useState<TabId>('identity');
  const playbook = getPlaybookById(pilot.playbookId);
  const { pdfRef, exportPdf, exportJson, exporting, error } = usePilotPdfExport(pilot);

  return (
    <div className="flex flex-col gap-4">
      <header className="hud-panel flex flex-wrap items-end justify-between gap-4 !pb-3">
        <div>
          <p className="mb-1 font-mono text-[0.6rem] tracking-[0.25em] text-[var(--hud-accent-dim)]">
            PILOT DATA // UNIT {pilot.id.slice(0, 8).toUpperCase()}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {pilot.callSign || pilot.name || 'NOVO PILOTO'}
          </h2>
          <p className="font-mono text-xs text-[var(--hud-muted)]">
            {playbook?.name ?? 'SEM PLAYBOOK'}
            {pilot.name && pilot.callSign ? ` · ${pilot.name}` : ''}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportJson} className="hud-btn">
              {EXPORT_LABELS.exportJson}
            </button>
            <button
              type="button"
              onClick={exportPdf}
              disabled={exporting}
              className="hud-btn hud-btn--primary"
            >
              {exporting ? EXPORT_LABELS.exportPdfBusy : EXPORT_LABELS.exportPdf}
            </button>
          </div>
          <p className="font-mono text-[0.65rem] text-[var(--hud-muted)]">
            {savedAt ? `SYNC ${savedAt.toLocaleTimeString('pt-BR')}` : 'SYNC…'}
          </p>
          {error && <p className="text-xs text-[var(--hud-warn)]">{error}</p>}
        </div>
      </header>

      <nav className="flex flex-wrap gap-1 border-b border-[var(--hud-border)] pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`hud-tab ${tab === t.id ? 'hud-tab--active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'identity' && <IdentityTab pilot={pilot} onChange={onChange} />}
      {tab === 'actions' && <ActionsTab pilot={pilot} onChange={onChange} />}
      {tab === 'condition' && <ConditionTab pilot={pilot} onChange={onChange} />}
      {tab === 'connections' && (
        <ConnectionsTab pilot={pilot} otherPilots={otherPilots} onChange={onChange} />
      )}
      {tab === 'loadout' && <LoadoutTab pilot={pilot} onChange={onChange} />}
      {tab === 'vehicle' && <VehicleTab pilot={pilot} onChange={onChange} />}

      <div className="bs-pdf-root" aria-hidden>
        <div ref={pdfRef}>
          <PilotPdfContent pilot={pilot} />
        </div>
      </div>
    </div>
  );
}
