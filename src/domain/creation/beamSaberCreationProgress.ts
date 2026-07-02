import type { PilotSheet } from '../entities/PilotSheet';
import { isVehicleActionId } from '../entities/PilotSheet';
import {
  CREATION_ANCHORS,
  type PilotEditorTabId,
  PILOT_TAB_LABELS,
} from '../../shared/constants/pilotEditorTabs';
import {
  getPlaybookById,
  getActionLabel,
  PILOT_ACTIONS,
  VEHICLE_ACTIONS,
} from '../../shared/data/beamSaberPilotData';

export const CREATION_LIMITS = {
  step7FreePoints: 2,
  vehicleCreationPoints: 3,
  maxRatingAtCreation: 2,
  playbookPoints: 3,
} as const;

export interface CreationCheckItem {
  id: string;
  label: string;
  detail?: string;
  done: boolean;
  skipped?: boolean;
  progress?: { current: number; max: number };
  warn?: boolean;
  tab: PilotEditorTabId;
  anchor?: string;
  tabLabel: string;
}

function sumActionRatings(
  actions: readonly { id: string }[],
  ratings: Record<string, number>,
): number {
  return actions.reduce((sum, action) => sum + (ratings[action.id] ?? 0), 0);
}

function playbookBonusSplit(playbookId: string): { pilot: number; vehicle: number } {
  const playbook = getPlaybookById(playbookId);
  if (!playbook) return { pilot: 0, vehicle: 0 };

  let pilot = 0;
  let vehicle = 0;
  for (const { actionId, bonus } of playbook.startingBonuses) {
    if (isVehicleActionId(actionId)) vehicle += bonus;
    else pilot += bonus;
  }
  return { pilot, vehicle };
}

function narrativeBonusSplit(pilot: PilotSheet): { pilot: number; vehicle: number } {
  let pilotBonus = 0;
  let vehicleBonus = 0;

  if (pilot.historyBonusActionId) {
    if (isVehicleActionId(pilot.historyBonusActionId)) vehicleBonus += 1;
    else pilotBonus += 1;
  }
  if (pilot.openingBonusActionId) {
    if (isVehicleActionId(pilot.openingBonusActionId)) vehicleBonus += 1;
    else pilotBonus += 1;
  }

  return { pilot: pilotBonus, vehicle: vehicleBonus };
}

function filledQuirksCount(pilot: PilotSheet): number {
  return pilot.quirks.filter(
    (q) => q.name.trim() && (q.descriptor1.trim() || q.descriptor2.trim()),
  ).length;
}

function hasConnectionsStarted(pilot: PilotSheet): boolean {
  return pilot.connections.some(
    (c) => c.name.trim() || c.beliefs.some((b) => b.trim()) || c.description.trim(),
  );
}

function link(tab: PilotEditorTabId, anchor?: string): Pick<CreationCheckItem, 'tab' | 'anchor' | 'tabLabel'> {
  return { tab, anchor, tabLabel: PILOT_TAB_LABELS[tab] };
}

export function getDiscretionaryPoints(pilot: PilotSheet): {
  step7Spent: number;
  step7Remaining: number;
  vehicleCreationSpent: number;
  vehicleCreationRemaining: number;
} {
  if (!pilot.playbookId) {
    return {
      step7Spent: 0,
      step7Remaining: CREATION_LIMITS.step7FreePoints,
      vehicleCreationSpent: 0,
      vehicleCreationRemaining: CREATION_LIMITS.vehicleCreationPoints,
    };
  }

  const playbook = playbookBonusSplit(pilot.playbookId);
  const narrative = narrativeBonusSplit(pilot);

  const pilotTotal = sumActionRatings(PILOT_ACTIONS, pilot.actionRatings);
  const vehicleTotal = sumActionRatings(VEHICLE_ACTIONS, pilot.vehicleActionRatings);

  const extraPilot = Math.max(0, pilotTotal - playbook.pilot - narrative.pilot);
  const extraVehicle = Math.max(0, vehicleTotal - playbook.vehicle - narrative.vehicle);
  const totalExtra = extraPilot + extraVehicle;

  const vehicleCreationSpent = Math.min(
    CREATION_LIMITS.vehicleCreationPoints,
    Math.max(0, totalExtra - CREATION_LIMITS.step7FreePoints),
  );
  const step7Spent = Math.min(
    CREATION_LIMITS.step7FreePoints,
    Math.max(0, totalExtra - vehicleCreationSpent),
  );

  return {
    step7Spent,
    step7Remaining: CREATION_LIMITS.step7FreePoints - step7Spent,
    vehicleCreationSpent,
    vehicleCreationRemaining: CREATION_LIMITS.vehicleCreationPoints - vehicleCreationSpent,
  };
}

export function getOverLimitActions(pilot: PilotSheet): string[] {
  const over: string[] = [];
  const max = CREATION_LIMITS.maxRatingAtCreation;

  for (const action of PILOT_ACTIONS) {
    if ((pilot.actionRatings[action.id] ?? 0) > max) {
      over.push(`Piloto · ${action.name}`);
    }
  }
  for (const action of VEHICLE_ACTIONS) {
    if ((pilot.vehicleActionRatings[action.id] ?? 0) > max) {
      over.push(`Robô · ${action.name}`);
    }
  }
  return over;
}

