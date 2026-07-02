import type { LoadMode } from './beamSaberGearData';
import { loadModeLabel } from '../i18n/pt';

export const LOADOUT_RULES_SUMMARY = `Antes da missão, marque o que você leva. Cada item tem um valor de carga — a soma não pode passar o limite do modo escolhido (leve/normal/pesado). Itens não marcados não existem na ficção até você declará-los. Equipamento de veículo conta na mesma carga do piloto nesta ficha.`;

export const LOAD_MODE_HELP: Record<LoadMode, string> = {
  light:
    'Leve (máx. 3): pouca bagagem — ideal para infiltração, reconhecimento ou passar despercebido. Menos armas e ferramentas à mão.',
  normal:
    'Normal (máx. 5): equipamento típico de missão — armas, utilitários e algum equipamento especialista.',
  heavy:
    'Pesado (máx. 6): carga máxima — combate direto, demolição ou quando você precisa de tudo. Mais lento e visível na ficção.',
};

export const LOADOUT_FIELD_HELP = {
  loadMode: 'Escolha antes da missão. Afeta o limite de carga e como o esquadrão se apresenta (discrição vs. prontidão).',
  customGear:
    'Itens inventados no tempo livre, subornos extras ou aparelhos únicos. Combine com o GM a carga de cada um.',
  specialistPilot:
    'Itens do seu arquétipo — só disponíveis se você escolheu esse arquétipo. “Excelente” = qualidade superior do livro.',
  standard:
    'Lista geral de armas, ferramentas e utilitários que qualquer piloto pode declarar.',
  specialistVehicle:
    'Equipamento montado no mecha/veículo. Conta na carga total declarada para a missão.',
  missionLoadout: 'Marque os itens que você leva nesta missão. O contador mostra carga usada vs. limite.',
} as const;

export function loadModeOptionHelp(mode: LoadMode): string {
  return `${loadModeLabel(mode)} — ${LOAD_MODE_HELP[mode]}`;
}
