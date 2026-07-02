# Beam Saber — Ficha de Piloto

Aplicação web para criar e gerenciar fichas de **Beam Saber RPG** (mecha / Gundam, baseado em *Blades in the Dark*).

Repositório sugerido: `beam-saber-ficha` ou `gundam`.

## O que já existe

| Parte | Status |
|-------|--------|
| Extração de texto do PDF | ✅ texto nativo (sem OCR) |
| Dados curados (10 playbooks, ações) | ✅ `src/shared/data/beamSaberPilotData.ts` |
| UI de ficha de piloto | ✅ React + Vite + Tailwind |
| Ficha de esquadrão / veículo completa | 🔜 próximo passo |

## Desenvolvimento

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## PDF local

Coloque o livro na raiz do projeto:

| Arquivo | Conteúdo |
|---------|----------|
| `Beam-Saber.pdf` | Livro de regras playtest v0.461 (~7 MB) |

O PDF **não é versionado** (`.gitignore`). Links oficiais das fichas em papel estão na pág. 12 do livro (Google Drive / planilhas fillable de fãs).

## Extrair dados do PDF

Mesmo padrão do projeto irmão [`lotr-character-sheet`](../lotr-character-sheet):

| Comando | Uso |
|---------|-----|
| `npm run probe:pdf` | Resumo rápido (páginas, primeiros caracteres) |
| `npm run extract:keywords` | Índice de termos-chave no PDF inteiro |
| `npm run extract:pilots` | Capítulo de pilotos + playbooks |
| `npm run extract:vehicles` | Technician + criação de veículo |
| `npm run extract:pages -- 20 30` | Intervalo arbitrário de páginas |
| `npm run parse:pilot` | Gera JSON + valida termos no texto extraído |

Saída em `data/extracted/`. Detalhes em [`data/extracted/README.md`](data/extracted/README.md).

### Diferença vs. Senhor dos Anéis

| | Beam Saber | LOTR (`lotr-character-sheet`) |
|---|------------|-------------------------------|
| PDF | Texto selecionável | Misto (OCR em páginas escaneadas) |
| Ferramenta | `pdf-parse` nativo | `pdf-parse` + **Tesseract.js** |
| Fonte da verdade | `src/shared/data/*.ts` | idem |
| Validação | `parse-pilot-data.mjs` | `parse-character-creation.mjs` |

Fluxo recomendado:

1. Rodar `npm run extract:pilots`
2. Ler `data/extracted/pages-38-95.txt`
3. Atualizar `src/shared/data/beamSaberPilotData.ts`
4. Rodar `npm run parse:pilot` para validar

## Estrutura

```
gundam/
├── Beam-Saber.pdf          # local, não versionado
├── scripts/
│   ├── docPaths.mjs        # caminhos do PDF
│   ├── extract-pages.mjs   # texto por página
│   ├── extract-keywords.mjs
│   └── parse-pilot-data.mjs
├── data/extracted/         # texto bruto + JSON gerado
└── src/
    ├── shared/data/        # playbooks, ações, exemplos
    └── domain/entities/    # modelo da ficha + localStorage
```

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · localStorage

## Aviso legal

Ferramenta de fãs para o playtest de **Beam Saber** (Austin Ramsay). Baseado em *Blades in the Dark*. Não publique o PDF no repositório.
