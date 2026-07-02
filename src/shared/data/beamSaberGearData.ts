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
  { id: 'bribe', name: 'Suborno (1 carga por ponto de Pessoal/Material)', load: 1, source: 'standard' },
  { id: 'blade', name: 'Uma ou duas lâminas', load: 1, source: 'standard' },
  { id: 'throwing-knives', name: 'Facas de arremesso', load: 1, source: 'standard' },
  { id: 'heavy-weapon', name: 'Arma pesada', load: 2, source: 'standard' },
  { id: 'unusual-weapon', name: 'Arma incomum', load: 1, source: 'standard' },
  { id: 'burglary-gear', name: 'Kit de arrombamento', load: 1, source: 'standard' },
  { id: 'climbing-gear', name: 'Equipamento de escalada', load: 2, source: 'standard' },
  { id: 'pistol', name: 'Pistola', load: 1, source: 'standard' },
  { id: 'rifle-shotgun', name: 'Rifle ou espingarda', load: 2, source: 'standard' },
  { id: 'palm-computer', name: 'Computador de palma com programas úteis', load: 1, source: 'standard' },
  { id: 'documents', name: 'Documentos', load: 1, source: 'standard' },
  { id: 'subterfuge', name: 'Material de subterfúgio', load: 1, source: 'standard' },
  { id: 'demolition-tools', name: 'Ferramentas de demolição', load: 2, source: 'standard' },
  { id: 'explosives', name: 'Explosivos posicionados', load: 1, source: 'standard' },
  { id: 'flashlight', name: 'Lanterna, sinalizadores ou bastões luminosos', load: 1, source: 'standard' },
  { id: 'icp', name: 'Programa de Contramedidas de Intrusão (PCI)', load: 0, source: 'standard' },
  { id: 'armor', name: 'Armadura', load: 2, source: 'standard' },
  { id: 'heavy-armor', name: 'Armadura pesada', load: 5, source: 'standard' },
  { id: 'intel', name: 'Inteligência', load: 0, source: 'standard' },
  { id: 'parachute', name: 'Paraquedas', load: 2, source: 'standard' },
  { id: 'throat-mic', name: 'Transceptor de microfone de garganta', load: 0, source: 'standard' },
  { id: 'long-range-tx', name: 'Transmissor de longo alcance', load: 1, source: 'standard' },
  { id: 'smartphone', name: 'Smartphone', load: 0, source: 'standard' },
  { id: 'env-suit', name: 'Traje ambiental', load: 0, source: 'standard' },
  { id: 'remote-control', name: 'Controle remoto de veículo', load: 1, source: 'standard' },
];

