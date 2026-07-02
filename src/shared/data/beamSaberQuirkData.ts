import type { VehicleQuirk } from '../../domain/entities/PilotSheet';

/** Pares de descritores de exemplo — Beam Saber p. 113 */
export interface QuirkExample {
  id: string;
  descriptorPlus: string;
  descriptorMinus: string;
  suggestedName: string;
  help: string;
}

/** Nomes sugeridos em inglês (versões antigas da ficha) → português */
const QUIRK_NAME_PT: Record<string, string> = {
  'Dread Shell': 'Casco do Medo',
  'Limber Giant': 'Gigante Ágil',
  'Iron Strider': 'Corredor de Ferro',
  'Iron Runner': 'Corredor de Ferro',
  'Field Specialist': 'Especialista de Campo',
  'Modular Tank': 'Tanque Modular',
  'Afterburner Package': 'Pacote de pós-combustão',
};

/** Descritores em inglês (versões antigas) → português */
const QUIRK_DESCRIPTOR_PT: Record<string, string> = {
  'Ominous Appearance': 'Aparência ameaçadora',
  'Splintering Carapace': 'Carapaça estilhaçante',
  'Flexible Structure': 'Estrutura flexível',
  'Mighty Clumsy': 'Poderoso e desajeitado',
  'Slow and Heavy': 'Lento e pesado',
  'Light Footed': 'Pé leve',
  'Military Workhorse': 'Cavalo de batalha militar',
  'Common Parts': 'Peças comuns',
  'Fixed Hardpoints': 'Suportes de arma fixos',
  'Redundant Systems': 'Sistemas redundantes',
  'Blinding Boosters': 'Propulsores cegantes',
  'Aggressive Targeters': 'Miras agressivas',
  'Hardpoints fixos': 'Suportes de arma fixos',
  'Boosters cegantes': 'Propulsores cegantes',
};

export const QUIRK_EXAMPLES: QuirkExample[] = [
  {
    id: 'ominous-splintering',
    suggestedName: 'Casco do Medo',
    descriptorPlus: 'Aparência ameaçadora',
    descriptorMinus: 'Carapaça estilhaçante',
    help: 'Intimida inimigos e civis (+), mas a blindagem racha e vaza sob pressão (−).',
  },
  {
    id: 'flexible-clumsy',
    suggestedName: 'Gigante Ágil',
    descriptorPlus: 'Estrutura flexível',
    descriptorMinus: 'Poderoso e desajeitado',
    help: 'Dobra-se em espaços apertados e absorve impacto (+); movimentos amplos são desajeitados e barulhentos (−).',
  },
  {
    id: 'slow-light',
    suggestedName: 'Corredor de Ferro',
    descriptorPlus: 'Lento e pesado',
    descriptorMinus: 'Pé leve',
    help: 'Peso esmaga obstáculos e ancora posição (+); em terreno frágil ou corredores estreitos é surpreendentemente leve (−).',
  },
  {
    id: 'workhorse-parts',
    suggestedName: 'Especialista de Campo',
    descriptorPlus: 'Cavalo de batalha militar',
    descriptorMinus: 'Peças comuns',
    help: 'Aguenta punição e logística militar (+); peças genéricas limitam desempenho de ponta (−).',
  },
  {
    id: 'hardpoints-redundant',
    suggestedName: 'Tanque Modular',
    descriptorPlus: 'Suportes de arma fixos',
    descriptorMinus: 'Sistemas redundantes',
    help: 'Armas montadas são estáveis e letais (+); sistemas duplicados pesam e falham em cascata (−).',
  },
  {
    id: 'boosters-targeters',
    suggestedName: 'Pacote de pós-combustão',
    descriptorPlus: 'Propulsores cegantes',
    descriptorMinus: 'Miras agressivas',
    help: 'Propulsores cegam perseguidores (+); mira agressiva atrai atenção e gasta energia (−).',
  },
];

export const QUIRK_SOURCE_CUSTOM = 'custom';

export function findQuirkExampleMatch(quirk: VehicleQuirk): QuirkExample | undefined {
  return QUIRK_EXAMPLES.find(
    (ex) =>
      ex.descriptorPlus === quirk.descriptor1 && ex.descriptorMinus === quirk.descriptor2,
  );
}

export function getQuirkSelectValue(quirk: VehicleQuirk): string {
  if (quirk.templateId === null || quirk.templateId === QUIRK_SOURCE_CUSTOM) {
    return QUIRK_SOURCE_CUSTOM;
  }
  if (quirk.templateId && QUIRK_EXAMPLES.some((ex) => ex.id === quirk.templateId)) {
    return quirk.templateId;
  }
  const match = findQuirkExampleMatch(quirk);
  if (match && match.suggestedName === quirk.name) return match.id;
  return QUIRK_SOURCE_CUSTOM;
}

export const QUIRK_CUSTOM_HELP =
  'Crie um nome e dois descritores (+ e −) do seu mecha. Pelo menos um deve poder te prejudicar na ficção (XP no fim da sessão). Esgote a peculiaridade para +1d, +efeito ou agir com dano 3.';

export function migrateQuirkToPt(quirk: VehicleQuirk): VehicleQuirk {
  return {
    ...quirk,
    name: QUIRK_NAME_PT[quirk.name] ?? quirk.name,
    descriptor1: QUIRK_DESCRIPTOR_PT[quirk.descriptor1] ?? quirk.descriptor1,
    descriptor2: QUIRK_DESCRIPTOR_PT[quirk.descriptor2] ?? quirk.descriptor2,
  };
}

export const QUIRK_RULES_SUMMARY = `Cada peculiaridade tem um nome e dois descritores (+ e −). Esgote 1 peculiaridade para: +1d, +efeito ou agir com dano nível 3 no veículo — só quando um descritor ajuda na situação. Pelo menos um descritor deve poder ser desvantagem (XP no fim da sessão se sofrer por causa dele). Com todas esgotadas: manda o mecha embora (colapso) ou ação direta.`;

export const QUIRK_FIELD_HELP = {
  template:
    'Use um exemplo do livro ou escolha Personalizada para inventar nome e descritores do seu mecha.',
  name: 'Nome do traço único do seu mecha (ex.: Veloz e Barulhento, Suíte de Camuflagem Óptica).',
  descriptorPlus: 'Quando este lado ajuda na ficção, você pode esgotar a peculiaridade para se esforçar.',
  descriptorMinus: 'Lado problemático — marque XP se te atrapalhar na sessão.',
  exhausted: 'Marcado após usar a peculiaridade numa rolagem (+1d, +efeito ou agir com dano 3).',
} as const;
