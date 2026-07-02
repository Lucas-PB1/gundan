/** Pares de descritores de exemplo — Beam Saber p. 113 */
export interface QuirkExample {
  id: string;
  descriptorPlus: string;
  descriptorMinus: string;
  suggestedName: string;
  help: string;
}

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
    descriptorPlus: 'Hardpoints fixos',
    descriptorMinus: 'Sistemas redundantes',
    help: 'Armas montadas são estáveis e letais (+); sistemas duplicados pesam e falham em cascata (−).',
  },
  {
    id: 'boosters-targeters',
    suggestedName: 'Pacote de Afterburner',
    descriptorPlus: 'Boosters cegantes',
    descriptorMinus: 'Miras agressivas',
    help: 'Boosters cegam perseguidores (+); mira agressiva atrai atenção e gasta energia (−).',
  },
];

export const QUIRK_RULES_SUMMARY = `Cada peculiaridade tem um nome e dois descritores (+ e −). Esgote 1 peculiaridade para: +1d, +efeito ou agir com dano nível 3 no veículo — só quando um descritor ajuda na situação. Pelo menos um descritor deve poder ser desvantagem (XP no fim da sessão se sofrer por causa dele). Com todas esgotadas: manda o mecha embora (colapso) ou ação direta.`;

export const QUIRK_FIELD_HELP = {
  name: 'Nome do traço único do seu mecha (ex.: Veloz e Barulhento, Suíte de Camuflagem Óptica).',
  descriptorPlus: 'Quando este lado ajuda na ficção, você pode esgotar a peculiaridade para se esforçar.',
  descriptorMinus: 'Lado problemático — marque XP se te atrapalhar na sessão.',
  exhausted: 'Marcado após usar a peculiaridade numa rolagem (+1d, +efeito ou agir com dano 3).',
} as const;