/** Equipamento especialista por arquétipo (piloto + veículo) — extraído do PDF p. 60–101 */
export const PLAYBOOK_GEAR: Record<string, { pilot: GearItem[]; vehicle: GearItem[] }> = {
  ace: {
    pilot: [
      { id: 'ace-grav-chute', name: 'Paraquedas gravitacional', load: 1, source: 'playbook-pilot' },
      { id: 'ace-remote', name: 'Excelente controle remoto de veículo', load: 1, source: 'playbook-pilot' },
      { id: 'ace-self-destruct', name: 'Controle remoto de autodestruição', load: 0, source: 'playbook-pilot' },
      { id: 'ace-env-suit', name: 'Excelente traje ambiental', load: 0, source: 'playbook-pilot' },
      { id: 'ace-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'ace-mobility', name: 'Excelente pacote de mobilidade', load: 2, source: 'playbook-vehicle' },
      { id: 'ace-reactor', name: 'Reator turbinado (1 uso)', load: 1, source: 'playbook-vehicle' },
      { id: 'ace-mg', name: 'Excelente metralhadora', load: 1, source: 'playbook-vehicle' },
      { id: 'ace-shield', name: 'Excelente escudo ou campo de força', load: 1, source: 'playbook-vehicle' },
      { id: 'ace-rage', name: 'R.A.G.E', load: 0, source: 'playbook-vehicle' },
    ],
  },
  bureaucrat: {
    pilot: [
      { id: 'bur-docs', name: 'Excelentes documentos oficiais', load: 1, source: 'playbook-pilot' },
      { id: 'bur-scanner', name: 'Varinha de scanner corporal', load: 1, source: 'playbook-pilot' },
      { id: 'bur-reports', name: 'Relatórios de viagem', load: 0, source: 'playbook-pilot' },
      { id: 'bur-blueprints', name: 'Plantas de instalação ou veículo', load: 1, source: 'playbook-pilot' },
      { id: 'bur-barricade', name: 'Projetor de fita de barricada', load: 1, source: 'playbook-pilot' },
      { id: 'bur-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'bur-style', name: 'Estilo discreto', load: 0, source: 'playbook-vehicle' },
      { id: 'bur-tools', name: 'Vários conjuntos de ferramentas manuais', load: 1, source: 'playbook-vehicle' },
      { id: 'bur-cargo', name: 'Excelente contêiner de carga', load: 1, source: 'playbook-vehicle' },
      { id: 'bur-clamp', name: 'Grampo inibidor', load: 1, source: 'playbook-vehicle' },
    ],
  },
  empath: {
    pilot: [
      { id: 'emp-prognostication', name: 'Ferramentas de prognóstico', load: 1, source: 'playbook-pilot' },
      { id: 'emp-art', name: 'Excelentes ferramentas artísticas', load: 1, source: 'playbook-pilot' },
      { id: 'emp-emblem', name: 'Emblema pessoal', load: 1, source: 'playbook-pilot' },
      { id: 'emp-hope', name: 'Símbolo de esperança', load: 1, source: 'playbook-pilot' },
      { id: 'emp-stun', name: 'Excelente arma de atordoamento', load: 1, source: 'playbook-pilot' },
      { id: 'emp-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'emp-appearance', name: 'Aparência inspiradora', load: 1, source: 'playbook-vehicle' },
      { id: 'emp-broadcast', name: 'Excelente sistema de transmissão', load: 1, source: 'playbook-vehicle' },
      { id: 'emp-sdr', name: 'Excelente programa de recuperação de dados sociais', load: 1, source: 'playbook-vehicle' },
      { id: 'emp-psi', name: 'Amplificador psiônico', load: 1, source: 'playbook-vehicle' },
    ],
  },
  envoy: {
    pilot: [
      { id: 'env-clothes', name: 'Excelentes roupas e joias', load: 0, source: 'playbook-pilot' },
      { id: 'env-disguise', name: 'Excelente kit de disfarce', load: 1, source: 'playbook-pilot' },
      { id: 'env-gambling', name: 'Excelente kit de jogos de azar', load: 0, source: 'playbook-pilot' },
      { id: 'env-espionage', name: 'Excelente equipamento de espionagem', load: 1, source: 'playbook-pilot' },
      { id: 'env-trance', name: 'Pó de transe', load: 0, source: 'playbook-pilot' },
      { id: 'env-cane', name: 'Espada-bengala', load: 1, source: 'playbook-pilot' },
      { id: 'env-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'env-holo', name: 'Excelente holoprojetor', load: 1, source: 'playbook-vehicle' },
      { id: 'env-chaff', name: 'Contramedida de chaff', load: 1, source: 'playbook-vehicle' },
      { id: 'env-melee', name: 'Arma corpo a corpo oculta', load: 1, source: 'playbook-vehicle' },
      { id: 'env-style', name: 'Aparência estilosa', load: 0, source: 'playbook-vehicle' },
      { id: 'env-luxury', name: 'Espaço luxuoso para passageiros', load: 1, source: 'playbook-vehicle' },
    ],
  },
  hacker: {
    pilot: [
      { id: 'hack-pezone', name: 'Zona de exclusão portátil', load: 1, source: 'playbook-pilot' },
      { id: 'hack-ar', name: 'Excelente ferramenta de realidade aumentada', load: 1, source: 'playbook-pilot' },
      { id: 'hack-qd', name: 'Drive quântico', load: 1, source: 'playbook-pilot' },
      { id: 'hack-rig', name: 'Hackrig', load: 1, source: 'playbook-pilot' },
      { id: 'hack-projector', name: 'Projetor de dados recursivo', load: 1, source: 'playbook-pilot' },
      { id: 'hack-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'hack-retrieval', name: 'Excelente programa de recuperação', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-coding', name: 'Excelente programa de codificação', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-filter', name: 'Filtro eletrônico', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-stealth', name: 'Programa de furtividade', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-bomb', name: 'Programa de bomba de dados', load: 1, source: 'playbook-vehicle' },
      { id: 'hack-icp', name: 'Excelente PCI', load: 1, source: 'playbook-vehicle' },
    ],
  },
  infiltrator: {
    pilot: [
      { id: 'inf-crack', name: 'Excelente quebrador de segurança', load: 0, source: 'playbook-pilot' },
      { id: 'inf-camo', name: 'Excelente camuflagem óptica', load: 1, source: 'playbook-pilot' },
      { id: 'inf-climb', name: 'Equipamento de escalada leve', load: 1, source: 'playbook-pilot' },
      { id: 'inf-silencer', name: 'Silenciador de arma de fogo', load: 0, source: 'playbook-pilot' },
      { id: 'inf-nvg', name: 'Óculos de visão noturna', load: 1, source: 'playbook-pilot' },
      { id: 'inf-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'inf-vcamo', name: 'Excelente camuflagem óptica (veículo)', load: 1, source: 'playbook-vehicle' },
      { id: 'inf-mobility', name: 'Pacote de mobilidade leve', load: 1, source: 'playbook-vehicle' },
      { id: 'inf-ecm', name: 'Contramedidas eletrônicas', load: 1, source: 'playbook-vehicle' },
      { id: 'inf-sensors', name: 'Sensores NV/IR', load: 1, source: 'playbook-vehicle' },
    ],
  },
  officer: {
    pilot: [
      { id: 'off-uniform', name: 'Excelente uniforme', load: 0, source: 'playbook-pilot' },
      { id: 'off-sidearm', name: 'Excelente arma secundária', load: 1, source: 'playbook-pilot' },
      { id: 'off-maps', name: 'Excelentes mapas e cartas', load: 0, source: 'playbook-pilot' },
      { id: 'off-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'off-command', name: 'Suíte de comando', load: 1, source: 'playbook-vehicle' },
      { id: 'off-armory', name: 'Pequeno arsenal', load: 1, source: 'playbook-vehicle' },
    ],
  },
  scout: {
    pilot: [
      { id: 'sco-pistol', name: 'Excelente metralhadora de mão', load: 1, source: 'playbook-pilot' },
      { id: 'sco-sniper', name: 'Excelente rifle de precisão', load: 2, source: 'playbook-pilot' },
      { id: 'sco-ammo', name: 'Munição especial', load: 1, source: 'playbook-pilot' },
      { id: 'sco-rangefinder', name: 'Binóculos com telemetria/pintor a laser', load: 1, source: 'playbook-pilot' },
      { id: 'sco-robot', name: 'Robô caçador bem programado', load: 1, source: 'playbook-pilot' },
      { id: 'sco-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'sco-cannon', name: 'Excelente canhão pesado', load: 2, source: 'playbook-vehicle' },
      { id: 'sco-vammo', name: 'Munição especial (veículo)', load: 1, source: 'playbook-vehicle' },
      { id: 'sco-magnify', name: 'Suíte de ampliação', load: 1, source: 'playbook-vehicle' },
      { id: 'sco-drones', name: 'Porta-drones', load: 1, source: 'playbook-vehicle' },
    ],
  },
  soldier: {
    pilot: [
      { id: 'sol-melee', name: 'Excelente arma corpo a corpo', load: 1, source: 'playbook-pilot' },
      { id: 'sol-rifle', name: 'Excelente rifle de assalto', load: 2, source: 'playbook-pilot' },
      { id: 'sol-antiarmor', name: 'Arma antiblindagem', load: 2, source: 'playbook-pilot' },
      { id: 'sol-grenades', name: 'Granadas de fragmentação, flash ou fumaça (3 usos)', load: 1, source: 'playbook-pilot' },
      { id: 'sol-cuffs', name: 'Algemas ou enforca-gato', load: 0, source: 'playbook-pilot' },
      { id: 'sol-stim', name: 'Estimpack', load: 0, source: 'playbook-pilot' },
      { id: 'sol-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'sol-vmelee', name: 'Excelente arma corpo a corpo (veículo)', load: 1, source: 'playbook-vehicle' },
      { id: 'sol-heavy', name: 'Excelente arma corpo a corpo pesada', load: 2, source: 'playbook-vehicle' },
      { id: 'sol-scary', name: 'Arma ou ferramenta intimidadora', load: 1, source: 'playbook-vehicle' },
      { id: 'sol-tangle', name: 'Arma de emaranhamento', load: 1, source: 'playbook-vehicle' },
    ],
  },
  technician: {
    pilot: [
      { id: 'tech-eng-tools', name: 'Excelentes ferramentas de engenharia', load: 1, source: 'playbook-pilot' },
      { id: 'tech-demo-tools', name: 'Excelentes ferramentas de demolição', load: 2, source: 'playbook-pilot' },
      { id: 'tech-airgun', name: 'Arma de ar, dardos e seringas', load: 1, source: 'playbook-pilot' },
      { id: 'tech-bandolier', name: 'Bandoleira', load: 1, source: 'playbook-pilot' },
      { id: 'tech-gadgets', name: 'Aparelhos', load: 1, source: 'playbook-pilot' },
      { id: 'tech-vehicle', name: 'Seu veículo personalizado', load: 0, source: 'playbook-pilot' },
    ],
    vehicle: [
      { id: 'tech-modding', name: 'Excelentes ferramentas de modificação', load: 1, source: 'playbook-vehicle' },
      { id: 'tech-destroy', name: 'Excelentes ferramentas de destruição', load: 2, source: 'playbook-vehicle' },
      { id: 'tech-payload', name: 'Baia de carga', load: 1, source: 'playbook-vehicle' },
      { id: 'tech-repair', name: 'Sistema de reparo assistido', load: 1, source: 'playbook-vehicle' },
      { id: 'tech-analytics', name: 'Suíte de análise', load: 1, source: 'playbook-vehicle' },
    ],
  },
};

export function getAvailableGear(playbookId: string): GearItem[] {
  const pb = PLAYBOOK_GEAR[playbookId];
  if (!pb) return [...STANDARD_PILOT_GEAR];
  return [...STANDARD_PILOT_GEAR, ...pb.pilot, ...pb.vehicle];
}
