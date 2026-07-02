import rawAbilities from './beamSaberAbilities.generated.json';
import { PILOT_ACTIONS, VEHICLE_ACTIONS } from './beamSaberPilotData';

function cleanAbilityKey(key: string): string {
  // PDF usa glifo PUA (ex. U+F06C) antes do nome — não é bullet Unicode comum
  const start = key.search(/[A-Za-z]/);
  return (start >= 0 ? key.slice(start) : key).trim();
}

/** Correções e habilidades que o parser não capturou por completo */
const ABILITY_OVERRIDES: Record<string, Record<string, string>> = {
  ace: {
    'Travelling Companion':
      'Exhaust 1 Quirk ou gaste 2 Stress para Push Yourself em ações de veículo.',
    Veteran: 'Escolha uma habilidade especial de outra fonte. Pode ser tomada até 3 vezes.',
    'Red Comet':
      'Reputação de piloto habilidoso. +1d ao impressionar ou amedrontar com a fama. Ao se revelar com ação dramática, os presentes ficam atordoados.',
  },
  empath: {
    Broadcast:
      'Ao push yourself: paralisar alguém com mente/voz, ou instilar emoção poderosa e indireta no grupo. Atenção: controle mental — discuta consentimento na mesa.',
    Carouse:
      'Em Cut Loose, escolha um bônus extra (curar Stress, +1d em ação social, etc.).',
    'Everybody Hurts':
      'Gaste Spark para resistir consequência de dor emocional ou empurrar ações de apoio.',
    'Carry That Weight':
      'Push yourself depois de ver o resultado do dado.',
    'Good Hearted':
      'Ao agir com compaixão genuína, +1d para quem recebe o benefício.',
    Veteran: 'Escolha uma habilidade de outra fonte (até 3×).',
  },
  hacker: {
    Tesla:
      'Ao push yourself: descarga elétrica como arma, ou tempestade de AR (anúncios, neon, multidão) causando confusão.',
    Veteran: 'Escolha uma habilidade de outra fonte (até 3×).',
  },
  infiltrator: {
    "The Devil's Footsteps":
      'Ao push yourself: façanha atlética sobre-humana, ou confundir inimigos para atacarem uns aos outros.',
    Veteran: 'Escolha uma habilidade de outra fonte (até 3×).',
  },
  officer: {
    Rally:
      'Gaste 2 Stress para direcionar multidão (ação, violência ou impedir dano). +1 Stress por direção extra.',
    Veteran: 'Escolha uma habilidade de outra fonte (até 3×).',
  },
  scout: {
    Sharpshooter:
      'Ao push yourself: tiro em distância extrema, rajada supressiva, ou ricochete.',
    Terminator:
      'Robô caçador ganha upgrade (Beast of Burden, Mind-Link ou Quick and Quiet). +Effect vs máquinas.',
    Veteran: 'Escolha uma habilidade de outra fonte (até 3×).',
  },
  soldier: {
    Veteran: 'Escolha uma habilidade de outra fonte (até 3×).',
  },
  technician: {
    Simulation:
      '+1d em engagement rolls. Em 4–5 em Action Rolls, você escolhe a consequência (o GM adapta).',
    'Jury Rig':
      '2 Stress: reduz Effect (não nível) de dano do veículo até o fim da missão. Com Doctor, funciona em Harm de piloto.',
    Researcher: '+1 nível de resultado ao inventar/criar. Começa com 1 design especial.',
    Fortitude:
      'Spark: resistir fadiga, fraqueza ou efeitos químicos; ou push yourself em trabalho técnico.',
    'Road Master':
      'Wreck/Destroy com substâncias experimentais para terreno impassável ou favorável.',
    Doctor:
      'Engineer em corpos vivos. +1d em recovery para todo o esquadrão.',
    Saboteur: 'Wreck mais silencioso e oculto. Explosivos: +1d mas não fica quieto.',
    'Custom Implant':
      'Gadget/químico oculto no corpo (0 Load). 1 Stress para usar. Trocar = projeto longo 4 seções.',
    Veteran: 'Escolha uma habilidade de outra fonte (até 3×).',
  },
};

const parsedIndex: Record<string, Record<string, string>> = {};
for (const [playbookId, abilities] of Object.entries(rawAbilities as Record<string, Record<string, string>>)) {
  parsedIndex[playbookId] = {};
  for (const [key, desc] of Object.entries(abilities)) {
    const name = cleanAbilityKey(key);
    if (!name || name.length < 2) continue;
    const clean = desc.replace(/\s+\d{2,3}$/, '').trim();
    if (!parsedIndex[playbookId][name] || parsedIndex[playbookId][name].length < clean.length) {
      parsedIndex[playbookId][name] = clean;
    }
  }
  Object.assign(parsedIndex[playbookId], ABILITY_OVERRIDES[playbookId] ?? {});
}

export function getAbilityDescription(playbookId: string, abilityName: string): string | undefined {
  if (!playbookId || !abilityName) return undefined;
  return parsedIndex[playbookId]?.[abilityName];
}

export const FIELD_HELP: Record<string, string> = {
  playbook:
    'Archetype do piloto (Ace, Soldier, Hacker…). Define bônus iniciais de ação, gear especialista e lista de habilidades.',
  history:
    'Quem você era antes da Tragedy. Ao expressar na sessão, marca XP no final.',
  tragedy:
    'Evento que te lançou na Guerra. Ao expressar na sessão, marca XP.',
  opening:
    'O que fez entre a Tragedy e entrar no Squad. +1 em ação na criação. XP se expressar na sessão.',
  drive:
    'Frase sobre o que você quer mudar no mundo. Preenche relógios de Drive ao avançar esse objetivo.',
  ability:
    'Uma habilidade especial do seu Playbook escolhida na criação. Veteran permite pegar de outro playbook depois.',
  stress:
    'Recurso para push yourself, flashbacks, assistir, resistir e habilidades. Máximo 9 (10 com Survivor).',
  harm:
    'Ferimentos em 3 níveis + morte no 4. Penalidades em dados conforme o nível.',
  scars:
    'Marcas permanentes ao estourar Stress. 4ª Scar remove o piloto da guerra.',
  connections:
    'Relógio de 4 ticks por piloto/NPC. Cada tick = uma Belief. Clock cheio → verdade revelada, reset.',
  loadout:
    'Itens declarados na missão. Cada um tem Load; não exceda o limite do modo (light/normal/heavy).',
  quirks:
    'Traços únicos do veículo. Exhaust para +1d, +Effect ou agir com dano nível 3.',
  armor: 'Gasta 1 uso para ignorar Harm ou reduzir dano de veículo (conforme regras).',
  spark: 'Recurso único por piloto. Várias habilidades permitem gastar o Spark.',
  driveClock:
    'Dois relógios de 4 ticks. Preencha ao fazer algo novo que avance seu Drive.',
  playbookXp: '8 ticks = nova habilidade do Playbook.',
  attributeXp: '6 ticks em Insight/Prowess/Resolve = +1 em uma ação daquele atributo.',
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
  if (pilot) return `${pilot.name} (${pilot.attribute}): ${pilot.description}`;
  const vehicle = VEHICLE_ACTIONS.find((a) => a.id === actionId);
  if (vehicle) return `${vehicle.name} (${vehicle.attribute}): ${vehicle.description}`;
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
