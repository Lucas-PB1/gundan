import type { PilotSheet, HarmTrack } from '../../../domain/entities/PilotSheet';
import { countLoad } from '../../../domain/entities/PilotSheet';
import { LOAD_LIMITS, SCAR_CONDITIONS, type ScarCondition } from '../../../shared/data/beamSaberGearData';
import {
  getPlaybookById,
  getActionLabel,
  PILOT_ACTIONS,
  PILOT_ATTRIBUTES,
  VEHICLE_ACTIONS,
  VEHICLE_ATTRIBUTES,
} from '../../../shared/data/beamSaberPilotData';
import { attrLabel, loadLabel, loadModeLabel, scarLabel } from '../../../shared/i18n/pt';
import { getAbilityDescription, getAbilityLabel } from '../../../shared/data/beamSaberHelpData';
import { PILOT_HARM_LEVELS, VEHICLE_DAMAGE_LEVELS } from '../../../shared/data/beamSaberDamageHelp';

const PILOT_HARM_HINTS = PILOT_HARM_LEVELS.map((r) => ({
  level: String(r.level),
  hint: r.label.replace(/^Nível \d — /, ''),
}));

const VEHICLE_DAMAGE_HINTS = VEHICLE_DAMAGE_LEVELS.map((r) => ({
  level: String(r.level),
  hint: r.label.replace(/^Nível \d — /, ''),
}));

function StressTrack({ current, max }: { current: number; max: number }) {
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

function TickTrack({ ticks, max = 4 }: { ticks: number; max?: number }) {
  return (
    <div className="bs-pdf-doc__ticks">
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className={`bs-pdf-doc__tick ${i < ticks ? 'bs-pdf-doc__tick--filled' : ''}`} />
      ))}
    </div>
  );
}

