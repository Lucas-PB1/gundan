import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { TickClock } from '../ui/TickClock';
import type { PilotConnection, PilotSheet } from '../../../domain/entities/PilotSheet';
import { newConnectionId } from '../../../domain/entities/PilotSheet';
import { getPlaybookById } from '../../../shared/data/beamSaberPilotData';

const CONNECTION_TYPES = [
  { id: 'squad', label: 'Esquadrão' },
  { id: 'rival', label: 'Rival' },
  { id: 'ally', label: 'Aliado' },
] as const;

function ConnectionCard({
  connection,
  otherPilots,
  playbookBeliefs,
  onChange,
  onRemove,
}: {
  connection: PilotConnection;
  otherPilots: PilotSheet[];
  playbookBeliefs: string[];
  onChange: (c: PilotConnection) => void;
  onRemove: () => void;
}) {
  const isAlly = connection.type === 'ally';

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <select
          className={`${inputClass} w-auto`}
          value={connection.type}
          onChange={(e) =>
            onChange({ ...connection, type: e.target.value as PilotConnection['type'] })
          }
        >
          {CONNECTION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-rose-400 hover:text-rose-300"
        >
          Remover
        </button>
      </div>

      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <Field label="Piloto (ficha salva)">
          <select
            className={inputClass}
            value={connection.targetPilotId ?? ''}
            onChange={(e) => {
              const target = otherPilots.find((p) => p.id === e.target.value);
              onChange({
                ...connection,
                targetPilotId: e.target.value || null,
                name: target ? (target.callSign || target.name) : connection.name,
              });
            }}
          >
            <option value="">Nome livre…</option>
            {otherPilots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.callSign || p.name || 'Sem nome'}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nome">
          <input
            className={inputClass}
            value={connection.name}
            onChange={(e) => onChange({ ...connection, name: e.target.value })}
            placeholder="NPC ou nome manual"
          />
        </Field>
      </div>

      {isAlly ? (
        <Field label="Descrição do aliado">
          <textarea
            className={inputClass}
            rows={2}
            value={connection.description}
            onChange={(e) => onChange({ ...connection, description: e.target.value })}
          />
        </Field>
      ) : (
        <>
          <div className="mb-3">
            <TickClock
              label="Relógio de conexão"
              ticks={connection.ticks}
              onChange={(t) => onChange({ ...connection, ticks: t })}
            />
          </div>
          <Field label="Crenças">
            {connection.beliefs.map((belief, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  list={`beliefs-${connection.id}`}
                  className={inputClass}
                  value={belief}
                  onChange={(e) => {
                    const beliefs = [...connection.beliefs];
                    beliefs[i] = e.target.value;
                    onChange({ ...connection, beliefs });
                  }}
                />
                <button
                  type="button"
                  className="shrink-0 text-slate-500 hover:text-rose-400"
                  onClick={() => {
                    const beliefs = connection.beliefs.filter((_, j) => j !== i);
                    onChange({ ...connection, beliefs: beliefs.length ? beliefs : [''] });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <datalist id={`beliefs-${connection.id}`}>
              {playbookBeliefs.map((b) => <option key={b} value={b} />)}
            </datalist>
            <button
              type="button"
              className="mt-1 text-xs text-cyan-400 hover:text-cyan-300"
              onClick={() => onChange({ ...connection, beliefs: [...connection.beliefs, ''] })}
            >
              + Crença
            </button>
          </Field>
        </>
      )}
    </div>
  );
}

export function ConnectionsTab({
  pilot,
  otherPilots,
  onChange,
}: {
  pilot: PilotSheet;
  otherPilots: PilotSheet[];
  onChange: (p: PilotSheet) => void;
}) {
  const playbook = getPlaybookById(pilot.playbookId);

  const addConnection = () => {
    onChange({
      ...pilot,
      connections: [
        ...pilot.connections,
        {
          id: newConnectionId(),
          targetPilotId: null,
          name: '',
          type: 'squad',
          ticks: 1,
          beliefs: [''],
          description: '',
        },
      ],
    });
  };

  const updateConnection = (id: string, next: PilotConnection) => {
    onChange({
      ...pilot,
      connections: pilot.connections.map((c) => (c.id === id ? next : c)),
    });
  };

  const removeConnection = (id: string) => {
    onChange({
      ...pilot,
      connections: pilot.connections.filter((c) => c.id !== id),
    });
  };

  const syncSquad = () => {
    const existing = new Set(
      pilot.connections.filter((c) => c.targetPilotId).map((c) => c.targetPilotId),
    );
    const toAdd = otherPilots
      .filter((p) => !existing.has(p.id))
      .map((p) => ({
        id: newConnectionId(),
        targetPilotId: p.id,
        name: p.callSign || p.name,
        type: 'squad' as const,
        ticks: 1,
        beliefs: [''],
        description: '',
      }));
    if (toAdd.length) onChange({ ...pilot, connections: [...pilot.connections, ...toAdd] });
  };

  return (
    <div className="flex flex-col gap-4">
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Ficha de conexões</h3>
        <p className="mb-3 text-xs text-slate-500">
          Relógio de 4 ticks por piloto do esquadrão. Aliados usam descrição em vez de crenças.
          Rivais seguem as mesmas regras com narrativa antagonista.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addConnection}
            className="rounded-lg border border-dashed border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-600"
          >
            + Conexão
          </button>
          {otherPilots.length > 0 && (
            <button
              type="button"
              onClick={syncSquad}
              className="rounded-lg border border-cyan-800 px-3 py-1.5 text-sm text-cyan-300 hover:bg-cyan-950"
            >
              Adicionar pilotos do esquadrão
            </button>
          )}
        </div>
      </section>

      {pilot.connections.length === 0 ? (
        <p className="text-center text-sm text-slate-500">
          Nenhuma conexão. Crie outros pilotos na barra lateral ou adicione NPCs.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pilot.connections.map((c) => (
            <ConnectionCard
              key={c.id}
              connection={c}
              otherPilots={otherPilots}
              playbookBeliefs={playbook?.exampleBeliefs ?? []}
              onChange={(next) => updateConnection(c.id, next)}
              onRemove={() => removeConnection(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