export function getCreationChecklist(pilot: PilotSheet): CreationCheckItem[] {
  const points = getDiscretionaryPoints(pilot);
  const overLimit = getOverLimitActions(pilot);
  const playbook = pilot.playbookId ? getPlaybookById(pilot.playbookId) : undefined;
  const hasHistory = !!pilot.history.trim();
  const hasOpening = !!pilot.opening.trim();
  const quirksFilled = filledQuirksCount(pilot);

  const items: CreationCheckItem[] = [
    {
      id: 'playbook',
      label: 'Arquétipo',
      detail: playbook
        ? `${playbook.name} — +3 automáticos (${playbook.startingBonuses
            .map((b) => `${getActionLabel(b.actionId)} +${b.bonus}`)
            .join(', ')})`
        : 'Escolha o arquétipo do piloto',
      done: !!pilot.playbookId,
      ...link('identity', CREATION_ANCHORS.playbook),
    },
    {
      id: 'history',
      label: 'História',
      detail: pilot.history.trim() || 'Quem você era antes da guerra',
      done: hasHistory,
      ...link('identity', CREATION_ANCHORS.history),
    },
    {
      id: 'history-bonus',
      label: 'Bônus da História (+1)',
      detail: !hasHistory
        ? 'Preencha a História primeiro'
        : pilot.historyBonusActionId
          ? `+1 em ${getActionLabel(pilot.historyBonusActionId)}`
          : 'Escolha qual ação recebe +1',
      done: hasHistory && !!pilot.historyBonusActionId,
      skipped: !hasHistory,
      ...link('identity', CREATION_ANCHORS.history),
    },
    {
      id: 'tragedy',
      label: 'Tragédia',
      detail: pilot.tragedy.trim() || 'O que te lançou na guerra',
      done: !!pilot.tragedy.trim(),
      ...link('identity', CREATION_ANCHORS.tragedy),
    },
    {
      id: 'opening',
      label: 'Abertura',
      detail: pilot.opening.trim() || 'Entre a tragédia e o esquadrão',
      done: hasOpening,
      ...link('identity', CREATION_ANCHORS.opening),
    },
    {
      id: 'opening-bonus',
      label: 'Bônus da Abertura (+1)',
      detail: !hasOpening
        ? 'Preencha a Abertura primeiro'
        : pilot.openingBonusActionId
          ? `+1 em ${getActionLabel(pilot.openingBonusActionId)}`
          : 'Escolha qual ação recebe +1',
      done: hasOpening && !!pilot.openingBonusActionId,
      skipped: !hasOpening,
      ...link('identity', CREATION_ANCHORS.opening),
    },
    {
      id: 'drive',
      label: 'Impulso',
      detail: pilot.drive.trim() || 'O que você quer mudar no mundo',
      done: !!pilot.drive.trim(),
      ...link('identity', CREATION_ANCHORS.drive),
    },
    {
      id: 'step7',
      label: '+2 pontos livres (piloto ou robô)',
      detail:
        points.step7Remaining > 0
          ? `Faltam ${points.step7Remaining} ponto${points.step7Remaining === 1 ? '' : 's'}`
          : 'Distribuídos',
      done: points.step7Remaining === 0,
      progress: { current: points.step7Spent, max: CREATION_LIMITS.step7FreePoints },
      ...link('actions', CREATION_ANCHORS.actions),
    },
    {
      id: 'vehicle-creation',
      label: '+3 pontos do robô',
      detail:
        points.vehicleCreationRemaining > 0
          ? `Faltam ${points.vehicleCreationRemaining} nas ações do robô`
          : 'Distribuídos nas ações do robô',
      done: points.vehicleCreationRemaining === 0,
      progress: {
        current: points.vehicleCreationSpent,
        max: CREATION_LIMITS.vehicleCreationPoints,
      },
      ...link('actions', CREATION_ANCHORS.actions),
    },
    {
      id: 'ability',
      label: 'Habilidade do arquétipo',
      detail: pilot.ability || 'Escolha 1 habilidade',
      done: !!pilot.ability,
      ...link('identity', CREATION_ANCHORS.ability),
    },
    {
      id: 'identity-basics',
      label: 'Nome e indicativo',
      detail:
        pilot.callSign.trim() || pilot.name.trim()
          ? [pilot.callSign, pilot.name].filter(Boolean).join(' · ')
          : 'Pelo menos nome ou indicativo',
      done: !!(pilot.name.trim() || pilot.callSign.trim()),
      ...link('identity', CREATION_ANCHORS.identity),
    },
    {
      id: 'vehicle-identity',
      label: 'Robô nomeado',
      detail: pilot.vehicleName.trim() || 'Nome do veículo/mecha',
      done: !!pilot.vehicleName.trim(),
      ...link('vehicle', CREATION_ANCHORS.vehicleName),
    },
    {
      id: 'quirks',
      label: '4 peculiaridades do robô',
      detail: `${quirksFilled}/4 com nome e descritores`,
      done: quirksFilled >= 4,
      ...link('vehicle', CREATION_ANCHORS.quirks),
    },
    {
      id: 'connections',
      label: 'Conexões do esquadrão',
      detail: hasConnectionsStarted(pilot)
        ? `${pilot.connections.length} conexão(ões) iniciada(s)`
        : 'Crenças e relógios com o esquadrão',
      done: hasConnectionsStarted(pilot),
      ...link('connections', CREATION_ANCHORS.connections),
    },
  ];

  if (overLimit.length > 0) {
    items.push({
      id: 'max-rating',
      label: 'Máx. 2 por ação na criação',
      detail: overLimit.join(' · '),
      done: false,
      warn: true,
      ...link('actions', CREATION_ANCHORS.actions),
    });
  }

  return items;
}

export function countCreationPending(pilot: PilotSheet): number {
  return getCreationChecklist(pilot).filter((item) => !item.done && !item.skipped).length;
}

export function isCreationComplete(pilot: PilotSheet): boolean {
  return getCreationChecklist(pilot).every((item) => (item.done || item.skipped) && !item.warn);
}
