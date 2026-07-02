/** Unifica aspas/apóstrofos do PDF com os nomes curados na UI. */
export function normalizeAbilityName(name: string): string {
  return name
    .replace(/[\u2018\u2019\u201B\u2032`´]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .trim();
}

export interface AbilityPt {
  label: string;
  description: string;
}

/** Nomes e regras das habilidades em português (chave = nome em inglês do livro). */
export const ABILITIES_PT: Record<string, Record<string, AbilityPt>> = {
  ace: {
    Adaptable: {
      label: 'Adaptável',
      description:
        'Gaste a centelha para deixar até dois pontos de carga do veículo não declarados ou para se esforçar numa manobra veicular.',
    },
    'More Than Meets The Eye': {
      label: 'Mais do Que Parece',
      description:
        'Seu veículo personalizado pode se transformar numa forma secundária. Detalhe essa forma. Escolha 2 de carga em equipamento veicular e 3 pontos de ações que o veículo tem — ele não tem isso na forma secundária. Escolha 2 de carga e 3 pontos de ações que o veículo não tem — ele ganha isso na forma secundária.',
    },
    'Meat Is Cheap, Save The Metal': {
      label: 'Carne é Barata, Poupe o Metal',
      description:
        'Quando o veículo que você pilota sofre dano, pode fazer o piloto receber ferimento de nível igual. Se resistir esse ferimento, −1d na rolagem. Armadura de piloto não previne esse dano.',
    },
    'Last Stand': {
      label: 'Última Resistência',
      description:
        'Em ação direta com veículo, pode continuar agindo em 4, 5 ou 6 (não só em 6). Ganhe +1d em ações diretas por ponto de colapso do veículo antes da ação terminar.',
    },
    'Advanced Prototype': {
      label: 'Protótipo Avançado',
      description:
        'Ao declarar equipamento veicular, pode marcá-lo como experimental: carga −1 (mín. 0). Ao esforçar o veículo usando esse item, +efeito e +1d. Só um item experimental por vez.',
    },
    Bloodlust: {
      label: 'Sede de Sangue',
      description:
        'Ganha a tragédia “Busca violência”. Ao derrotar um oponente digno (ou um bando de indignos) em batalha, cure 2 de estresse.',
    },
    'Red Comet': {
      label: 'Cometa Vermelho',
      description:
        'Reputação de piloto habilidoso (merecida ou não). +1d ao impressionar ou amedrontar com a fama. Ao se revelar com ação dramática, quem estiver por perto fica brevemente atordoado.',
    },
    'Travelling Companion': {
      label: 'Companheiro de Viagem',
      description:
        'Esgote 1 peculiaridade ou gaste 2 de estresse para se esforçar em ações de veículo.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  bureaucrat: {
    'Stay Late': {
      label: 'Ficar Até Tarde',
      description:
        'Receba ferimento nível 1 “Exausto” para dar a outro piloto uma atividade extra de tempo livre. Pode ser resistido normalmente.',
    },
    'Cook the Books': {
      label: 'Maquiar os Livros',
      description:
        'Gaste 2 de estresse e uma atividade de tempo livre para rolar suprimentos de novo. Em esquadrão independente a rolagem é 0d salvo bônus. Uma vez por fase de tempo livre.',
    },
    'Red Tape': {
      label: 'Burocracia',
      description:
        'Quando puder citar regulamento que impediria uma consequência, pode rolar Determinação para resistir em vez de outro atributo de piloto ou veículo.',
    },
    Connected: {
      label: 'Conexões',
      description:
        'No tempo livre, +1 nível de resultado ao adquirir ativo ou bajular contatos. +1d ao declarar aliado na missão.',
    },
    'Beneath Notice': {
      label: 'Abaixo do Radar',
      description:
        'Com disfarce ou engano, +1d em ações e resistências (ou esgote 1 peculiaridade a menos em resistência veicular) para confundir ou desviar suspeita. Ao abandonar o disfarce, surpreenda e ganhe iniciativa.',
    },
    'Work Hard, Play Hard': {
      label: 'Trabalho Duro, Festa Dura',
      description:
        'Ao descontrair, quem descontrai com você também pode rolar para curar estresse usando a conexão com você. Se qualquer um exagerar, ambos sofrem os efeitos.',
    },
    'Rainy Day': {
      label: 'Dia de Chuva',
      description:
        'Gaste a centelha para fornecer 1 ponto de suprimento imediato ou para se esforçar ao contornar ou impor protocolo.',
    },
    Forgettable: {
      label: 'Esquecível',
      description:
        'Ao influenciar alguém com sucesso, pode fazê-lo esquecer que isso aconteceu até a próxima interação com você.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  empath: {
    Telepathy: {
      label: 'Telepatia',
      description:
        'Comunique-se diretamente à mente de alguém como se falasse em voz alta, se já teve interação reveladora com essa pessoa. Em ação em grupo, gaste 1 de estresse por participante (incluindo o líder) para todos usarem o nível de ação do líder.',
    },
    Broadcast: {
      label: 'Transmissão',
      description:
        'Ao se esforçar, além dos benefícios normais: instile emoção poderosa e indireta no grupo — ou paralise alguém com mente ou voz. Atenção: controle mental — discuta consentimento na mesa.',
    },
    'Far Sight': {
      label: 'Visão Longínqua',
      description:
        'Ao reunir informações com Vistoriar, +1d. A informação pode vir de lugar e momento em que você não estava presente.',
    },
    Emoji: {
      label: 'Emoji',
      description:
        'Sabe interagir com app ou IA como se fossem humanos normais, por mais corrompidos que pareçam. +efeito ao comunicar-se com entidades digitais.',
    },
    Carouse: {
      label: 'Farrear',
      description:
        'Ao participar de descontrair, escolha: o piloto que descontrai não pode exagerar, mas cura metade do estresse rolado (arredondado para cima); sua relação com ele melhora +1; a relação dele com você melhora +1 adicional.',
    },
    'Everybody Hurts': {
      label: 'Todo Mundo Sofre',
      description:
        'Gaste a centelha para resistir consequência de emboscada (física ou não) ou para se esforçar ao compreender os outros.',
    },
    'Carry That Weight': {
      label: 'Carregar Esse Peso',
      description:
        'Pode se esforçar depois de ver o resultado da rolagem de ação, ou assistir depois da rolagem de um aliado se ninguém o assistiu. Num momento pessoal com alguém, pode receber qualquer quantidade de estresse (até o máximo) para curar a mesma quantidade nessa pessoa.',
    },
    'Good Hearted': {
      label: 'Bom Coração',
      description:
        'Ao agir com compaixão genuína (não só palavras) com um inimigo, mantém posição controlada até agir contra os interesses dele.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  envoy: {
    "Rook's Gambit": {
      label: 'Gambito do Torre',
      description:
        'Gaste 2 de estresse para rolar seu melhor nível de ação numa ação diferente, se puder justificar o uso da habilidade. Pode substituir ações de piloto por ações de veículo e vice-versa.',
    },
    'Cool Under Pressure': {
      label: 'Frio Sob Pressão',
      description: 'Ao receber ferimento, cure estresse igual ao nível desse ferimento.',
    },
    "Regent's Brilliance": {
      label: 'Brilho do Regente',
      description:
        'Você e seu séquito têm +efeito ao Conviver e Influenciar enquanto aproveitarem o quão impressionantes vocês são.',
    },
    'Like Looking into a Mirror': {
      label: 'Como Olhar num Espelho',
      description: 'Sempre percebe quando alguém está mentindo para você.',
    },
    'A Little Something on the Side': {
      label: 'Um Extra à Parte',
      description:
        'No fim de cada fase de tempo livre, role sorte usando o nível do esquadrão. Se 4+, adicione 1 tick a um relógio de impulso.',
    },
    "Read 'em And Weep": {
      label: 'Leia e Chore',
      description:
        'Gaste 2 de estresse para fazer uma pergunta sobre alguém que observou em segredo ou abertamente. +1 de estresse por pergunta extra: qual foi o pior momento?; do que busca perdão e de quem?; quais dores secretas?; em que a mente e a alma são vulneráveis?',
    },
    Subterfuge: {
      label: 'Subterfúgio',
      description:
        'Gaste a centelha para resistir consequência de suspeita ou persuasão, ou para se esforçar em subterfúgio.',
    },
    'Trust in Me': {
      label: 'Confie em Mim',
      description:
        '+1d contra alvo com quem tem relação forte. Para outro PC, isso é conexão +2 ou maior.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  hacker: {
    Compel: {
      label: 'Compelir',
      description:
        'Use Interfácie na realidade aumentada para forçar app ou proxy próximo a aparecer e obedecer um comando. Sempre distingue realidade de AR criada por programas que você invoca (aliados podem se perder).',
    },
    'Matrix Mind': {
      label: 'Mente da Matriz',
      description:
        'Sempre percebe apps e proxies presentes. +1d ao reunir informações sobre AR e apps.',
    },
    'Iron Will': {
      label: 'Vontade de Ferro',
      description:
        'Imune à confusão de AR que alguns apps causam à vista. +1d em resistências com Determinação.',
    },
    'Turing Test': {
      label: 'Teste de Turing',
      description: 'Sempre sabe se está interagindo com um humano.',
    },
    'Data Pack': {
      label: 'Pacote de Dados',
      description:
        'Pode Estudar um app (ou criar um novo) para desenvolvê-lo como forma reutilizável. Conhece métodos complexos de criar apps. Começa com um app já aprendido.',
    },
    Crowdsource: {
      label: 'Multidão-Fonte',
      description:
        'Gaste 2 de estresse para usar o nível de ação de um companheiro de esquadrão no lugar do seu, descrevendo como usa o conhecimento dele.',
    },
    Tesla: {
      label: 'Tesla',
      description:
        'Ao se esforçar, além dos benefícios normais: descarga elétrica como arma da rede — ou tempestade de AR (anúncios, neon, multidão, etc.) que causa confusão de AR.',
    },
    Warded: {
      label: 'Protegido',
      description:
        'Gaste a centelha para resistir consequência de AR ou para se esforçar ao lidar com forças de AR.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  infiltrator: {
    Ghost: {
      label: 'Fantasma',
      description:
        'Qualidade ou nível do alvo não afetam negativamente ao contornar medidas de segurança.',
    },
    Ambush: {
      label: 'Emboscada',
      description: 'Ao atacar de esconderijo ou acionar armadilha, +1d.',
    },
    Daredevil: {
      label: 'Temerário',
      description:
        'Em ação desesperada, +1d na rolagem se também aceitar −1d em resistências (ou esgotar 1 peculiaridade a mais em resistência veicular) contra consequências da ação.',
    },
    "The Devil's Footsteps": {
      label: 'Passos do Diabo',
      description:
        'Ao se esforçar, além dos benefícios normais: façanha atlética sobre-humana — ou confunda inimigos para atacarem uns aos outros.',
    },
    Expertise: {
      label: 'Especialização',
      description:
        'Escolha um nível de ação. Ao liderar ação em grupo com essa ação, sofre no máximo 1 de estresse ou esgota 1 peculiaridade, independente de falhas.',
    },
    'Never Tell Me The Odds': {
      label: 'Não Me Diga as Chances',
      description:
        'Em desvantagem numérica ou contra inimigo muito superior, +1d em resistências ou esgote 1 peculiaridade a menos em resistência veicular.',
    },
    Reflexes: {
      label: 'Reflexos',
      description:
        'Quando houver dúvida sobre quem age primeiro, a resposta é você (dois com Reflexos agem ao mesmo tempo).',
    },
    Shadow: {
      label: 'Sombra',
      description:
        'Gaste a centelha para resistir consequência de detecção ou segurança, ou para se esforçar em façanha atlética ou furtividade.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  officer: {
    'Tactical Genius': {
      label: 'Gênio Tático',
      description:
        'Duas vezes por missão pode assistir um companheiro sem pagar estresse. Conte como se preparou para isso.',
    },
    Leader: {
      label: 'Líder',
      description:
        'Ao Comandar uma coorte em combate, ela continua lutando quando quebraria (não cai com ferimento nível 3). Ao liderar ação em grupo, +efeito.',
    },
    Rally: {
      label: 'Incitar',
      description:
        'Gaste 2 de estresse para: direcionar multidão não aliada a uma ação — incitar violência — ou impedir dano. +1 de estresse por direção extra.',
    },
    'Functioning Vice': {
      label: 'Vício Funcional',
      description:
        'Ao descontrair, pode ajustar o resultado dos dados em 1 ou 2 (para cima ou baixo). O piloto que descontrai com você também cura 1 de estresse (sem causar exagero).',
    },
    'Heart to Heart': {
      label: 'Coração a Coração',
      description:
        'Quando deixa claro o peso de um acordo (rendição, cessar-fogo, troca de prisioneiros, etc.) e ambos aceitam, todos ficam emocionalmente investidos. Se alguém quebrar o acordo, o negociador recebe ferimento nível 3 “Desolado”.',
    },
    Warlord: {
      label: 'Senhor da Guerra',
      description:
        'Com vendeta contra outro esquadrão, seu esquadrão ganha +efeito contra esse esquadrão.',
    },
    Mastermind: {
      label: 'Mente Mestra',
      description:
        'Gaste a centelha para proteger um companheiro ou para se esforçar ao reunir informações ou em projeto de longo prazo.',
    },
    'Weaving the Web': {
      label: 'Tece a Teia',
      description:
        '+1d ao Conviver ao reunir informações sobre alvo de missão. +1d na rolagem de engajamento dessa operação.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  scout: {
    Sharpshooter: {
      label: 'Atirador de Elite',
      description:
        'Ao se esforçar, além dos benefícios normais: ataque à distância extrema — rajada supressiva — ou ricochete para acertar indiretamente.',
    },
    Focused: {
      label: 'Focado',
      description:
        'Gaste a centelha para resistir surpresa ou ferimento mental (medo, confusão, perder alguém de vista) ou para se esforçar em combate à distância ou rastreamento.',
    },
    Terminator: {
      label: 'Exterminador',
      description:
        'Seu robô caçador bem programado ganha upgrade: Besta de Carga (+1 carga, mais forte), Vínculo Mental (direcionado pela mente do piloto) ou Rápido e Silencioso. +efeito contra máquinas. Pode pegar de novo para outro upgrade.',
    },
    Ranger: {
      label: 'Patrulheiro',
      description:
        '+1 de efeito ao reunir informações para localizar alvo. +1d para evitar detecção em posição preparada ou com camuflagem.',
    },
    Survivor: {
      label: 'Sobrevivente',
      description:
        'Subsiste no que o ambiente oferece e funciona com o mínimo. Ganha +1 caixa de estresse.',
    },
    'Lay of the Land': {
      label: 'Conhecer o Terreno',
      description:
        'Quando outro piloto usa terreno que você explorou, +1d para resistir (ou gasta 1 peculiaridade a menos). Em flashback de preparação ao explorar, gaste 1 de estresse a menos que o normal.',
    },
    Determination: {
      label: 'Determinação',
      description:
        'Em falha numa ação arriscada ou controlada, pode transformar em sucesso parcial mudando a posição para desesperada. Isso não concede XP de ação desesperada.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  soldier: {
    Battleborn: {
      label: 'Nascido na Batalha',
      description:
        'Gaste a centelha para reduzir ferimento de ataque em combate ou para se esforçar durante uma luta.',
    },
    Bodyguard: {
      label: 'Guarda-Costas',
      description:
        'Ao proteger alguém, +1d na resistência (ou esgote 1 peculiaridade a menos no veículo). Ao reunir informações sobre ameaças na situação, +1 de efeito.',
    },
    'Robot Fighter': {
      label: 'Lutador de Robôs',
      description:
        'Conhece pontos fracos do inanimado. +efeito em combate contra máquinas.',
    },
    'Tough as Nails': {
      label: 'Duro como Unha',
      description:
        'Penalidades de ferimento são um nível menos severas (nível 4 ainda é fatal).',
    },
    Mule: {
      label: 'Mula',
      description: 'Limites de carga do piloto maiores. Leve: 5. Normal: 7. Pesado: 8.',
    },
    'Not to be Trifled With': {
      label: 'Não Se Mexa Comigo',
      description:
        'Ao se esforçar, além dos benefícios normais: façanha de força sobre-humana — ou enfrente um bando pequeno em pé de igualdade no corpo a corpo.',
    },
    Brutal: {
      label: 'Brutal',
      description:
        'Sua violência física é especialmente aterrorizante. Ao Comandar alvo amedrontado, +1d.',
    },
    Vigorous: {
      label: 'Vigoroso',
      description:
        'Recupera ferimentos mais rápido. Preencha permanentemente um segmento do relógio de cura. +1d em rolagens de tratamento.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
  technician: {
    Simulation: {
      label: 'Simulação',
      description:
        '+1d em rolagens de engajamento. Em 4–5 em rolagens de ação, você escolhe a consequência (o GM adapta à ficção).',
    },
    'Jury Rig': {
      label: 'Gambiarra',
      description:
        'Gaste 2 de estresse para reduzir o efeito (não o nível) de dano do veículo até o fim da missão. Com Médico, funciona em ferimento de piloto. Nível 4 ainda destrói o veículo ou mata o piloto no fim da missão.',
    },
    Researcher: {
      label: 'Pesquisador',
      description:
        'Ao inventar ou fabricar, +1 nível de resultado na rolagem. Começa com um design especial já conhecido.',
    },
    Fortitude: {
      label: 'Fortitude',
      description:
        'Gaste a centelha para resistir fadiga, fraqueza ou efeitos químicos, ou para se esforçar em trabalho técnico.',
    },
    'Road Master': {
      label: 'Mestre de Estradas',
      description:
        'Sabe Arrombar ou Aniquilar área com substâncias e métodos experimentais para torná-la intransitável ou terreno favorável a infantaria, veículos ou apps (à sua escolha).',
    },
    Doctor: {
      label: 'Médico',
      description:
        'Use Engenhar em ossos, sangue e órgãos para tratar feridas ou estabilizar moribundos. Pode estudar doença ou cadáver. Todo o esquadrão ganha +1d em rolagens de recuperação.',
    },
    Saboteur: {
      label: 'Sabotador',
      description:
        'Ao Arrombar, o trabalho é mais silencioso que o normal e o dano passa despercebido em inspeção casual. Com explosivos posicionados em vez de ferramentas, não fica mais quieto, mas +1d na ação.',
    },
    'Custom Implant': {
      label: 'Implante Personalizado',
      description:
        'Escolha químico ou aparelho que já pesquisou e sabe construir. Fica oculto no corpo com carga 0. Gaste 1 de estresse para usar. Trocar o implante é projeto de longo prazo de 4 seções.',
    },
    Veteran: {
      label: 'Veterano',
      description: 'Escolha uma habilidade especial de outra fonte. Pode ser escolhida até três vezes.',
    },
  },
};

export function getAbilityPt(playbookId: string, abilityName: string): AbilityPt | undefined {
  if (!playbookId || !abilityName) return undefined;
  const key = normalizeAbilityName(abilityName);
  return ABILITIES_PT[playbookId]?.[key];
}

export function getAbilityLabel(playbookId: string, abilityName: string): string {
  const veteranMatch = /^(?:Veteran|Veterano):\s*(.+)$/i.exec(abilityName.trim());
  if (veteranMatch) {
    const inner = getAbilityLabel(playbookId, veteranMatch[1]);
    return `Veterano: ${inner}`;
  }
  const key = normalizeAbilityName(abilityName);
  const direct = ABILITIES_PT[playbookId]?.[key];
  if (direct) return direct.label;
  for (const playbook of Object.values(ABILITIES_PT)) {
    if (playbook[key]) return playbook[key].label;
  }
  return abilityName;
}

export function getAbilityDescriptionPt(playbookId: string, abilityName: string): string | undefined {
  const veteranMatch = /^(?:Veteran|Veterano):\s*(.+)$/i.exec(abilityName.trim());
  if (veteranMatch) {
    return getAbilityDescriptionPt(playbookId, veteranMatch[1]);
  }
  const key = normalizeAbilityName(abilityName);
  const direct = ABILITIES_PT[playbookId]?.[key];
  if (direct) return direct.description;
  for (const playbook of Object.values(ABILITIES_PT)) {
    if (playbook[key]) return playbook[key].description;
  }
  return undefined;
}
