import { useCallback, useEffect, useState } from 'react';
import type { PilotSheet } from '../../domain/entities/PilotSheet';
import { getPlaybookById } from '../../shared/data/beamSaberPilotData';
import { EXPORT_LABELS } from '../../shared/constants/exportLabels';
import {
  PILOT_EDITOR_TABS,
  type PilotEditorTabId,
} from '../../shared/constants/pilotEditorTabs';
import { usePilotPdfExport } from '../hooks/usePilotPdfExport';
import { PilotPdfContent } from './export/PilotPdfContent';
import { ActionsTab } from './tabs/ActionsTab';
import { ConditionTab } from './tabs/ConditionTab';
import { ConnectionsTab } from './tabs/ConnectionsTab';
import { CreationTab } from './tabs/CreationTab';
import { IdentityTab } from './tabs/IdentityTab';
import { LoadoutTab } from './tabs/LoadoutTab';
import { VehicleTab } from './tabs/VehicleTab';
import { RollsTab } from './tabs/RollsTab';
import '../styles/pilot-pdf.css';

export function PilotEditor({
  pilot,
  otherPilots,
  savedAt,
  onChange,
  onReset,
}: {
  pilot: PilotSheet;
  otherPilots: PilotSheet[];
  savedAt: Date | null;
  onChange: (p: PilotSheet) => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<PilotEditorTabId>('identity');
  const [scrollAnchor, setScrollAnchor] = useState<string | null>(null);
  const playbook = getPlaybookById(pilot.playbookId);
  const { pdfRef, exportPdf, exportJson, exporting, error } = usePilotPdfExport(pilot);

  const navigateTo = useCallback((nextTab: PilotEditorTabId, anchor?: string) => {
    setTab(nextTab);
    setScrollAnchor(anchor ?? null);
  }, []);

  useEffect(() => {
    if (!scrollAnchor) return;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(scrollAnchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        el.classList.add('creation-anchor--flash');
        window.setTimeout(() => el.classList.remove('creation-anchor--flash'), 1400);
      }
      setScrollAnchor(null);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [tab, scrollAnchor]);

  const handleReset = () => {
    const label = pilot.callSign || pilot.name || 'esta ficha';
    if (
      confirm(
        `Resetar ${label}?\n\nTodos os campos voltam ao vazio. O piloto permanece na lista (mesmo ID).`,
      )
    ) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <header className="hud-panel flex flex-col gap-3 !pb-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="mb-1 font-mono text-[0.55rem] tracking-[0.2em] text-[var(--hud-accent-dim)] sm:text-[0.6rem] sm:tracking-[0.25em]">
            DADOS DO PILOTO // UNIDADE {pilot.id.slice(0, 8).toUpperCase()}
          </p>
          <h2 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
            {pilot.callSign || pilot.name || 'NOVO PILOTO'}
          </h2>
          <p className="truncate font-mono text-xs text-[var(--hud-muted)]">
            {playbook?.name ?? 'SEM ARQUÉTIPO'}
            {pilot.name && pilot.callSign ? ` · ${pilot.name}` : ''}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" onClick={exportJson} className="hud-btn min-h-[44px]">
              {EXPORT_LABELS.exportJson}
            </button>
            <button
              type="button"
              onClick={exportPdf}
              disabled={exporting}
              className="hud-btn hud-btn--primary min-h-[44px]"
            >
              {exporting ? EXPORT_LABELS.exportPdfBusy : EXPORT_LABELS.exportPdf}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="hud-btn hud-btn--danger col-span-2 min-h-[44px] sm:col-span-1"
            >
              Resetar ficha
            </button>
          </div>
          <p className="font-mono text-[0.65rem] text-[var(--hud-muted)] sm:text-right">
            {savedAt ? `Salvo ${savedAt.toLocaleTimeString('pt-BR')}` : 'Salvando…'}
          </p>
          {error && <p className="text-xs text-[var(--hud-warn)] sm:text-right">{error}</p>}
        </div>
      </header>

      <nav className="hud-tab-bar" aria-label="Seções da ficha">
        <div className="hud-tab-bar__scroll">
          {PILOT_EDITOR_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`hud-tab ${tab === t.id ? 'hud-tab--active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {tab === 'identity' && (
        <IdentityTab pilot={pilot} onChange={onChange} onNavigate={navigateTo} />
      )}
      {tab === 'creation' && <CreationTab pilot={pilot} onNavigate={navigateTo} />}
      {tab === 'actions' && <ActionsTab pilot={pilot} onChange={onChange} />}
      {tab === 'rolls' && <RollsTab pilot={pilot} />}
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
