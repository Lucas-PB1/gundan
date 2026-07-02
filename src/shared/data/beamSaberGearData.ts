export const SCAR_CONDITIONS = [
  'Cold',
  'Reckless',
  'Haunted',
  'Soft',
  'Obsessed',
  'Vicious',
  'Paranoid',
  'Fractious',
] as const;

export type ScarCondition = (typeof SCAR_CONDITIONS)[number];

export const EXAMPLE_QUIRKS = [
  'Ominous Appearance',
  'Splintering Carapace',
  'Flexible Structure',
  'Mighty Clumsy',
  'Slow and Heavy',
  'Light Footed',
  'Military Workhorse',
  'Common Parts',
  'Fixed Hardpoints',
  'Redundant Systems',
  'Blinding Boosters',
  'Aggressive Targeters',
] as const;

export const LOAD_MODES = ['light', 'normal', 'heavy'] as const;
export type LoadMode = (typeof LOAD_MODES)[number];

export const LOAD_LIMITS: Record<LoadMode, number> = {
  light: 3,
  normal: 5,
  heavy: 6,
};

export interface GearItem {
  id: string;
  name: string;
  load: number;
  description?: string;
  source: 'standard' | 'playbook-pilot' | 'playbook-vehicle';
}

export const STANDARD_PILOT_GEAR: GearItem[] = [
  { id: 'bribe', name: 'Bribe (1 Load por ponto Personnel/Materiel)', load: 1, source: 'standard' },
  { id: 'blade', name: 'A blade or two', load: 1, source: 'standard' },
  { id: 'throwing-knives', name: 'Throwing knives', load: 1, source: 'standard' },
  { id: 'heavy-weapon', name: 'A heavy weapon', load: 2, source: 'standard' },
  { id: 'unusual-weapon', name: 'An unusual weapon', load: 1, source: 'standard' },
  { id: 'burglary-gear', name: 'Burglary gear', load: 1, source: 'standard' },
  { id: 'climbing-gear', name: 'Climbing gear', load: 2, source: 'standard' },
  { id: 'pistol', name: 'A pistol', load: 1, source: 'standard' },
  { id: 'rifle-shotgun', name: 'A rifle or shotgun', load: 2, source: 'standard' },
  { id: 'palm-computer', name: 'Palm computer with useful programs', load: 1, source: 'standard' },
  { id: 'documents', name: 'Documents', load: 1, source: 'standard' },
  { id: 'subterfuge', name: 'Subterfuge supplies', load: 1, source: 'standard' },
  { id: 'demolition-tools', name: 'Demolition tools', load: 2, source: 'standard' },
  { id: 'explosives', name: 'Placed explosives', load: 1, source: 'standard' },
  { id: 'flashlight', name: 'Flashlight, flares, or glow sticks', load: 1, source: 'standard' },
  { id: 'icp', name: 'Intrusion Countermeasures Program (ICP)', load: 0, source: 'standard' },
  { id: 'armor', name: 'Armor', load: 2, source: 'standard' },
  { id: 'heavy-armor', name: 'Heavy armor', load: 5, source: 'standard' },
  { id: 'intel', name: 'Intel', load: 0, source: 'standard' },
  { id: 'parachute', name: 'Parachute', load: 2, source: 'standard' },
  { id: 'throat-mic', name: 'Throat mic transceiver', load: 0, source: 'standard' },
  { id: 'long-range-tx', name: 'Long-range transmitter', load: 1, source: 'standard' },
  { id: 'smartphone', name: 'Smartphone', load: 0, source: 'standard' },
  { id: 'env-suit', name: 'Environmental suit', load: 0, source: 'standard' },
  { id: 'remote-control', name: 'Remote vehicle control', load: 1, source: 'standard' },
];

