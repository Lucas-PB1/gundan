/** Passos de criação de piloto — Beam Saber p. 39 */
export const CREATION_STEPS = [
  'Escolha um arquétipo',
  'Defina História (+1 em ação de piloto ou veículo)',
  'Defina Tragédia',
  'Defina Abertura (+1 em ação de piloto ou veículo)',
  'Defina Impulso',
  'Distribua 3 pontos iniciais do arquétipo',
  'Distribua +2 pontos (máx. 2 por ação; veículo ganha +3 depois)',
  'Escolha 1 habilidade do arquétipo',
  'Nome, pronome, indicativo e aparência',
  'Preencha a ficha de conexões com o esquadrão',
] as const;

export const PILOT_ATTRIBUTES = ['insight', 'prowess', 'resolve'] as const;
export type PilotAttribute = (typeof PILOT_ATTRIBUTES)[number];

export const VEHICLE_ATTRIBUTES = ['expertise', 'acuity'] as const;
export type VehicleAttribute = (typeof VEHICLE_ATTRIBUTES)[number];

export interface PilotAction {
  id: string;
  name: string;
  attribute: PilotAttribute;
  description: string;
}

export const PILOT_ACTIONS: PilotAction[] = [
  { id: 'hunt', name: 'Caçar', attribute: 'insight', description: 'rastrear e precisão à distância' },
  { id: 'study', name: 'Estudar', attribute: 'insight', description: 'inspecionar detalhes e evidências' },
  { id: 'survey', name: 'Vistoriar', attribute: 'insight', description: 'observar arredores e resultados possíveis' },
  { id: 'engineer', name: 'Engenhar', attribute: 'insight', description: 'ajustar e criar dispositivos' },
  { id: 'finesse', name: 'Afinar', attribute: 'prowess', description: 'destreza manual' },
  { id: 'prowl', name: 'Rondar', attribute: 'prowess', description: 'mover-se com graça e potência' },
  { id: 'struggle', name: 'Lutar', attribute: 'prowess', description: 'combate corpo a corpo' },
  { id: 'wreck', name: 'Arrombar', attribute: 'prowess', description: 'força bruta' },
  { id: 'command', name: 'Comandar', attribute: 'resolve', description: 'obediência rápida' },
  { id: 'consort', name: 'Conviver', attribute: 'resolve', description: 'socializar' },
  { id: 'interface', name: 'Interfácie', attribute: 'resolve', description: 'equipamento digital complexo' },
  { id: 'sway', name: 'Influenciar', attribute: 'resolve', description: 'influenciar por charme ou debate' },
];

export interface VehicleAction {
  id: string;
  name: string;
  attribute: VehicleAttribute;
  description: string;
}

export const VEHICLE_ACTIONS: VehicleAction[] = [
  { id: 'battle', name: 'Batalhar', attribute: 'expertise', description: 'ataque em curto alcance' },
  { id: 'destroy', name: 'Aniquilar', attribute: 'expertise', description: 'destruição direta' },
  { id: 'maneuver', name: 'Manobrar', attribute: 'expertise', description: 'movimento rápido e preciso' },
  { id: 'bombard', name: 'Bombardear', attribute: 'acuity', description: 'fogo de longo alcance' },
  { id: 'manipulate', name: 'Manipular', attribute: 'acuity', description: 'manipular objetos com destreza' },
  { id: 'scan', name: 'Escanear', attribute: 'acuity', description: 'avaliar situações rapidamente' },
];

export const EXAMPLE_HISTORIES = [
  'Acadêmico', 'Arte', 'Criminoso', 'Entretenimento', 'Família', 'Trabalho manual',
  'Lei', 'Militar', 'Político', 'Espiritual', 'Comércio',
] as const;

export const EXAMPLE_TRAGEDIES = [
  'Escondeu-se numa vala comum',
  'Único sobrevivente de uma milícia',
  'Amigos começaram a desaparecer',
  'Família morta como dano colateral',
  'Estação orbital lar usada como arma cinética',
  'Submetido a experimentos contra a vontade',
  'Exilado da terra natal',
  'Acusado falsamente de crime grave',
  'Descobriu a mentira da própria vida',
  'Participou de golpe ou motim fracassado',
] as const;

export const EXAMPLE_OPENINGS = [
  'Montando um veículo customizado com peças sobressalentes',
  'Evitando pessoas com trabalhos de transporte de longa viagem',
  'Estudando estratégia militar em preparação para a guerra',
  'Capturando desertores como caçador de recompensas',
  'Preso por crimes menores',
  'Dirigindo táxi em áreas que autocarros não alcançam',
  'Comandando uma gangue de ralé',
  'Atendendo um almirante como criado',
  'Sobrevivendo como trabalhador sexual',
  'Lutando na arena de veículos',
  'Empilhando papelada num cubículo',
  'Servindo drinks num bar decadente',
] as const;

