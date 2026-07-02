/** Passos de criação de piloto — Beam Saber p. 39 */
export const CREATION_STEPS = [
  'Escolha um Playbook',
  'Defina History (+1 em ação de piloto ou veículo)',
  'Defina Tragedy',
  'Defina Opening (+1 em ação de piloto ou veículo)',
  'Defina Drive',
  'Distribua 3 pontos iniciais do Playbook',
  'Distribua +2 pontos (máx. 2 por ação; veículo ganha +3 depois)',
  'Escolha 1 habilidade do Playbook',
  'Nome, pronome, callsign e aparência',
  'Preencha Connection Sheet com o esquadrão',
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
  { id: 'hunt', name: 'Hunt', attribute: 'insight', description: 'rastrear e precisão à distância' },
  { id: 'study', name: 'Study', attribute: 'insight', description: 'inspecionar detalhes e evidências' },
  { id: 'survey', name: 'Survey', attribute: 'insight', description: 'observar arredores e resultados possíveis' },
  { id: 'engineer', name: 'Engineer', attribute: 'insight', description: 'ajustar e criar dispositivos' },
  { id: 'finesse', name: 'Finesse', attribute: 'prowess', description: 'destreza manual' },
  { id: 'prowl', name: 'Prowl', attribute: 'prowess', description: 'mover-se com graça e potência' },
  { id: 'struggle', name: 'Struggle', attribute: 'prowess', description: 'combate corpo a corpo' },
  { id: 'wreck', name: 'Wreck', attribute: 'prowess', description: 'força bruta' },
  { id: 'command', name: 'Command', attribute: 'resolve', description: 'obediência rápida' },
  { id: 'consort', name: 'Consort', attribute: 'resolve', description: 'socializar' },
  { id: 'interface', name: 'Interface', attribute: 'resolve', description: 'equipamento digital complexo' },
  { id: 'sway', name: 'Sway', attribute: 'resolve', description: 'influenciar por charme ou debate' },
];

export interface VehicleAction {
  id: string;
  name: string;
  attribute: VehicleAttribute;
  description: string;
}

export const VEHICLE_ACTIONS: VehicleAction[] = [
  { id: 'battle', name: 'Battle', attribute: 'expertise', description: 'ataque em curto alcance' },
  { id: 'destroy', name: 'Destroy', attribute: 'expertise', description: 'destruição direta' },
  { id: 'maneuver', name: 'Maneuver', attribute: 'expertise', description: 'movimento rápido e preciso' },
  { id: 'bombard', name: 'Bombard', attribute: 'acuity', description: 'fogo de longo alcance' },
  { id: 'manipulate', name: 'Manipulate', attribute: 'acuity', description: 'manipular objetos com destreza' },
  { id: 'scan', name: 'Scan', attribute: 'acuity', description: 'avaliar situações rapidamente' },
];

export const EXAMPLE_HISTORIES = [
  'Academic', 'Art', 'Criminal', 'Entertainment', 'Family', 'Labor',
  'Law', 'Military', 'Political', 'Spiritual', 'Trade',
] as const;

export const EXAMPLE_TRAGEDIES = [
  'Hid in a mass grave',
  'Lone survivor of a militia',
  'Friends started disappearing',
  'Family killed as collateral damage',
  'Orbital station home used as a kinetic weapon',
  'Unwillingly experimented on',
  'Exiled from homeland',
  'Falsely charged with a major crime',
  'Shown the lie of their own life',
  'Participated in a failed coup or mutiny',
] as const;

