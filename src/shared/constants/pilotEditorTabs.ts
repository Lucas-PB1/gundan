export const PILOT_EDITOR_TABS = [
  { id: 'identity', label: 'Identidade' },
  { id: 'creation', label: 'Criação' },
  { id: 'actions', label: 'Ações' },
  { id: 'rolls', label: 'Rolagem' },
  { id: 'condition', label: 'Condição' },
  { id: 'connections', label: 'Conexões' },
  { id: 'loadout', label: 'Equip.' },
  { id: 'vehicle', label: 'Veículo' },
] as const;

export type PilotEditorTabId = (typeof PILOT_EDITOR_TABS)[number]['id'];

export const PILOT_TAB_LABELS = Object.fromEntries(
  PILOT_EDITOR_TABS.map((t) => [t.id, t.label]),
) as Record<PilotEditorTabId, string>;

export type PilotEditorNavigate = (tab: PilotEditorTabId, anchor?: string) => void;

/** IDs usados em `id="..."` para rolar até o campo ao clicar no checklist */
export const CREATION_ANCHORS = {
  playbook: 'creation-playbook',
  history: 'creation-history',
  tragedy: 'creation-tragedy',
  opening: 'creation-opening',
  drive: 'creation-drive',
  ability: 'creation-ability',
  identity: 'creation-identity',
  actions: 'creation-actions',
  connections: 'creation-connections',
  vehicleName: 'creation-vehicle-name',
  quirks: 'creation-quirks',
} as const;
