import type { PilotSheet } from '../../domain/entities/PilotSheet';
import { EXPORT_LABELS } from '../../shared/constants/exportLabels';
import { getPlaybookById } from '../../shared/data/beamSaberPilotData';

export function PilotSidebar({
  pilots,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onImportClick,
  onClose,
  className = '',
}: {
  pilots: PilotSheet[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onImportClick: () => void;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <aside className={`hud-panel hud-sidebar ${className}`.trim()}>
      <div className="hud-sidebar__head">
        <div>
          <p className="mb-0.5 font-mono text-[0.55rem] tracking-[0.3em] text-[var(--hud-muted)]">MECHA</p>
          <h1 className="hud-sidebar-title mb-1">BEAM SABER</h1>
          <p className="font-mono text-[0.6rem] text-[var(--hud-muted)]">REGISTRO DE PILOTOS · LOCAL</p>
        </div>
        {onClose && (
          <button type="button" className="hud-sidebar__close hud-btn" onClick={onClose} aria-label="Fechar menu">
            ×
          </button>
        )}
      </div>

      <button type="button" onClick={onCreate} className="hud-btn mb-2 w-full">
        + NOVO PILOTO
      </button>
      <button
        type="button"
        onClick={onImportClick}
        className="hud-btn mb-4 w-full !text-[var(--hud-muted)]"
      >
        {EXPORT_LABELS.importJson}
      </button>

      <ul className="hud-sidebar__list space-y-1">
        {pilots.map((p) => {
          const pb = getPlaybookById(p.playbookId);
          return (
            <li key={p.id} className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className={`min-w-0 flex-1 border px-3 py-2.5 text-left transition-colors ${
                  p.id === activeId
                    ? 'border-[var(--hud-accent)] bg-[rgba(0,212,255,0.12)] text-[var(--hud-accent)]'
                    : 'border-transparent text-[var(--hud-muted)] hover:border-[var(--hud-border)] hover:bg-[rgba(0,0,0,0.2)]'
                }`}
              >
                <div className="truncate font-mono text-sm font-semibold">
                  {p.callSign || p.name || 'SEM NOME'}
                </div>
                {pb && (
                  <div className="truncate font-mono text-[0.6rem] uppercase opacity-60">{pb.name}</div>
                )}
              </button>
              <button
                type="button"
                title="Excluir"
                onClick={() => {
                  if (confirm('Excluir esta ficha?')) onDelete(p.id);
                }}
                className="pilot-delete-btn hud-btn hud-btn--danger min-h-[44px] min-w-[44px] px-2"
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>

      {pilots.length > 0 && (
        <p className="mt-4 font-mono text-[0.6rem] text-[var(--hud-muted)]">UNIDADES: {pilots.length}</p>
      )}
    </aside>
  );
}
