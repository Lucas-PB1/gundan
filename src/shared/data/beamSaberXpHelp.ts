export const XP_RULES_SUMMARY = `Três trilhas de progresso. Você marca as caixas quando ganha XP na mesa — a ficha não calcula sozinha. No fim da sessão, o XP geral vira marcas em arquétipo ou atributo (você escolhe).`;

export const XP_HELP = {
  general: `Ganho no fim da sessão (+1 por item, +2 se repetiu): expressou História, Tragédia ou Abertura; sofreu por Crenças, Marcas ou peculiaridades do mecha; desafiou algo no estilo do gatilho XP do seu arquétipo. Depois distribua essas marcas em arquétipo ou atributo.`,
  playbook:
    'Marque ao treinar o arquétipo no tempo livre (+1 por atividade de treino) ou ao converter XP geral. Com 8 marcas: zera a trilha e ganha uma nova habilidade do arquétipo.',
  attribute:
    'Marque +1 ao fazer uma ação em posição desesperada (independente do resultado) — vai para o atributo daquela ação. Ou converta XP geral. Com 6 marcas: zera e sobe +1 em uma ação daquele atributo (máx. 3, salvo upgrade do esquadrão).',
  insight: 'Perspicácia — Caçar, Estudar, Vistoriar, Engenhar.',
  prowess: 'Destreza — Afinar, Rondar, Lutar, Arrombar.',
  resolve: 'Determinação — Comandar, Conviver, Interfácie, Influenciar.',
} as const;

export const XP_GAIN_CHECKLIST = [
  'História, Tragédia ou Abertura apareceram na sessão?',
  'Crenças sobre o esquadrão te atrapalharam?',
  'Marcas ou peculiaridades do mecha te prejudicaram?',
  'Você desafiou algo no estilo do gatilho XP do arquétipo?',
  'Ações desesperadas (marca direto no atributo, não no geral)?',
  'Treinou o arquétipo no tempo livre?',
] as const;