export const EXAMPLE_OPENINGS = [
  'Building a custom vehicle from spare parts',
  'Avoiding people with long voyage transport jobs',
  'Studying military strategy in preparation for war',
  'Catching deserters as a bounty hunter',
  'Stuck in prison for petty crimes',
  'Driving a taxi in areas autocars cannot navigate',
  'Commanding a gang of rabble and scum',
  'Tending to the needs of an admiral as their valet',
  'Getting by as a sex worker',
  'Fighting in the vehicle arena',
  'Shuffling papers in a cubicle farm',
  'Serving drinks in a run down bar',
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
    name: 'Ace',
    tagline: 'Piloto gracioso e ousado.',
    startingBonuses: [{ actionId: 'maneuver', bonus: 2 }, { actionId: 'engineer', bonus: 1 }],
    xpTrigger: 'Desafiou algo com pilotagem ou violência.',
    abilities: [
      'Adaptable', 'More Than Meets The Eye', 'Meat Is Cheap, Save The Metal',
      'Last Stand', 'Advanced Prototype', 'Bloodlust', 'Red Comet',
      'Travelling Companion', 'Veteran',
    ],
    exampleBeliefs: [
      'They handle their vehicle very badly.',
      'They do not understand my value as a pilot.',
      'They are going to get someone killed.',
      'They desire glory as much as I do!',
    ],
  },
  {
    id: 'bureaucrat',
    name: 'Bureaucrat',
    tagline: 'Funcionário sobrecarregado e subvalorizado.',
    startingBonuses: [{ actionId: 'consort', bonus: 2 }, { actionId: 'study', bonus: 1 }],
    xpTrigger: 'Desafiou algo com procedimento ou gestão.',
    abilities: [
      'Stay Late', 'Cook the Books', 'Red Tape', 'Connected',
      'Beneath Notice', 'Work Hard, Play Hard', 'Rainy Day', 'Forgettable', 'Veteran',
    ],
    exampleBeliefs: [
      'Their disdain for protocol will endanger the squad.',
      'They are too invested in rules.',
      'They are lazy.',
      'They are responsible, so I am teaching them useful loopholes.',
    ],
  },
  {
    id: 'empath',
    name: 'Empath',
    tagline: 'Sensível às emoções alheias.',
    startingBonuses: [{ actionId: 'study', bonus: 2 }, { actionId: 'survey', bonus: 1 }],
    xpTrigger: 'Desafiou algo com empatia ou inspiração.',
    abilities: [
      'Telepathy', 'Broadcast', 'Far Sight', 'Emoji', 'Carouse',
      'Everybody Hurts', 'Carry That Weight', 'Good Hearted', 'Veteran',
    ],
    exampleBeliefs: [
      'I can fix the reason they hurt.',
      'I can take advantage of their pain.',
      'Their vehicle has strong emotions tied to it.',
      'I can feel they are a good person.',
    ],
  },
  {
    id: 'envoy',
    name: 'Envoy',
    tagline: 'Diplomata e manipulador social.',
    startingBonuses: [{ actionId: 'sway', bonus: 2 }, { actionId: 'consort', bonus: 1 }],
    xpTrigger: 'Desafiou algo com persuasão ou intriga.',
    abilities: [
      "Rook's Gambit", 'Cool Under Pressure', "Regent's Brilliance",
      'Like Looking into a Mirror', 'A Little Something on the Side',
      "Read 'em And Weep", 'Subterfuge', 'Trust in Me', 'Veteran',
    ],
    exampleBeliefs: [
      'They are a sucker who will get me into trouble.',
      'They need a makeover and I have the style.',
      'They do not fit the objective of this squad.',
      'They will make a good social prop.',
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
      'The AR echoes tell me they are being followed.',
      'I have found their digital secrets.',
      'They are computer illiterate and I will fix that.',
      'They do not trust me, and that is insulting.',
    ],
  },
  {
    id: 'infiltrator',
    name: 'Infiltrator',
    tagline: 'Fantasma nas sombras.',
    startingBonuses: [{ actionId: 'prowl', bonus: 2 }, { actionId: 'finesse', bonus: 1 }],
    xpTrigger: 'Desafiou algo com furtividade ou violência precisa.',
    abilities: [
      'Ghost', 'Ambush', 'Daredevil', "The Devil's Footsteps", 'Expertise',
      'Never Tell Me The Odds', 'Reflexes', 'Shadow', 'Veteran',
    ],
    exampleBeliefs: [
      'They make way too much noise.',
      'Got themselves caught so I could finish the mission.',
      'They are not going to make it out of the War.',
      'They are reckless but effective.',
    ],
  },
  {
    id: 'officer',
    name: 'Officer',
    tagline: 'Líder militar experiente.',
    startingBonuses: [{ actionId: 'command', bonus: 2 }, { actionId: 'survey', bonus: 1 }],
    xpTrigger: 'Desafiou algo com liderança ou tática.',
    abilities: [
      'Tactical Genius', 'Leader', 'Rally', 'Functioning Vice',
      'Heart to Heart', 'Warlord', 'Mastermind', 'Weaving the Web', 'Veteran',
    ],
    exampleBeliefs: [
      'They trust my plans, and I will not let them down.',
      'They have a good head and I trust their instincts.',
      'They refuse to see how their actions affect the squad.',
      'Their reputation precedes them and it worries me.',
    ],
  },
  {
    id: 'scout',
    name: 'Scout',
    tagline: 'Batedor e observador.',
    startingBonuses: [{ actionId: 'hunt', bonus: 2 }, { actionId: 'survey', bonus: 1 }],
    xpTrigger: 'Desafiou algo com reconhecimento ou precisão.',
    abilities: [
      'Sharpshooter', 'Focused', 'Terminator', 'Ranger',
      'Survivor', 'Lay of the Land', 'Determination', 'Veteran',
    ],
    exampleBeliefs: [
      'They would be lost without me.',
      'They make me feel like part of the team.',
      'They want to survive and I can teach them how.',
      'They are in constant danger, so I will keep them safe.',
    ],
  },
  {
    id: 'soldier',
    name: 'Soldier',
    tagline: 'Combatente de linha de frente.',
    startingBonuses: [{ actionId: 'struggle', bonus: 2 }, { actionId: 'command', bonus: 1 }],
    xpTrigger: 'Desafiou algo com violência ou coerção.',
    abilities: [
      'Battleborn', 'Bodyguard', 'Robot Fighter', 'Tough as Nails',
      'Mule', 'Not to be Trifled With', 'Brutal', 'Vigorous', 'Veteran',
    ],
    exampleBeliefs: [
      'Their hesitance to inflict violence will harm the squad.',
      'They rely too much on their technology.',
      'The Squad needs a better fitness regimen.',
      'We have fought side by side and I trust them.',
    ],
  },
  {
    id: 'technician',
    name: 'Technician',
    tagline: 'Técnico sagaz e vandal.',
    startingBonuses: [{ actionId: 'engineer', bonus: 2 }, { actionId: 'wreck', bonus: 1 }],
    xpTrigger: 'Desafiou algo com habilidade técnica ou destruição.',
    abilities: [
      'Simulation', 'Jury Rig', 'Researcher', 'Fortitude',
      'Road Master', 'Doctor', 'Saboteur', 'Custom Implant', 'Veteran',
    ],
    exampleBeliefs: [
      'They show promise, so I will support their endeavours.',
      'They are not sufficiently interested in the results I could achieve.',
      'My data indicates they could be so much more.',
      'They have insulted my methods.',
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
