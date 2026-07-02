import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { PilotSheet } from '../../domain/entities/PilotSheet';
import { EXPORT_LABELS } from '../../shared/constants/exportLabels';
import { getPlaybookById } from '../../shared/data/beamSaberPilotData';
import { drawerPanel, hudSpring, staggerItem, staggerList, tapScale } from '../motion/hudMotion';

export function PilotSidebar({
  pilots,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onImportClick,
  onClose,
  mobileOpen = false,
}: {
  pilots: PilotSheet[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onImportClick: () => void;
  onClose?: () => void;
  mobileOpen?: boolean;
}) {
  const reduced = useReducedMotion();

  const content = (
    <>
      <div className="hud-sidebar__head">
        <div>
          <p className="mb-0.5 font-mono text-[0.55rem] tracking-[0.3em] text-[var(--hud-muted)]">MECHA</p>
          <h1 className="hud-sidebar-title mb-1">BEAM SABER</h1>
          <p className="font-mono text-[0.6rem] text-[var(--hud-muted)]">REGISTRO DE PILOTOS · LOCAL</p>
        </div>
        {onClose && (
          <motion.button
            type="button"
            className="hud-sidebar__close hud-btn"
            onClick={onClose}
            aria-label="Fechar menu"
            whileTap={reduced ? undefined : tapScale}
          >
            ×
          </motion.button>
        )}
      </div>

      <motion.button
        type="button"
        onClick={onCreate}
        className="hud-btn mb-2 w-full"
        whileTap={reduced ? undefined : tapScale}
      >
        + NOVO PILOTO
      </motion.button>
      <motion.button
        type="button"
        onClick={onImportClick}
        className="hud-btn mb-4 w-full !text-[var(--hud-muted)]"
        whileTap={reduced ? undefined : tapScale}
      >
        {EXPORT_LABELS.importJson}
      </motion.button>

      <motion.ul
        className="hud-sidebar__list space-y-1"
        variants={staggerList}
        initial="hidden"
        animate="visible"
      >
        {pilots.map((p) => {
          const pb = getPlaybookById(p.playbookId);
          const active = p.id === activeId;
          return (
            <motion.li key={p.id} className="group flex items-center gap-1" variants={staggerItem} layout>
              <motion.button
                type="button"
                onClick={() => onSelect(p.id)}
                className={`min-w-0 flex-1 border px-3 py-2.5 text-left ${
                  active
                    ? 'border-[var(--hud-accent)] bg-[rgba(0,212,255,0.12)] text-[var(--hud-accent)]'
                    : 'border-transparent text-[var(--hud-muted)] hover:border-[var(--hud-border)] hover:bg-[rgba(0,0,0,0.2)]'
                }`}
                whileTap={reduced ? undefined : tapScale}
                layout
              >
                <div className="truncate font-mono text-sm font-semibold">
                  {p.callSign || p.name || 'SEM NOME'}
                </div>
                {pb && (
                  <div className="truncate font-mono text-[0.6rem] uppercase opacity-60">{pb.name}</div>
                )}
              </motion.button>
              <motion.button
                type="button"
                title="Excluir"
                onClick={() => {
                  if (confirm('Excluir esta ficha?')) onDelete(p.id);
                }}
                className="pilot-delete-btn hud-btn hud-btn--danger min-h-[44px] min-w-[44px] px-2"
                whileTap={reduced ? undefined : tapScale}
              >
                ×
              </motion.button>
            </motion.li>
          );
        })}
      </motion.ul>

      {pilots.length > 0 && (
        <p className="mt-4 font-mono text-[0.6rem] text-[var(--hud-muted)]">UNIDADES: {pilots.length}</p>
      )}
    </>
  );

  return (
    <>
      <aside className="hud-panel hud-sidebar hud-sidebar--desktop hidden lg:block">{content}</aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="hud-panel hud-sidebar hud-sidebar--mobile lg:hidden"
            variants={drawerPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={reduced ? { duration: 0 } : hudSpring}
          >
            {content}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
