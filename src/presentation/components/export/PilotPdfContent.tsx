import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import { countLoad } from '../../../domain/entities/PilotSheet';
import { LOAD_LIMITS } from '../../../shared/data/beamSaberGearData';
import {
  getPlaybookById,
  PILOT_ACTIONS,
  VEHICLE_ACTIONS,
} from '../../../shared/data/beamSaberPilotData';

function StressBoxes({ current, max }: { current: number; max: number }) {
  return (
    <div className="bs-pdf-doc__stress">
      {Array.from({ length: max + 1 }, (_, i) => (
        <div
          key={i}
          className={`bs-pdf-doc__stress-box ${i <= current ? 'bs-pdf-doc__stress-box--filled' : ''}`}
        />
      ))}
    </div>
  );
}

function TickRow({ ticks, max = 4 }: { ticks: number; max?: number }) {
  return (
    <div className="bs-pdf-doc__ticks">
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className={`bs-pdf-doc__tick ${i < ticks ? 'bs-pdf-doc__tick--filled' : ''}`} />
      ))}
    </div>
  );
}

function ActionBlock({
  title,
  actions,
  ratings,
}: {
  title: string;
  actions: { id: string; name: string }[];
  ratings: Record<string, number>;
}) {
  return (
    <div>
      <p className="bs-pdf-doc__line"><strong>{title}</strong></p>
      <div className="bs-pdf-doc__actions">
        {actions.map((a) => (
          <div key={a.id} className="bs-pdf-doc__action">
            <span className="bs-pdf-doc__action-name">{a.name}</span>
            <span className="bs-pdf-doc__action-rating">{ratings[a.id] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CONNECTION_LABELS = { squad: 'Esquadrão', rival: 'Rival', ally: 'Aliado' } as const;

export function PilotPdfContent({ pilot }: { pilot: PilotSheet }) {
  const playbook = getPlaybookById(pilot.playbookId);
  const equipped = pilot.loadout.filter((i) => i.equipped);
  const totalLoad = countLoad(pilot.loadout);
  const loadLimit = LOAD_LIMITS[pilot.loadMode];

  return (
    <article className="bs-pdf-doc">
      <header className="bs-pdf-doc__hero">
        <p className="bs-pdf-doc__eyebrow">Beam Saber RPG — Ficha de piloto</p>
        <h1 className="bs-pdf-doc__name">{pilot.callSign.trim() || pilot.name.trim() || 'Piloto'}</h1>
        <p className="bs-pdf-doc__subtitle">
          {[playbook?.name, pilot.name && pilot.callSign ? pilot.name : ''].filter(Boolean).join(' · ') || '—'}
        </p>
        <dl className="bs-pdf-doc__meta">
          {pilot.pronouns ? (
            <>
              <dt>Pronomes</dt>
              <dd>{pilot.pronouns}</dd>
            </>
          ) : null}
          {pilot.look ? (
            <>
              <dt>Aparência</dt>
              <dd>{pilot.look}</dd>
            </>
          ) : null}
          {pilot.ability ? (
            <>
              <dt>Habilidade</dt>
              <dd>{pilot.ability}</dd>
            </>
          ) : null}
          {pilot.extraAbilities.length > 0 ? (
            <>
              <dt>Extras</dt>
              <dd>{pilot.extraAbilities.join(', ')}</dd>
            </>
          ) : null}
        </dl>
      </header>

      <section className="bs-pdf-doc__section">
        <h2>História</h2>
        <div className="bs-pdf-doc__grid-2">
          <p className="bs-pdf-doc__line"><strong>History:</strong> {pilot.history || '—'}</p>
          <p className="bs-pdf-doc__line"><strong>Tragedy:</strong> {pilot.tragedy || '—'}</p>
          <p className="bs-pdf-doc__line"><strong>Opening:</strong> {pilot.opening || '—'}</p>
          <p className="bs-pdf-doc__line"><strong>Drive:</strong> {pilot.drive || '—'}</p>
        </div>
        <p className="bs-pdf-doc__line bs-pdf-doc__muted">
          Drive clocks:{' '}
          <TickRow ticks={pilot.driveClocks[0]} />{' '}
          <TickRow ticks={pilot.driveClocks[1]} />
        </p>
      </section>

      <section className="bs-pdf-doc__section">
        <h2>Ações</h2>
        <div className="bs-pdf-doc__grid-2">
          <ActionBlock title="Piloto" actions={PILOT_ACTIONS} ratings={pilot.actionRatings} />
          <ActionBlock title="Veículo" actions={VEHICLE_ACTIONS} ratings={pilot.vehicleActionRatings} />
        </div>
      </section>

      <section className="bs-pdf-doc__section">
        <h2>Condição</h2>
        <div className="bs-pdf-doc__grid-2">
          <div>
            <p className="bs-pdf-doc__line"><strong>Stress</strong> ({pilot.stress}/{pilot.stressMax})</p>
            <StressBoxes current={pilot.stress} max={pilot.stressMax} />
            <p className="bs-pdf-doc__line bs-pdf-doc__muted">
              Armor: {pilot.armorUsed ? 'gasto' : 'disponível'} · Spark: {pilot.sparkUsed ? 'gasto' : 'disponível'}
            </p>
          </div>
          <div className="bs-pdf-doc__grid-3">
            <div className="bs-pdf-doc__stat">
              <span className="bs-pdf-doc__stat-label">Playbook XP</span>
              <span className="bs-pdf-doc__stat-value">{pilot.playbookXp}/8</span>
            </div>
            <div className="bs-pdf-doc__stat">
              <span className="bs-pdf-doc__stat-label">General XP</span>
              <span className="bs-pdf-doc__stat-value">{pilot.generalXp}</span>
            </div>
            <div className="bs-pdf-doc__stat">
              <span className="bs-pdf-doc__stat-label">Insight XP</span>
              <span className="bs-pdf-doc__stat-value">{pilot.attributeXp.insight}/6</span>
            </div>
            <div className="bs-pdf-doc__stat">
              <span className="bs-pdf-doc__stat-label">Prowess XP</span>
              <span className="bs-pdf-doc__stat-value">{pilot.attributeXp.prowess}/6</span>
            </div>
            <div className="bs-pdf-doc__stat">
              <span className="bs-pdf-doc__stat-label">Resolve XP</span>
              <span className="bs-pdf-doc__stat-value">{pilot.attributeXp.resolve}/6</span>
            </div>
          </div>
        </div>
        <div className="bs-pdf-doc__harm-row">
          <span className="bs-pdf-doc__harm-label">Harm 1</span>
          <span>{pilot.harm.level1 || '—'}</span>
        </div>
        <div className="bs-pdf-doc__harm-row">
          <span className="bs-pdf-doc__harm-label">Harm 2</span>
          <span>{pilot.harm.level2 || '—'}</span>
        </div>
        <div className="bs-pdf-doc__harm-row">
          <span className="bs-pdf-doc__harm-label">Harm 3</span>
          <span>{pilot.harm.level3 || '—'}</span>
        </div>
        {pilot.harm.level4 && (
          <p className="bs-pdf-doc__line"><strong>Nível 4 — Morto</strong></p>
        )}
        {pilot.scars.length > 0 && (
          <p className="bs-pdf-doc__line">
            <strong>Scars:</strong>{' '}
            {pilot.scars.map((s) => (
              <span key={s} className="bs-pdf-doc__tag">{s}</span>
            ))}
          </p>
        )}
      </section>

      {pilot.connections.length > 0 && (
        <section className="bs-pdf-doc__section">
          <h2>Conexões</h2>
          <ul className="bs-pdf-doc__list">
            {pilot.connections.map((c) => (
              <li key={c.id}>
                <strong>{c.name || '—'}</strong> ({CONNECTION_LABELS[c.type]})
                {c.type !== 'ally' && (
                  <> · Clock: <TickRow ticks={c.ticks} /></>
                )}
                {c.beliefs.filter(Boolean).length > 0 && (
                  <span className="bs-pdf-doc__muted"> — {c.beliefs.filter(Boolean).join('; ')}</span>
                )}
                {c.description && (
                  <span className="bs-pdf-doc__muted"> — {c.description}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bs-pdf-doc__section">
        <h2>Equipamento</h2>
        <p className="bs-pdf-doc__line">
          <strong>Load:</strong> {totalLoad}/{loadLimit} ({pilot.loadMode})
        </p>
        {equipped.length > 0 ? (
          <ul className="bs-pdf-doc__list">
            {equipped.map((i) => (
              <li key={i.gearId}>{i.name} [Load {i.load}]</li>
            ))}
          </ul>
        ) : (
          <p className="bs-pdf-doc__muted">Nenhum item equipado.</p>
        )}
        {pilot.customGear && (
          <p className="bs-pdf-doc__line"><strong>Custom:</strong> {pilot.customGear}</p>
        )}
      </section>

      <section className="bs-pdf-doc__section">
        <h2>Veículo — {pilot.vehicleName || 'Sem nome'}</h2>
        {pilot.vehicleLook && (
          <p className="bs-pdf-doc__line">{pilot.vehicleLook}</p>
        )}
        <div className="bs-pdf-doc__harm-row">
          <span className="bs-pdf-doc__harm-label">Dmg 1</span>
          <span>{pilot.vehicleDamage.level1 || '—'}</span>
        </div>
        <div className="bs-pdf-doc__harm-row">
          <span className="bs-pdf-doc__harm-label">Dmg 2</span>
          <span>{pilot.vehicleDamage.level2 || '—'}</span>
        </div>
        <div className="bs-pdf-doc__harm-row">
          <span className="bs-pdf-doc__harm-label">Dmg 3</span>
          <span>{pilot.vehicleDamage.level3 || '—'}</span>
        </div>
        {pilot.vehicleDamage.level4 && (
          <p className="bs-pdf-doc__line"><strong>Destruído</strong></p>
        )}
        <p className="bs-pdf-doc__line bs-pdf-doc__muted">
          Breakdown: <TickRow ticks={pilot.breakdownTicks} /> · Enhance XP: {pilot.vehicleEnhanceXp}/4
        </p>
        {pilot.quirks.some((q) => q.name) && (
          <ul className="bs-pdf-doc__list">
            {pilot.quirks.filter((q) => q.name).map((q, i) => (
              <li key={i}>
                {q.name}
                {q.descriptor1 || q.descriptor2
                  ? ` (${[q.descriptor1, q.descriptor2].filter(Boolean).join(' / ')})`
                  : ''}
                {q.exhausted ? ' [exhausted]' : ''}
              </li>
            ))}
          </ul>
        )}
      </section>

      {pilot.notes && (
        <section className="bs-pdf-doc__section">
          <h2>Notas</h2>
          <p className="bs-pdf-doc__line">{pilot.notes}</p>
        </section>
      )}

      <footer className="bs-pdf-doc__footer">
        Gerado em {new Date().toLocaleString('pt-BR')} · Beam Saber playtest · Ferramenta de fãs
      </footer>
    </article>
  );
}