/** Gear especialista por playbook (pilot + vehicle) — extraído do PDF p. 60–101 */
export const PLAYBOOK_GEAR: Record<string, { pilot: GearItem[]; vehicle: GearItem[] }> = {
  ace: {
    pilot: [
      { id: 'ace-grav-chute', name: 'Grav chute', load: 1, source: 'playbook-pilot' },
      { id: 'ace-remote', name: 'Fine remote vehicle control', load: 1, source: 'playbook-pilot' },
      { id: 'ace-self-destruct', name: 'Self destruct remote', load: 0, source: 'playbook-pilot' },
      { id: 'ace-env-suit', name: 'Fine environmental suit', load: 0, source: 'playbook-pilot' },
      { id: 'ace-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'ace-mobility', name: 'Fine mobility suite', load: 2, source: 'playbook-vehicle' },
      { id: 'ace-reactor', name: 'Boosted reactor (1 use)', load: 1, source: 'playbook-vehicle' },
      { id: 'ace-mg', name: 'Fine machine gun', load: 1, source: 'playbook-vehicle' },
      { id: 'ace-shield', name: 'Fine shield or forcefield', load: 1, source: 'playbook-vehicle' },
      { id: 'ace-rage', name: 'R.A.G.E', load: 0, source: 'playbook-vehicle' },
    ],
  },
  bureaucrat: {
    pilot: [
      { id: 'bur-docs', name: 'Fine Official Documents', load: 1, source: 'playbook-pilot' },
      { id: 'bur-scanner', name: 'Body scanner wand', load: 1, source: 'playbook-pilot' },
      { id: 'bur-reports', name: 'Travel reports', load: 0, source: 'playbook-pilot' },
      { id: 'bur-blueprints', name: 'Blueprints for a facility or vehicle', load: 1, source: 'playbook-pilot' },
      { id: 'bur-barricade', name: 'Barricade Tape Projector', load: 1, source: 'playbook-pilot' },
      { id: 'bur-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'bur-style', name: 'Inconspicuous style', load: 0, source: 'playbook-vehicle' },
      { id: 'bur-tools', name: 'Several hand tool sets', load: 1, source: 'playbook-vehicle' },
      { id: 'bur-cargo', name: 'Fine cargo container', load: 1, source: 'playbook-vehicle' },
      { id: 'bur-clamp', name: 'Inhibitor Clamp', load: 1, source: 'playbook-vehicle' },
    ],
  },
  empath: {
    pilot: [
      { id: 'emp-prognostication', name: 'Prognostication tools', load: 1, source: 'playbook-pilot' },
      { id: 'emp-art', name: 'Fine artistic tools', load: 1, source: 'playbook-pilot' },
      { id: 'emp-emblem', name: 'Personal emblem', load: 1, source: 'playbook-pilot' },
      { id: 'emp-hope', name: 'A symbol of hope', load: 1, source: 'playbook-pilot' },
      { id: 'emp-stun', name: 'Fine stun gun', load: 1, source: 'playbook-pilot' },
      { id: 'emp-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'emp-appearance', name: 'Inspiring appearance', load: 1, source: 'playbook-vehicle' },
      { id: 'emp-broadcast', name: 'Fine broadcast system', load: 1, source: 'playbook-vehicle' },
      { id: 'emp-sdr', name: 'Fine Social Data Retrieval program', load: 1, source: 'playbook-vehicle' },
      { id: 'emp-psi', name: 'Psionic amplifier', load: 1, source: 'playbook-vehicle' },
    ],
  },
  envoy: {
    pilot: [
      { id: 'env-clothes', name: 'Fine clothes and jewelry', load: 0, source: 'playbook-pilot' },
      { id: 'env-disguise', name: 'Fine Disguise kit', load: 1, source: 'playbook-pilot' },
      { id: 'env-gambling', name: 'Fine trick gambling kit', load: 0, source: 'playbook-pilot' },
      { id: 'env-espionage', name: 'Fine Espionage gear', load: 1, source: 'playbook-pilot' },
      { id: 'env-trance', name: 'Trance powder', load: 0, source: 'playbook-pilot' },
      { id: 'env-cane', name: 'Cane sword', load: 1, source: 'playbook-pilot' },
      { id: 'env-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'env-holo', name: 'Fine holo-projector', load: 1, source: 'playbook-vehicle' },
      { id: 'env-chaff', name: 'Chaff countermeasure', load: 1, source: 'playbook-vehicle' },
      { id: 'env-melee', name: 'Concealed melee weapon', load: 1, source: 'playbook-vehicle' },
      { id: 'env-style', name: 'Stylish appearance', load: 0, source: 'playbook-vehicle' },
      { id: 'env-luxury', name: 'Luxurious Passenger Space', load: 1, source: 'playbook-vehicle' },
    ],
  },
  hacker: {
    pilot: [
      { id: 'hack-pezone', name: 'Portable Exclusion Zone', load: 1, source: 'playbook-pilot' },
      { id: 'hack-ar', name: 'Fine Augmented Reality tool', load: 1, source: 'playbook-pilot' },
      { id: 'hack-qd', name: 'Quantum Drive', load: 1, source: 'playbook-pilot' },
      { id: 'hack-rig', name: 'Hackrig', load: 1, source: 'playbook-pilot' },
      { id: 'hack-projector', name: 'Recursive data projector', load: 1, source: 'playbook-pilot' },
      { id: 'hack-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'hack-retrieval', name: 'Fine retrieval program', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-coding', name: 'Fine coding program', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-filter', name: 'Electronic Filter', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-stealth', name: 'Stealth program', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-bomb', name: 'Data bomb program', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-icp', name: 'Fine ICP', load: 1, source: 'playbook-vehicle' },
    ],
  },
  infiltrator: {
    pilot: [
      { id: 'inf-crack', name: 'Fine security cracker', load: 0, source: 'playbook-pilot' },
      { id: 'inf-camo', name: 'Fine optical camo', load: 1, source: 'playbook-pilot' },
      { id: 'inf-climb', name: 'Light climbing gear', load: 1, source: 'playbook-pilot' },
      { id: 'inf-silencer', name: 'Firearm silencer', load: 0, source: 'playbook-pilot' },
      { id: 'inf-nvg', name: 'Nightvision goggles', load: 1, source: 'playbook-pilot' },
      { id: 'inf-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'inf-vcamo', name: 'Fine optical camo (vehicle)', load: 1, source: 'playbook-vehicle' },
      { id: 'inf-mobility', name: 'Light mobility suite', load: 1, source: 'playbook-vehicle' },
      { id: 'inf-ecm', name: 'Electronic Countermeasures', load: 1, source: 'playbook-vehicle' },
      { id: 'inf-sensors', name: 'NV/IR sensors', load: 1, source: 'playbook-vehicle' },
    ],
  },
  officer: {
    pilot: [
      { id: 'off-uniform', name: 'Fine uniform', load: 0, source: 'playbook-pilot' },
      { id: 'off-sidearm', name: 'Fine sidearm', load: 1, source: 'playbook-pilot' },
      { id: 'off-maps', name: 'Fine maps and charts', load: 0, source: 'playbook-pilot' },
      { id: 'off-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'off-command', name: 'Command suite', load: 1, source: 'playbook-vehicle' },
      { id: 'off-armory', name: 'Small Armory', load: 1, source: 'playbook-vehicle' },
    ],
  },
  scout: {
    pilot: [
      { id: 'sco-pistol', name: 'Fine machine pistol', load: 1, source: 'playbook-pilot' },
      { id: 'sco-sniper', name: 'Fine sniper rifle', load: 2, source: 'playbook-pilot' },
      { id: 'sco-ammo', name: 'Special ammunition', load: 1, source: 'playbook-pilot' },
      { id: 'sco-rangefinder', name: 'Rangefinder/laser painter binoculars', load: 1, source: 'playbook-pilot' },
      { id: 'sco-robot', name: 'Well programmed hunter robot', load: 1, source: 'playbook-pilot' },
      { id: 'sco-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'sco-cannon', name: 'Fine heavy cannon', load: 2, source: 'playbook-vehicle' },
      { id: 'sco-vammo', name: 'Special ammunition (vehicle)', load: 1, source: 'playbook-vehicle' },
      { id: 'sco-magnify', name: 'Magnification suite', load: 1, source: 'playbook-vehicle' },
      { id: 'sco-drones', name: 'Drone carrier', load: 1, source: 'playbook-vehicle' },
    ],
  },
  soldier: {
    pilot: [
      { id: 'sol-melee', name: 'Fine melee weapon', load: 1, source: 'playbook-pilot' },
      { id: 'sol-rifle', name: 'Fine assault rifle', load: 2, source: 'playbook-pilot' },
      { id: 'sol-antiarmor', name: 'Anti-armour weapon', load: 2, source: 'playbook-pilot' },
      { id: 'sol-grenades', name: 'Frag, flash, or smoke grenades (3 uses)', load: 1, source: 'playbook-pilot' },
      { id: 'sol-cuffs', name: 'Handcuffs or zipties', load: 0, source: 'playbook-pilot' },
      { id: 'sol-stim', name: 'Stimpack', load: 0, source: 'playbook-pilot' },
      { id: 'sol-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'sol-vmelee', name: 'Fine melee weapon (vehicle)', load: 1, source: 'playbook-vehicle' },
      { id: 'sol-heavy', name: 'Fine heavy melee weapon', load: 2, source: 'playbook-vehicle' },
      { id: 'sol-scary', name: 'Scary weapon or tool', load: 1, source: 'playbook-vehicle' },
      { id: 'sol-tangle', name: 'A tangle gun', load: 1, source: 'playbook-vehicle' },
    ],
  },
  technician: {
    pilot: [
      { id: 'tech-eng-tools', name: 'Fine engineering tools', load: 1, source: 'playbook-pilot' },
      { id: 'tech-demo-tools', name: 'Fine demolition tools', load: 2, source: 'playbook-pilot' },
      { id: 'tech-airgun', name: 'Air-gun, darts and syringes', load: 1, source: 'playbook-pilot' },
      { id: 'tech-bandolier', name: 'Bandolier', load: 1, source: 'playbook-pilot' },
      { id: 'tech-gadgets', name: 'Gadgets', load: 1, source: 'playbook-pilot' },
      { id: 'tech-vehicle', name: 'Your custom vehicle', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'tech-modding', name: 'Fine Modding tools', load: 1, source: 'playbook-vehicle' },
      { id: 'tech-destroy', name: 'Fine Destruction tools', load: 2, source: 'playbook-vehicle' },
      { id: 'tech-payload', name: 'PayLoad bay', load: 1, source: 'playbook-vehicle' },
      { id: 'tech-repair', name: 'Assisted repair system', load: 1, source: 'playbook-vehicle' },
      { id: 'tech-analytics', name: 'Analytics suite', load: 1, source: 'playbook-vehicle' },
    ],
  },
};

export function getAvailableGear(playbookId: string): GearItem[] {
  const pb = PLAYBOOK_GEAR[playbookId];
  if (!pb) return [...STANDARD_PILOT_GEAR];
  return [...STANDARD_PILOT_GEAR, ...pb.pilot, ...pb.vehicle];
}
