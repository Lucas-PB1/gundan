import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import {
  countCreationPending,
  getCreationChecklist,
  getDiscretionaryPoints,
  isCreationComplete,
} from '../../../domain/creation/beamSaberCreationProgress';
import type { PilotEditorNavigate } from '../../../shared/constants/pilotEditorTabs';
import { CREATION_ANCHORS } from '../../../shared/constants/pilotEditorTabs';
import { checklistRow, hudSpring, staggerList, tapScale } from '../../motion/hudMotion';
import { sectionClass, sectionTitleClass } from './Field';

function ProgressBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  const reduced = useReducedMotion();

  return (
    <div className="creation-checklist__bar" aria-hidden>
      <motion.div
        className="creation-checklist__bar-fill"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 28 }}
      />
    </div>
  );
}

function PointCard({
  label,
  current,
  max,
  hint,
  complete,
  onClick,
}: {
  label: string;
  current: number;
  max: number;
  hint: ReactNode;
  complete: boolean;
  onClick: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      className="creation-checklist__point-card creation-checklist__point-card--link"
      onClick={onClick}
      whileTap={reduced ? undefined : tapScale}
      whileHover={reduced ? undefined : { y: -1 }}
      transition={hudSpring}
    >
      <span className="creation-checklist__point-label">{label}</span>
      <strong className="creation-checklist__point-value">
        {current}/{max}
      </strong>
      <ProgressBar current={current} max={max} />
      <p
        className={`creation-checklist__point-hint ${complete ? 'creation-checklist__point-hint--ok' : ''}`}
      >
        {hint}
      </p>
    </motion.button>
  );
}

export function CreationChecklist({
  pilot,
  onNavigate,
}: {
  pilot: PilotSheet;
  onNavigate: PilotEditorNavigate;
}) {
  const items = getCreationChecklist(pilot);
  const points = getDiscretionaryPoints(pilot);
  const complete = isCreationComplete(pilot);
  const pending = countCreationPending(pilot);
  const reduced = useReducedMotion();

  return (
    <motion.section
      className={`${sectionClass} creation-checklist`}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : hudSpring}
    >
      <div className="creation-checklist__head">
        <h3 className={sectionTitleClass}>Checklist de criação</h3>
        <motion.span
          className={`creation-checklist__status ${
            complete ? 'creation-checklist__status--done' : 'creation-checklist__status--pending'
          }`}
          key={complete ? 'done' : 'pending'}
          initial={reduced ? false : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={hudSpring}
        >
          {complete ? 'Pronto' : `${pending} pendente${pending === 1 ? '' : 's'}`}
        </motion.span>
      </div>

      <p className="creation-checklist__intro">
        Os itens marcam ✓ automaticamente ao preencher a ficha. Clique para ir ao campo.
      </p>

      <div className="creation-checklist__points">
        <PointCard
          label="Pontos livres (piloto/robô)"
          current={points.step7Spent}
          max={CREATION_LIMITS_DISPLAY.step7}
          complete={points.step7Remaining === 0}
          onClick={() => onNavigate('actions', CREATION_ANCHORS.actions)}
          hint={
            points.step7Remaining > 0 ? (
              <>
                Faltam <strong>{points.step7Remaining}</strong> → aba Ações
              </>
            ) : (
              'Completo'
            )
          }
        />
        <PointCard
          label="Pontos do robô"
          current={points.vehicleCreationSpent}
          max={CREATION_LIMITS_DISPLAY.vehicle}
          complete={points.vehicleCreationRemaining === 0}
          onClick={() => onNavigate('actions', CREATION_ANCHORS.actions)}
          hint={
            points.vehicleCreationRemaining > 0 ? (
              <>
                Faltam <strong>{points.vehicleCreationRemaining}</strong> → aba Ações
              </>
            ) : (
              'Completo'
            )
          }
        />
      </div>

      <motion.ul
        className="creation-checklist__list"
        variants={staggerList}
        initial="hidden"
        animate="visible"
      >
        {items.map((item) => (
          <motion.li key={item.id} variants={checklistRow}>
            <motion.button
              type="button"
              className={`creation-checklist__item ${
                item.warn
                  ? 'creation-checklist__item--warn'
                  : item.skipped
                    ? 'creation-checklist__item--skipped'
                    : item.done
                      ? 'creation-checklist__item--done'
                      : 'creation-checklist__item--pending'
              }`}
              onClick={() => onNavigate(item.tab, item.anchor)}
              whileTap={reduced ? undefined : tapScale}
              layout
            >
              <motion.span
                className="creation-checklist__check"
                aria-hidden
                key={item.done ? 'done' : item.warn ? 'warn' : 'open'}
                initial={reduced ? false : { scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={hudSpring}
              >
                {item.warn ? '!' : item.skipped ? '—' : item.done ? '✓' : '○'}
              </motion.span>
              <div className="creation-checklist__body">
                <span className="creation-checklist__label-row">
                  <span className="creation-checklist__label">{item.label}</span>
                  <span className="creation-checklist__goto">→ {item.tabLabel}</span>
                </span>
                {item.detail && <span className="creation-checklist__detail">{item.detail}</span>}
                {item.progress && (
                  <span className="creation-checklist__progress">
                    {item.progress.current}/{item.progress.max}
                  </span>
                )}
              </div>
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}

const CREATION_LIMITS_DISPLAY = { step7: 2, vehicle: 3 } as const;

export function CreationChecklistSummary({
  pilot,
  onNavigate,
}: {
  pilot: PilotSheet;
  onNavigate?: PilotEditorNavigate;
}) {
  const points = getDiscretionaryPoints(pilot);
  const pending = countCreationPending(pilot);
  const totalRemaining = points.step7Remaining + points.vehicleCreationRemaining;
  const reduced = useReducedMotion();

  if (pending === 0 && totalRemaining === 0) return null;

  return (
    <motion.div
      className="creation-checklist-summary hud-info-box"
      initial={reduced ? false : { opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={reduced ? { duration: 0 } : hudSpring}
    >
      <p className="m-0 text-[0.75rem]">
        <span className="font-semibold text-[var(--hud-accent)]">Criação:</span>{' '}
        {pending > 0 && (
          <span>
            {pending} item{pending === 1 ? '' : 's'} pendente{pending === 1 ? '' : 's'}
            {totalRemaining > 0 ? ' · ' : ''}
          </span>
        )}
        {points.step7Remaining > 0 && (
          <span>
            {points.step7Remaining} pt livre{points.step7Remaining === 1 ? '' : 's'}
            {points.vehicleCreationRemaining > 0 ? ' · ' : ''}
          </span>
        )}
        {points.vehicleCreationRemaining > 0 && (
          <span>{points.vehicleCreationRemaining} pt do robô</span>
        )}
        {onNavigate && (
          <>
            {' — '}
            <button
              type="button"
              className="creation-checklist-summary__link"
              onClick={() => onNavigate('creation')}
            >
              abrir checklist
            </button>
          </>
        )}
      </p>
    </motion.div>
  );
}
