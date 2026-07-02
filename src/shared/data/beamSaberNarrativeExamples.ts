import {
  EXAMPLE_HISTORIES,
  EXAMPLE_OPENINGS,
  EXAMPLE_TRAGEDIES,
} from './beamSaberPilotData';

/** Exemplos de texto por categoria de História — Beam Saber p. 40 */
export const HISTORY_TEXT_BY_CATEGORY: Record<(typeof EXAMPLE_HISTORIES)[number], readonly string[]> = {
  Acadêmico: [
    'Professor universitário',
    'Estudante de graduação ou pós',
    'Pesquisador em laboratório',
    'Médico em hospital público',
    'Jornalista investigativo',
  ],
  Arte: [
    'Arquiteto de projetos civis',
    'Escultor ou artista visual',
    'Escritor ou roteirista',
    'Compositor ou músico',
  ],
  Criminoso: [
    'Arrombador ou ladrão',
    'Golpista ou vigarista',
    'Membro de gangue de rua',
    'Traficante de contrabando leve',
  ],
  Entretenimento: [
    'Ator ou atriz',
    'Ídolo pop ou influencer',
    'Atleta profissional',
    'Livestreamer ou podcaster',
    'Artista de entretenimento adulto',
  ],
  Família: [
    'Pai ou mãe em tempo integral',
    'Adolescente ainda na escola',
    'Responsável legal por crianças',
    'Membro ativo da associação de pais',
  ],
  'Trabalho manual': [
    'Agricultor ou trabalhador rural',
    'Operário de fábrica',
    'Motorista de transporte',
    'Costureiro ou artesão',
    'Minerador',
  ],
  Lei: [
    'Policial ou agente de segurança',
    'Advogado de defesa',
    'Assistente social',
    'Escrivão ou funcionário do fórum',
  ],
  Militar: [
    'Cadete em academia',
    'Posto tranquilo longe da linha de frente',
    'Intendente ou logística militar',
    'Marinheiro de convés',
    'Guerrilheiro de baixa intensidade',
  ],
  Político: [
    'Vereador ou conselheiro local',
    'Voluntário de campanha',
    'Propagandista ou assessor',
    'Ativista político',
  ],
  Espiritual: [
    'Membro de coral ou comunidade',
    'Praticante de yoga ou meditação',
    'Sacerdote ou líder religioso',
    'Psicólogo clínico',
  ],
  Comércio: [
    'Corretor da bolsa',
    'Caixa de supermercado',
    'Banqueiro de agência',
    'Negociante de equipamento militar',
  ],
};

export const NARRATIVE_PICKER_COPY = {
  choose: 'Escolher…',
  customize: 'Personalizar',
  back: 'Voltar',
  categories: 'Categorias',
  examples: 'Exemplos de texto',
  customPlaceholder: 'Descreva com suas palavras…',
  useText: 'Usar este texto',
  clear: 'Limpar',
} as const;

export type NarrativePickerKind = 'history' | 'tragedy' | 'opening';

export function getNarrativeCategories(kind: NarrativePickerKind): readonly string[] {
  if (kind === 'history') return EXAMPLE_HISTORIES;
  if (kind === 'tragedy') return EXAMPLE_TRAGEDIES;
  return EXAMPLE_OPENINGS;
}

export function getNarrativeExamples(kind: NarrativePickerKind, category: string): readonly string[] {
  if (kind === 'history') {
    return HISTORY_TEXT_BY_CATEGORY[category as keyof typeof HISTORY_TEXT_BY_CATEGORY] ?? [];
  }
  if (kind === 'tragedy') return EXAMPLE_TRAGEDIES;
  return EXAMPLE_OPENINGS;
}

export function formatHistoryValue(category: string, example: string): string {
  return `${category} — ${example}`;
}

export function parseHistoryValue(value: string): { category: string; example: string } | null {
  const sep = value.indexOf(' — ');
  if (sep === -1) return null;
  return {
    category: value.slice(0, sep),
    example: value.slice(sep + 3),
  };
}