export interface PlaybookStartingBonus {
  actionId: string;
  bonus: number;
}

export interface PilotPlaybook {
  id: string;
  name: string;
  tagline: string;
  startingBonuses: PlaybookStartingBonus[];
  xpTrigger: string;
  abilities: string[];
  exampleBeliefs: string[];
}

export const PILOT_PLAYBOOKS: PilotPlaybook[] = [
  {
    id: 'ace',
    name: 'Ás',
    tagline: 'Piloto gracioso e ousado.',
    startingBonuses: [{ actionId: 'maneuver', bonus: 2 }, { actionId: 'engineer', bonus: 1 }],
    xpTrigger: 'Desafiou algo com pilotagem ou violência.',
    abilities: [
      'Adaptable', 'More Than Meets The Eye', 'Meat Is Cheap, Save The Metal',
      'Last Stand', 'Advanced Prototype', 'Bloodlust', 'Red Comet',
      'Travelling Companion', 'Veteran',
    ],
    exampleBeliefs: [
      'Pilotam o veículo muito mal.',
      'Não entendem meu valor como piloto.',
      'Vão fazer alguém morrer.',
      'Desejam glória tanto quanto eu!',
    ],
  },
  {
    id: 'bureaucrat',
    name: 'Burocrata',
    tagline: 'Funcionário sobrecarregado e subvalorizado.',
    startingBonuses: [{ actionId: 'consort', bonus: 2 }, { actionId: 'study', bonus: 1 }],
    xpTrigger: 'Desafiou algo com procedimento ou gestão.',
    abilities: [
      'Stay Late', 'Cook the Books', 'Red Tape', 'Connected',
      'Beneath Notice', 'Work Hard, Play Hard', 'Rainy Day', 'Forgettable', 'Veteran',
    ],
    exampleBeliefs: [
      'O desprezo pelo protocolo vai colocar o esquadrão em perigo.',
      'Estão obcecados demais com regras.',
      'São preguiçosos.',
      'São responsáveis, então ensino brechas úteis.',
    ],
  },
  {
    id: 'empath',
    name: 'Empata',
    tagline: 'Sensível às emoções alheias.',
    startingBonuses: [{ actionId: 'study', bonus: 2 }, { actionId: 'survey', bonus: 1 }],
    xpTrigger: 'Desafiou algo com empatia ou inspiração.',
    abilities: [
      'Telepathy', 'Broadcast', 'Far Sight', 'Emoji', 'Carouse',
      'Everybody Hurts', 'Carry That Weight', 'Good Hearted', 'Veteran',
    ],
    exampleBeliefs: [
      'Posso consertar a razão da dor deles.',
      'Posso tirar vantagem da dor deles.',
      'O veículo deles tem emoções fortes ligadas a ele.',
      'Sinto que são uma boa pessoa.',
    ],
  },
  {
    id: 'envoy',
    name: 'Enviado',
    tagline: 'Diplomata e manipulador social.',
    startingBonuses: [{ actionId: 'sway', bonus: 2 }, { actionId: 'consort', bonus: 1 }],
    xpTrigger: 'Desafiou algo com persuasão ou intriga.',
    abilities: [
      "Rook's Gambit", 'Cool Under Pressure', "Regent's Brilliance",
      'Like Looking into a Mirror', 'A Little Something on the Side',
      "Read 'em And Weep", 'Subterfuge', 'Trust in Me', 'Veteran',
    ],
    exampleBeliefs: [
      'São ingênuos e vão me meter em encrenca.',
      'Precisam de reforma e eu tenho o estilo.',
      'Não se encaixam no objetivo deste esquadrão.',
      'Vão servir bem como peça social.',
    ],
  },
  {
    id: 'hacker',
    name: 'Hacker',
    tagline: 'Especialista em AR e sistemas digitais.',
    startingBonuses: [{ actionId: 'interface', bonus: 2 }, { actionId: 'study', bonus: 1 }],
    xpTrigger: 'Desafiou algo com habilidade técnica digital ou caos.',
    abilities: [
      'Compel', 'Matrix Mind', 'Iron Will', 'Turing Test', 'Data Pack',
      'Crowdsource', 'Tesla', 'Warded', 'Veteran',
    ],
    exampleBeliefs: [
      'Os ecos de AR me dizem que estão sendo seguidos.',
      'Encontrei os segredos digitais deles.',
      'São analfabetos digitais e vou corrigir isso.',
      'Não confiam em mim, e isso é insultante.',
    ],
  },
  {
    id: 'infiltrator',
    name: 'Infiltrador',
    tagline: 'Fantasma nas sombras.',
    startingBonuses: [{ actionId: 'prowl', bonus: 2 }, { actionId: 'finesse', bonus: 1 }],
    xpTrigger: 'Desafiou algo com furtividade ou violência precisa.',
    abilities: [
      'Ghost', 'Ambush', 'Daredevil', "The Devil's Footsteps", 'Expertise',
      'Never Tell Me The Odds', 'Reflexes', 'Shadow', 'Veteran',
    ],
    exampleBeliefs: [
      'Fazem barulho demais.',
      'Se deixaram pegar para eu terminar a missão.',
      'Não vão sair vivos desta guerra.',
      'São imprudentes, mas eficazes.',
    ],
  },
  {
    id: 'officer',
    name: 'Oficial',
    tagline: 'Líder militar experiente.',
    startingBonuses: [{ actionId: 'command', bonus: 2 }, { actionId: 'survey', bonus: 1 }],
    xpTrigger: 'Desafiou algo com liderança ou tática.',
    abilities: [
      'Tactical Genius', 'Leader', 'Rally', 'Functioning Vice',
      'Heart to Heart', 'Warlord', 'Mastermind', 'Weaving the Web', 'Veteran',
    ],
    exampleBeliefs: [
      'Confiam nos meus planos e não vou decepcioná-los.',
      'Têm boa cabeça e confio no instinto deles.',
      'Recusam ver como suas ações afetam o esquadrão.',
      'A reputação deles me preocupa.',
    ],
  },
  {
    id: 'scout',
    name: 'Batedor',
    tagline: 'Batedor e observador.',
    startingBonuses: [{ actionId: 'hunt', bonus: 2 }, { actionId: 'survey', bonus: 1 }],
    xpTrigger: 'Desafiou algo com reconhecimento ou precisão.',
    abilities: [
      'Sharpshooter', 'Focused', 'Terminator', 'Ranger',
      'Survivor', 'Lay of the Land', 'Determination', 'Veteran',
    ],
    exampleBeliefs: [
      'Estariam perdidos sem mim.',
      'Me fazem sentir parte do time.',
      'Querem sobreviver e posso ensiná-los como.',
      'Estão em perigo constante, então vou mantê-los seguros.',
    ],
  },
  {
    id: 'soldier',
    name: 'Soldado',
    tagline: 'Combatente de linha de frente.',
    startingBonuses: [{ actionId: 'struggle', bonus: 2 }, { actionId: 'command', bonus: 1 }],
    xpTrigger: 'Desafiou algo com violência ou coerção.',
    abilities: [
      'Battleborn', 'Bodyguard', 'Robot Fighter', 'Tough as Nails',
      'Mule', 'Not to be Trifled With', 'Brutal', 'Vigorous', 'Veteran',
    ],
    exampleBeliefs: [
      'A hesitação em usar violência vai prejudicar o esquadrão.',
      'Dependem demais da tecnologia.',
      'O esquadrão precisa de melhor condicionamento.',
      'Lutamos lado a lado e confio neles.',
    ],
  },
  {
    id: 'technician',
    name: 'Técnico',
    tagline: 'Técnico sagaz e vandal.',
    startingBonuses: [{ actionId: 'engineer', bonus: 2 }, { actionId: 'wreck', bonus: 1 }],
    xpTrigger: 'Desafiou algo com habilidade técnica ou destruição.',
    abilities: [
      'Simulation', 'Jury Rig', 'Researcher', 'Fortitude',
      'Road Master', 'Doctor', 'Saboteur', 'Custom Implant', 'Veteran',
    ],
    exampleBeliefs: [
      'Mostram potencial, então apoio seus empreendimentos.',
      'Não se interessam o suficiente pelos resultados que eu poderia alcançar.',
      'Meus dados indicam que poderiam ser muito mais.',
      'Insultaram meus métodos.',
    ],
  },
];

export const ALL_ACTION_IDS = [
  ...PILOT_ACTIONS.map((a) => a.id),
  ...VEHICLE_ACTIONS.map((a) => a.id),
] as const;

export function getPlaybookById(id: string): PilotPlaybook | undefined {
  return PILOT_PLAYBOOKS.find((p) => p.id === id);
}

export function getActionLabel(actionId: string): string {
  const pilot = PILOT_ACTIONS.find((a) => a.id === actionId);
  if (pilot) return pilot.name;
  const vehicle = VEHICLE_ACTIONS.find((a) => a.id === actionId);
  return vehicle?.name ?? actionId;
}
