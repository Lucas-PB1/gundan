import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import {
  countCreationPending,
  getCreationChecklist,
  getDiscretionaryPoints,
  isCreationComplete,
} from '../../../domain/creation/beamSaberCreationProgress';
import type { PilotEditorNavigate } from '../../../shared/constants/pilotEditorTabs';
import { CREATION_ANCHORS } from '../../../shared/constants/pilotEditorTabs';
import { sectionClass, sectionTitleClass } from './Field';

function ProgressBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;
  return (
    <div className="creation-checklist__bar" aria-hidden>
      <div className="creation-checklist__bar-fill" style={{ width: `${pct}%` }} />
    </div>
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

  return (
    <section className={`${sectionClass} creation-checklist`}>
      <div className="creation-checklist__head">
        <h3 className={sectionTitleClass}>Checklist de criação</h3>
        <span
          className={`creation-checklist__status ${
            complete ? 'creation-checklist__status--done' : 'creation-checklist__status--pending'
          }`}
        >
          {complete ? 'Pronto' : `${pending} pendente${pending === 1 ? '' : 's'}`}
        </span>
      </div>

      <p className="creation-checklist__intro">
        Os itens marcam ✓ automaticamente ao preencher a ficha. Clique para ir ao campo.
      </p>

      <div className="creation-checklist__points">
        <button
          type="button"
          className="creation-checklist__point-card creation-checklist__point-card--link"
          onClick={() => onNavigate('actions', CREATION_ANCHORS.actions)}
        >
          <span className="creation-checklist__point-label">Pontos livres (piloto/robô)</span>
          <strong className="creation-checklist__point-value">
            {points.step7Spent}/{CREATION_LIMITS_DISPLAY.step7}
          </strong>
          <ProgressBar current={points.step7Spent} max={CREATION_LIMITS_DISPLAY.step7} />
          {points.step7Remaining > 0 ? (
            <p className="creation-checklist__point-hint">
              Faltam <strong>{points.step7Remaining}</strong> → aba Ações
            </p>
          ) : (
            <p className="creation-checklist__point-hint creation-checklist__point-hint--ok">Completo</p>
          )}
        </button>
        <button
          type="button"
          className="creation-checklist__point-card creation-checklist__point-card--link"
          onClick={() => onNavigate('actions', CREATION_ANCHORS.actions)}
        >
          <span className="creation-checklist__point-label">Pontos do robô</span>
          <strong className="creation-checklist__point-value">
            {points.vehicleCreationSpent}/{CREATION_LIMITS_DISPLAY.vehicle}
          </strong>
          <ProgressBar
            current={points.vehicleCreationSpent}
            max={CREATION_LIMITS_DISPLAY.vehicle}
          />
          {points.vehicleCreationRemaining > 0 ? (
            <p className="creation-checklist__point-hint">
              Faltam <strong>{points.vehicleCreationRemaining}</strong> → aba Ações
            </p>
          ) : (
            <p className="creation-checklist__point-hint creation-checklist__point-hint--ok">Completo</p>
          )}
        </button>
      </div>

      <ul className="creation-checklist__list">
        {items.map((item) => (
          <li key={item.id}>
            <button
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
            >
              <span className="creation-checklist__check" aria-hidden>
                {item.warn ? '!' : item.skipped ? '—' : item.done ? '✓' : '○'}
              </span>
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
            </button>
          </li>
        ))}
      </ul>
    </section>
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

  if (pending === 0 && totalRemaining === 0) return null;

  return (
    <div className="creation-checklist-summary hud-info-box">
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
    </div>
  );
}