function XpTrackPdf({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="bs-pdf-doc__xp-track">
      <div className="bs-pdf-doc__xp-head">
        <span>{label}</span>
        <span className="bs-pdf-doc__xp-count">
          {value}/{max}
        </span>
      </div>
      <div className="bs-pdf-doc__xp-boxes">
        {Array.from({ length: max }, (_, i) => (
          <div key={i} className={`bs-pdf-doc__xp-box ${i < value ? 'bs-pdf-doc__xp-box--on' : ''}`} />
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ label, active, tone }: { label: string; active: boolean; tone?: 'ok' | 'warn' }) {
  return (
    <span className={`bs-pdf-doc__badge ${active ? `bs-pdf-doc__badge--${tone ?? 'warn'}` : 'bs-pdf-doc__badge--ok'}`}>
      {label}: {active ? 'gasto' : 'disponível'}
    </span>
  );
}

function TextField({
  label,
  value,
  bonusActionId,
}: {
  label: string;
  value: string;
  bonusActionId?: string;
}) {
  const bonus =
    bonusActionId && bonusActionId.trim()
      ? `+1 ${getActionLabel(bonusActionId)}`
      : null;

  return (
    <div className="bs-pdf-doc__field">
      <span className="bs-pdf-doc__field-label">{label}</span>
      <p className="bs-pdf-doc__field-value">{value.trim() || '—'}</p>
      {bonus && <p className="bs-pdf-doc__field-bonus">{bonus}</p>}
    </div>
  );
}

function HarmStack({
  title,
  harm,
  level4Label,
  levelHints,
}: {
  title: string;
  harm: HarmTrack;
  level4Label: string;
  levelHints: readonly { level: string; hint: string }[];
}) {
  const rows = levelHints.map((row) => ({
    ...row,
    text: harm[`level${row.level}` as 'level1' | 'level2' | 'level3'],
  }));

  return (
    <div className="bs-pdf-doc__harm-stack">
      <p className="bs-pdf-doc__harm-title">{title}</p>
      {rows.map((row) => (
        <div key={row.level} className="bs-pdf-doc__harm-box">
          <span className="bs-pdf-doc__harm-level">
            {row.level}
            <small>{row.hint}</small>
          </span>
          <span className="bs-pdf-doc__harm-text">{row.text.trim() || '—'}</span>
        </div>
      ))}
      {harm.level4 && <div className="bs-pdf-doc__harm-box bs-pdf-doc__harm-box--fatal">{level4Label}</div>}
    </div>
  );
}

function ActionPanel({
  title,
  actions,
  ratings,
  attributes,
}: {
  title: string;
  actions: { id: string; name: string; attribute: string }[];
  ratings: Record<string, number>;
  attributes: readonly string[];
}) {
  return (
    <div className="bs-pdf-doc__panel">
      <h3 className="bs-pdf-doc__panel-title">{title}</h3>
      {attributes.map((attr) => {
        const group = actions.filter((a) => a.attribute === attr);
        if (group.length === 0) return null;
        return (
          <div key={attr} className="bs-pdf-doc__attr-group">
            <div className="bs-pdf-doc__attr-head">{attrLabel(attr)}</div>
            <div className="bs-pdf-doc__actions">
              {group.map((a) => (
                <div key={a.id} className="bs-pdf-doc__action">
                  <span className="bs-pdf-doc__action-name">{a.name}</span>
                  <span className="bs-pdf-doc__action-rating">{ratings[a.id] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CONNECTION_LABELS = { squad: 'Esquadrão', rival: 'Rival', ally: 'Aliado' } as const;

export function PilotPdfContent({ pilot }: { pilot: PilotSheet }) {
  const playbook = getPlaybookById(pilot.playbookId);
  const equipped = pilot.loadout.filter((i) => i.equipped);
  const totalLoad = countLoad(pilot.loadout);
  const loadLimit = LOAD_LIMITS[pilot.loadMode];
  const displayName = pilot.callSign.trim() || pilot.name.trim() || 'Piloto';
  const abilityDesc = pilot.ability ? getAbilityDescription(pilot.playbookId, pilot.ability) : undefined;

  return (
    <article className="bs-pdf-doc">
      <header className="bs-pdf-doc__hero">
        <div className="bs-pdf-doc__hero-main">
          <p className="bs-pdf-doc__eyebrow">Beam Saber RPG · Ficha de piloto</p>
          <h1 className="bs-pdf-doc__name">{displayName}</h1>
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
          </dl>
        </div>
        <div className="bs-pdf-doc__hero-aside">
          <div className="bs-pdf-doc__quick-stat">
            <span className="bs-pdf-doc__quick-label">Estresse</span>
            <span className="bs-pdf-doc__quick-value">
              {pilot.stress}/{pilot.stressMax}
            </span>
            <StressTrack current={pilot.stress} max={pilot.stressMax} />
          </div>
          <div className="bs-pdf-doc__badge-row">
            <StatusBadge label="Armadura" active={pilot.armorUsed} />
            <StatusBadge label="Centelha" active={pilot.sparkUsed} />
          </div>
        </div>
      </header>

      {(pilot.ability || pilot.extraAbilities.length > 0) && (
        <section className="bs-pdf-doc__section">
          <h2>Habilidades</h2>
          <div className="bs-pdf-doc__ability-grid">
            {pilot.ability ? (
              <div className="bs-pdf-doc__ability-card bs-pdf-doc__ability-card--primary">
                <span className="bs-pdf-doc__ability-tag">Principal</span>
                <strong>{getAbilityLabel(pilot.playbookId, pilot.ability)}</strong>
                {abilityDesc && <p>{abilityDesc}</p>}
              </div>
            ) : null}
            {pilot.extraAbilities.map((a) => {
              const desc = getAbilityDescription(pilot.playbookId, a);
              return (
                <div key={a} className="bs-pdf-doc__ability-card">
                  <strong>{getAbilityLabel(pilot.playbookId, a)}</strong>
                  {desc && <p>{desc}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="bs-pdf-doc__section">
        <h2>Narrativa</h2>
        <div className="bs-pdf-doc__grid-2">
          <TextField label="História" value={pilot.history} bonusActionId={pilot.historyBonusActionId} />
          <TextField label="Tragédia" value={pilot.tragedy} />
          <TextField label="Abertura" value={pilot.opening} bonusActionId={pilot.openingBonusActionId} />
          <TextField label="Impulso" value={pilot.drive} />
        </div>
        <div className="bs-pdf-doc__drive-row">
          <div className="bs-pdf-doc__drive-clock">
            <span>Relógio de impulso 1</span>
            <TickTrack ticks={pilot.driveClocks[0]} />
          </div>
          <div className="bs-pdf-doc__drive-clock">
            <span>Relógio de impulso 2</span>
            <TickTrack ticks={pilot.driveClocks[1]} />
          </div>
        </div>
      </section>

      <section className="bs-pdf-doc__section">
        <h2>Ações</h2>
        <div className="bs-pdf-doc__grid-2">
          <ActionPanel
            title="Piloto"
            actions={PILOT_ACTIONS}
            ratings={pilot.actionRatings}
            attributes={PILOT_ATTRIBUTES}
          />
          <ActionPanel
            title="Veículo"
            actions={VEHICLE_ACTIONS}
            ratings={pilot.vehicleActionRatings}
            attributes={VEHICLE_ATTRIBUTES}
          />
        </div>
      </section>

      <section className="bs-pdf-doc__section">
        <h2>Condição & experiência</h2>
        <div className="bs-pdf-doc__grid-2">
          <HarmStack
            title="Ferimentos do piloto"
            harm={pilot.harm}
            level4Label="Nível 4 — Morto"
            levelHints={PILOT_HARM_HINTS}
          />
          <div className="bs-pdf-doc__panel">
            <h3 className="bs-pdf-doc__panel-title">Experiência</h3>
            <div className="bs-pdf-doc__xp-grid">
              <XpTrackPdf label="Arquétipo" value={pilot.playbookXp} max={8} />
              <XpTrackPdf label="Geral" value={pilot.generalXp} max={10} />
              <XpTrackPdf label="Perspicácia" value={pilot.attributeXp.insight} max={6} />
              <XpTrackPdf label="Destreza" value={pilot.attributeXp.prowess} max={6} />
              <XpTrackPdf label="Determinação" value={pilot.attributeXp.resolve} max={6} />
            </div>
            <div className="bs-pdf-doc__inline-stat">
              <span>Relógio de cura</span>
              <TickTrack ticks={pilot.healingClockFilled} />
            </div>
          </div>
        </div>
        <div className="bs-pdf-doc__scars">
          <span className="bs-pdf-doc__scars-label">Marcas</span>
          <div className="bs-pdf-doc__scars-list">
            {SCAR_CONDITIONS.map((scar) => {
              const active = pilot.scars.includes(scar);
              return (
                <span
                  key={scar}
                  className={`bs-pdf-doc__tag ${active ? 'bs-pdf-doc__tag--on' : ''}`}
                >
                  {scarLabel(scar as ScarCondition)}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {pilot.connections.length > 0 && (
        <section className="bs-pdf-doc__section">
          <h2>Conexões</h2>
          <div className="bs-pdf-doc__conn-grid">
            {pilot.connections.map((c) => (
              <div key={c.id} className="bs-pdf-doc__conn-card">
                <div className="bs-pdf-doc__conn-head">
                  <strong>{c.name || '—'}</strong>
                  <span>{CONNECTION_LABELS[c.type]}</span>
                </div>
                {c.type !== 'ally' && (
                  <div className="bs-pdf-doc__inline-stat">
                    <span>Relógio</span>
                    <TickTrack ticks={c.ticks} />
                  </div>
                )}
                {c.beliefs.filter(Boolean).length > 0 && (
                  <p className="bs-pdf-doc__conn-beliefs">
                    <strong>Crenças:</strong> {c.beliefs.filter(Boolean).join(' · ')}
                  </p>
                )}
                {c.description && <p className="bs-pdf-doc__conn-desc">{c.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bs-pdf-doc__section">
        <h2>Equipamento</h2>
        <div className="bs-pdf-doc__load-bar">
          <span>
            Carga <strong>{totalLoad}</strong> / {loadLimit}
          </span>
          <span>{loadModeLabel(pilot.loadMode)}</span>
          <div className="bs-pdf-doc__load-meter">
            <div
              className={`bs-pdf-doc__load-fill ${totalLoad > loadLimit ? 'bs-pdf-doc__load-fill--over' : ''}`}
              style={{ width: `${Math.min(100, (totalLoad / loadLimit) * 100)}%` }}
            />
          </div>
        </div>
        {equipped.length > 0 ? (
          <ul className="bs-pdf-doc__gear-list">
            {equipped.map((i) => (
              <li key={i.gearId}>
                <span>{i.name}</span>
                <span className="bs-pdf-doc__gear-load">{loadLabel(i.load)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="bs-pdf-doc__muted">Nenhum item equipado.</p>
        )}
        {pilot.customGear && (
          <p className="bs-pdf-doc__line">
            <strong>Personalizado:</strong> {pilot.customGear}
          </p>
        )}
      </section>

      <section className="bs-pdf-doc__section">
        <h2>Veículo — {pilot.vehicleName || 'Sem nome'}</h2>
        {pilot.vehicleLook && <p className="bs-pdf-doc__vehicle-look">{pilot.vehicleLook}</p>}

        <div className="bs-pdf-doc__grid-2">
          <HarmStack
            title="Dano do veículo"
            harm={pilot.vehicleDamage}
            level4Label="Destruído (nível 4)"
            levelHints={VEHICLE_DAMAGE_HINTS}
          />
          <div className="bs-pdf-doc__panel">
            <h3 className="bs-pdf-doc__panel-title">Progresso</h3>
            <div className="bs-pdf-doc__inline-stat">
              <span>Colapso</span>
              <TickTrack ticks={pilot.breakdownTicks} />
            </div>
            <XpTrackPdf label="Aprimoramento" value={pilot.vehicleEnhanceXp} max={4} />
            <XpTrackPdf label={attrLabel('expertise')} value={pilot.vehicleAttributeXp.expertise} max={6} />
            <XpTrackPdf label={attrLabel('acuity')} value={pilot.vehicleAttributeXp.acuity} max={6} />
          </div>
        </div>

        <h3 className="bs-pdf-doc__subheading">Peculiaridades</h3>
        <div className="bs-pdf-doc__quirk-grid">
          {pilot.quirks.map((q, i) => (
            <div
              key={i}
              className={`bs-pdf-doc__quirk ${q.exhausted ? 'bs-pdf-doc__quirk--spent' : ''}`}
            >
              <div className="bs-pdf-doc__quirk-head">
                <span className="bs-pdf-doc__quirk-name">{q.name || `Peculiaridade ${i + 1}`}</span>
                {q.exhausted && <span className="bs-pdf-doc__quirk-flag">Esgotada</span>}
              </div>
              {q.descriptor1 ? <p className="bs-pdf-doc__quirk-plus">+ {q.descriptor1}</p> : null}
              {q.descriptor2 ? <p className="bs-pdf-doc__quirk-minus">− {q.descriptor2}</p> : null}
              {!q.descriptor1 && !q.descriptor2 && !q.name && (
                <p className="bs-pdf-doc__muted">—</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {pilot.notes && (
        <section className="bs-pdf-doc__section">
          <h2>Notas</h2>
          <p className="bs-pdf-doc__notes">{pilot.notes}</p>
        </section>
      )}

      <footer className="bs-pdf-doc__footer">
        <span>{displayName}</span>
        <span>Gerado em {new Date().toLocaleString('pt-BR')}</span>
        <span>Beam Saber playtest · Ferramenta de fãs</span>
      </footer>
    </article>
  );
}
