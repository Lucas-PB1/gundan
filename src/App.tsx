import { useRef } from 'react';
import { usePilotStorage } from './application/usePilotStorage';
import { PilotEditor } from './presentation/components/PilotEditor';
import { EXPORT_LABELS } from './shared/constants/exportLabels';
import { getPlaybookById } from './shared/data/beamSaberPilotData';

export default function App() {
  const importRef = useRef<HTMLInputElement>(null);
  const {
    pilots,
    activePilot,
    activeId,
    otherPilots,
    savedAt,
    createPilot,
    selectPilot,
    deletePilot,
    updatePilot,
    importPilot,
  } = usePilotStorage();

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      importPilot(text);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao importar JSON.');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <aside className="hud-panel w-full shrink-0 lg:w-56">
          <p className="mb-0.5 font-mono text-[0.55rem] tracking-[0.3em] text-[var(--hud-muted)]">
            MOBILE SUIT
          </p>
          <h1 className="hud-sidebar-title mb-1">BEAM SABER</h1>
          <p className="mb-4 font-mono text-[0.6rem] text-[var(--hud-muted)]">PILOT REGISTRY · LOCAL</p>
          <button type="button" onClick={createPilot} className="hud-btn mb-2 w-full">
            + NOVO PILOTO
          </button>
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="hud-btn mb-4 w-full !text-[var(--hud-muted)]"
          >
            {EXPORT_LABELS.importJson}
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
              e.target.value = '';
            }}
          />
          <ul className="space-y-1">
            {pilots.map((p) => {
              const pb = getPlaybookById(p.playbookId);
              return (
                <li key={p.id} className="group flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => selectPilot(p.id)}
                    className={`min-w-0 flex-1 border px-3 py-2 text-left transition-colors ${
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
                      if (confirm('Excluir esta ficha?')) deletePilot(p.id);
                    }}
                    className="hud-btn hud-btn--danger px-1 opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
          {pilots.length > 0 && (
            <p className="mt-4 font-mono text-[0.6rem] text-[var(--hud-muted)]">
              UNITS: {pilots.length}
            </p>
          )}
        </aside>

        <main className="min-w-0 flex-1">
          {activePilot ? (
            <PilotEditor
              pilot={activePilot}
              otherPilots={otherPilots}
              savedAt={savedAt}
              onChange={updatePilot}
            />
          ) : (
            <div className="hud-panel p-12 text-center">
              <p className="mb-1 font-mono text-[0.65rem] tracking-widest text-[var(--hud-accent)]">
                AWAITING PILOT
              </p>
              <p className="mb-4 text-[var(--hud-muted)]">Nenhuma unidade registrada.</p>
              <button type="button" onClick={createPilot} className="hud-btn hud-btn--primary">
                Inicializar piloto
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
