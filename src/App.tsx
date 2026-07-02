import { useMemo, useState } from 'react';
import {
  applyPlaybookStartingBonuses,
  createEmptyPilotSheet,
  loadPilots,
  upsertPilot,
  type PilotSheet,
} from './domain/entities/PilotSheet';
import {
  EXAMPLE_HISTORIES,
  EXAMPLE_OPENINGS,
  EXAMPLE_TRAGEDIES,
  getPlaybookById,
  PILOT_ACTIONS,
  PILOT_PLAYBOOKS,
  VEHICLE_ACTIONS,
} from './shared/data/beamSaberPilotData';

function newId(): string {
  return crypto.randomUUID();
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-500';

function ActionRatingGrid({
  title,
  actions,
  ratings,
  onChange,
  max = 4,
}: {
  title: string;
  actions: { id: string; name: string; description: string }[];
  ratings: Record<string, number>;
  onChange: (id: string, value: number) => void;
  max?: number;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <h3 className="mb-3 text-sm font-semibold text-cyan-300">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <div key={action.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
            <div>
              <div className="font-medium">{action.name}</div>
              <div className="text-xs text-slate-500">{action.description}</div>
            </div>
            <input
              type="number"
              min={0}
              max={max}
              className={`${inputClass} w-16 text-center`}
              value={ratings[action.id] ?? 0}
              onChange={(e) => onChange(action.id, Number(e.target.value))}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function PilotEditor({
  pilot,
  onChange,
  onSave,
}: {
  pilot: PilotSheet;
  onChange: (p: PilotSheet) => void;
  onSave: () => void;
}) {
  const playbook = getPlaybookById(pilot.playbookId);

  const applyPlaybook = () => {
    if (!playbook) return;
    onChange({
      ...pilot,
      actionRatings: applyPlaybookStartingBonuses(pilot.actionRatings, playbook),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {pilot.name || pilot.callSign || 'Novo piloto'}
          </h2>
          <p className="text-sm text-slate-400">
            {playbook?.name ?? 'Sem playbook'} · Beam Saber RPG
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
        >
          Salvar ficha
        </button>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Playbook">
          <select
            className={inputClass}
            value={pilot.playbookId}
            onChange={(e) => onChange({ ...pilot, playbookId: e.target.value })}
          >
            <option value="">Selecione…</option>
            {PILOT_PLAYBOOKS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.tagline}
              </option>
            ))}
          </select>
        </Field>
        {playbook && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={applyPlaybook}
              className="rounded-lg border border-cyan-700 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-950"
            >
              Aplicar bônus iniciais ({playbook.startingBonuses.map((b) => `${b.bonus} ${b.actionId}`).join(', ')})
            </button>
          </div>
        )}
      </div>

      {playbook && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
          <p className="mb-2"><strong>XP:</strong> {playbook.xpTrigger}</p>
          <p><strong>Habilidades:</strong> {playbook.abilities.join(' · ')}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Field label="Nome">
          <input className={inputClass} value={pilot.name} onChange={(e) => onChange({ ...pilot, name: e.target.value })} />
        </Field>
        <Field label="Pronomes">
          <input className={inputClass} value={pilot.pronouns} onChange={(e) => onChange({ ...pilot, pronouns: e.target.value })} />
        </Field>
        <Field label="Callsign">
          <input className={inputClass} value={pilot.callSign} onChange={(e) => onChange({ ...pilot, callSign: e.target.value })} />
        </Field>
        <Field label="Habilidade escolhida">
          <select
            className={inputClass}
            value={pilot.ability}
            onChange={(e) => onChange({ ...pilot, ability: e.target.value })}
          >
            <option value="">Selecione…</option>
            {playbook?.abilities.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Aparência (Look)">
        <textarea className={inputClass} rows={2} value={pilot.look} onChange={(e) => onChange({ ...pilot, look: e.target.value })} />
      </Field>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="History">
          <input list="histories" className={inputClass} value={pilot.history} onChange={(e) => onChange({ ...pilot, history: e.target.value })} />
        </Field>
        <Field label="Tragedy">
          <input list="tragedies" className={inputClass} value={pilot.tragedy} onChange={(e) => onChange({ ...pilot, tragedy: e.target.value })} />
        </Field>
        <Field label="Opening">
          <input list="openings" className={inputClass} value={pilot.opening} onChange={(e) => onChange({ ...pilot, opening: e.target.value })} />
        </Field>
      </div>
      <datalist id="histories">{EXAMPLE_HISTORIES.map((h) => <option key={h} value={h} />)}</datalist>
      <datalist id="tragedies">{EXAMPLE_TRAGEDIES.map((t) => <option key={t} value={t} />)}</datalist>
      <datalist id="openings">{EXAMPLE_OPENINGS.map((o) => <option key={o} value={o} />)}</datalist>

      <Field label="Drive">
        <textarea className={inputClass} rows={2} value={pilot.drive} onChange={(e) => onChange({ ...pilot, drive: e.target.value })} placeholder="O que você quer mudar no mundo?" />
      </Field>

      <ActionRatingGrid
        title="Ações de piloto"
        actions={PILOT_ACTIONS}
        ratings={pilot.actionRatings}
        onChange={(id, value) =>
          onChange({ ...pilot, actionRatings: { ...pilot.actionRatings, [id]: value } })
        }
      />

      <ActionRatingGrid
        title="Ações de veículo"
        actions={VEHICLE_ACTIONS}
        ratings={pilot.vehicleActionRatings}
        onChange={(id, value) =>
          onChange({ ...pilot, vehicleActionRatings: { ...pilot.vehicleActionRatings, [id]: value } })
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Veículo — nome">
          <input className={inputClass} value={pilot.vehicleName} onChange={(e) => onChange({ ...pilot, vehicleName: e.target.value })} />
        </Field>
        <Field label="Veículo — aparência">
          <input className={inputClass} value={pilot.vehicleLook} onChange={(e) => onChange({ ...pilot, vehicleLook: e.target.value })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Stress (0–9)">
          <input type="number" min={0} max={9} className={inputClass} value={pilot.stress} onChange={(e) => onChange({ ...pilot, stress: Number(e.target.value) })} />
        </Field>
        <Field label="Playbook XP (0–7)">
          <input type="number" min={0} max={7} className={inputClass} value={pilot.playbookXp} onChange={(e) => onChange({ ...pilot, playbookXp: Number(e.target.value) })} />
        </Field>
        <Field label="Notas">
          <input className={inputClass} value={pilot.notes} onChange={(e) => onChange({ ...pilot, notes: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}

export default function App() {
  const [pilots, setPilots] = useState<PilotSheet[]>(() => loadPilots());
  const [activeId, setActiveId] = useState<string | null>(() => pilots[0]?.id ?? null);
  const [draft, setDraft] = useState<PilotSheet | null>(null);

  const activePilot = useMemo(() => {
    if (draft && draft.id === activeId) return draft;
    return pilots.find((p) => p.id === activeId) ?? null;
  }, [activeId, draft, pilots]);

  const startNew = () => {
    const p = createEmptyPilotSheet(newId());
    setActiveId(p.id);
    setDraft(p);
  };

  const selectPilot = (id: string) => {
    setActiveId(id);
    setDraft(null);
  };

  const save = () => {
    if (!activePilot) return;
    const next = upsertPilot(activePilot);
    setPilots(next);
    setDraft(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#0a0e17] to-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <h1 className="mb-1 text-lg font-bold text-cyan-300">Beam Saber</h1>
          <p className="mb-4 text-xs text-slate-500">Ficha de piloto · playtest v0.461</p>
          <button
            type="button"
            onClick={startNew}
            className="mb-4 w-full rounded-lg border border-dashed border-slate-600 py-2 text-sm text-slate-300 hover:border-cyan-600 hover:text-cyan-300"
          >
            + Novo piloto
          </button>
          <ul className="space-y-1">
            {pilots.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => selectPilot(p.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    p.id === activeId
                      ? 'bg-cyan-950 text-cyan-200'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  {p.name || p.callSign || 'Sem nome'}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-w-0 flex-1">
          {activePilot ? (
            <PilotEditor
              pilot={activePilot}
              onChange={(p) => setDraft(p)}
              onSave={save}
            />
          ) : (
            <div className="rounded-xl border border-slate-800 p-12 text-center text-slate-400">
              Crie um piloto para começar.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
