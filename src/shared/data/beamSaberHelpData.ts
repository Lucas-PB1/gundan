import { PILOT_ACTIONS, VEHICLE_ACTIONS } from './beamSaberPilotData';
import { attrLabel } from '../i18n/pt';
import { getAbilityDescriptionPt } from './beamSaberAbilitiesPt';

export { normalizeAbilityName, getAbilityLabel } from './beamSaberAbilitiesPt';

export function getAbilityDescription(playbookId: string, abilityName: string): string | undefined {
  if (!playbookId || !abilityName) return undefined;
  return getAbilityDescriptionPt(playbookId, abilityName);
}

export const FIELD_HELP: Record<string, string> = {
  playbook:
    'Arquétipo do piloto (Ás, Soldado, Hacker…). Define bônus iniciais de ação, equipamento especialista e lista de habilidades.',
  history:
    'Quem você era antes da tragédia. +1 em uma ação de piloto ou do robô na criação. XP ao expressar na sessão.',
  tragedy:
    'Evento que te lançou na guerra. Ao expressar na sessão, marca XP.',
  opening:
    'O que fez entre a tragédia e entrar no esquadrão. +1 em ação de piloto ou do robô na criação. XP se expressar na sessão.',
  drive:
    'Frase sobre o que você quer mudar no mundo. Preenche relógios de impulso ao avançar esse objetivo.',
  ability:
    'Uma habilidade especial do seu arquétipo escolhida na criação. Veterano permite pegar de outro arquétipo depois.',
  stress:
    'Recurso para se esforçar, flashbacks, assistir, resistir e habilidades. Máximo 9 (10 com Sobrevivente).',
  harm:
    'Nível 1 reduz efeito. Nível 2 = −1d. Nível 3 = fora de ação. Nível 4 = morto.',
  scars:
    'Marcas permanentes ao estourar estresse. A 4ª marca remove o piloto da guerra.',
  connections:
    'Relógio de 4 ticks por piloto/NPC. Cada tick = uma crença. Relógio cheio → verdade revelada, reset.',
  loadout:
    'Itens declarados na missão. Cada um tem carga; não exceda o limite do modo (leve 3 / normal 5 / pesado 6). Só o que estiver marcado existe na ficção.',
  quirks:
    'Traços únicos do mecha: nome + dois descritores (+ e −). Esgote 1 peculiaridade quando um descritor se aplica: +1d, +efeito ou agir com dano 3. Pelo menos um descritor deve poder te prejudicar (XP no fim da sessão). Todas esgotadas → colapso ou ação direta.',
  armor: 'Gasta 1 uso para ignorar ferimento ou reduzir dano de veículo (conforme regras).',
  spark: 'Recurso único por piloto. Várias habilidades permitem gastar a centelha.',
  driveClock:
    'Dois relógios de 4 marcas. Preencha ao fazer algo novo que avance seu impulso (fim de missão ou projeto longo). Relógio cheio pode ser gasto para mudar o mundo — veja regras de gastar impulso.',
  playbookXp:
    'Marque ao treinar o arquétipo no tempo livre ou ao converter XP geral. 8 marcas = nova habilidade do arquétipo (zera a trilha).',
  generalXp:
    'Preencha no fim da sessão conforme o que aconteceu; depois distribua as marcas em arquétipo ou atributo.',
  attributeXp:
    'Marque ao agir em posição desesperada (+1 no atributo da ação) ou ao converter XP geral. 6 marcas = +1 em uma ação daquele atributo.',
};

export const PLAYBOOK_HELP: Record<string, string> = {
  ace: 'Piloto ousado ligado ao veículo. Foco em manobras e violência.',
  bureaucrat: 'Burocrata que vence com papelada, regulamento e contatos.',
  empath: 'Psíquico empático. Cuidado com Broadcast e consentimento na mesa.',
  envoy: 'Diplomata, espião e manipulador social.',
  hacker: 'Especialista em AR, apps e guerra digital.',
  infiltrator: 'Fantasma — furtividade, armadilhas e reflexos.',
  officer: 'Líder tático. Comando de coortes e multidões.',
  scout: 'Atirador e batedor. Robô caçador opcional.',
  soldier: 'Violência direta. Tanque da linha de frente.',
  technician: 'Engenheiro, médico e sabotador.',
};

export function getActionHelp(actionId: string): string | undefined {
  const pilot = PILOT_ACTIONS.find((a) => a.id === actionId);
  if (pilot) return `${pilot.name} (${attrLabel(pilot.attribute)}): ${pilot.description}`;
  const vehicle = VEHICLE_ACTIONS.find((a) => a.id === actionId);
  if (vehicle) return `${vehicle.name} (${attrLabel(vehicle.attribute)}): ${vehicle.description}`;
  return undefined;
}

export const SCAR_HELP: Record<string, string> = {
  Cold: 'Distância emocional; dificuldade em se importar.',
  Reckless: 'Impulsividade perigosa.',
  Haunted: 'Passado que persegue.',
  Soft: 'Hesita em causar dano.',
  Obsessed: 'Fixação em um objetivo.',
  Vicious: 'Crueldade desnecessária.',
  Paranoid: 'Desconfiança extrema.',
  Fractious: 'Conflito com aliados.',
};
