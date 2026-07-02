import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { usePilotStorage } from './application/usePilotStorage';
import { PilotEditor } from './presentation/components/PilotEditor';
import { PilotSidebar } from './presentation/components/PilotSidebar';
import { getPlaybookById } from './shared/data/beamSaberPilotData';
import { popIn, hudSpring, modalBackdrop, tapScale } from './presentation/motion/hudMotion';

export default function App() {
  const importRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const reduced = useReducedMotion();
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
    resetPilot,
  } = usePilotStorage();

  const activeLabel = activePilot?.callSign || activePilot?.name || 'Sem piloto';
  const activePlaybook = activePilot ? getPlaybookById(activePilot.playbookId)?.name : null;

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      importPilot(text);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao importar JSON.');
    }
  };

  const handleSelectPilot = (id: string) => {
    selectPilot(id);
    setSidebarOpen(false);
  };

  const handleCreatePilot = () => {
    createPilot();
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell min-h-screen">
      <motion.header
        className="hud-mobile-bar lg:hidden"
        initial={reduced ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={hudSpring}
      >
        <motion.button
          type="button"
          className="hud-mobile-bar__menu hud-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir lista de pilotos"
          whileTap={reduced ? undefined : tapScale}
        >
          ☰ Pilotos
        </motion.button>
        <div className="hud-mobile-bar__title min-w-0">
          <p className="truncate font-mono text-sm font-bold text-white">{activeLabel}</p>
          {activePlaybook && (
            <p className="truncate font-mono text-[0.6rem] uppercase text-[var(--hud-muted)]">
              {activePlaybook}
            </p>
          )}
        </div>
      </motion.header>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            className="hud-sidebar-backdrop lg:hidden"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <div className="app-shell__inner mx-auto flex max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4 sm:py-6 lg:flex-row lg:gap-6 lg:py-8">
        <PilotSidebar
          pilots={pilots}
          activeId={activeId}
          onSelect={handleSelectPilot}
          onCreate={handleCreatePilot}
          onDelete={deletePilot}
          onImportClick={() => importRef.current?.click()}
          onClose={() => setSidebarOpen(false)}
          mobileOpen={sidebarOpen}
        />

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

        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            {activePilot ? (
              <motion.div
                key={activePilot.id}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={hudSpring}
              >
                <PilotEditor
                  pilot={activePilot}
                  otherPilots={otherPilots}
                  savedAt={savedAt}
                  onChange={updatePilot}
                  onReset={() => resetPilot(activePilot.id)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="hud-panel p-8 text-center sm:p-12"
                variants={popIn}
                initial="hidden"
                animate="visible"
              >
                <p className="mb-1 font-mono text-[0.65rem] tracking-widest text-[var(--hud-accent)]">
                  AGUARDANDO PILOTO
                </p>
                <p className="mb-4 text-[var(--hud-muted)]">Nenhuma unidade registrada.</p>
                <motion.button
                  type="button"
                  onClick={handleCreatePilot}
                  className="hud-btn hud-btn--primary"
                  whileTap={reduced ? undefined : tapScale}
                >
                  Inicializar piloto
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
