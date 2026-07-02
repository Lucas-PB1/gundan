/** Regras de ferimento (piloto) e dano (veículo) — Beam Saber p. 48 / 114 */

export const PILOT_HARM_LEVELS = [
  { level: 1, label: 'Nível 1 — menos efeito', placeholder: 'Ex.: Contusões, sangue' },
  { level: 2, label: 'Nível 2 — −1d', placeholder: 'Ex.: Fratura, sangramento forte' },
  { level: 3, label: 'Nível 3 — fora de ação', placeholder: 'Ex.: Inconsciente, não consegue agir' },
] as const;

export const VEHICLE_DAMAGE_LEVELS = [
  { level: 1, label: 'Nível 1 — reduz efeito', placeholder: 'Ex.: Hidráulica vazando' },
  { level: 2, label: 'Nível 2 — −1d', placeholder: 'Ex.: Canhão emperrado, sensores queimados' },
  {
    level: 3,
    label: 'Nível 3 — só com peculiaridade',
    placeholder: 'Ex.: Reator crítico, pernas destroçadas',
  },
] as const;

export const HARM_HELP =
  'Nível 1 reduz o efeito das ações. Nível 2 aplica −1d. Nível 3 deixa o piloto fora de ação (pode se esforçar para agir). Nível 4 = morto.';

export const VEHICLE_DAMAGE_HELP =
  'Nível 1 reduz o efeito das ações do veículo. Nível 2 aplica −1d. Nível 3: o mecha só age esgotando uma peculiaridade. Nível 4 = destruído (piloto sofre ferimento 3).';
