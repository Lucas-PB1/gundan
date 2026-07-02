# Dados extraídos — Beam Saber RPG

Texto nativo do PDF `Beam-Saber.pdf` (331 páginas, ~601k caracteres). **Não precisa de OCR** — o livro tem camada de texto selecionável.

## Arquivos gerados

| Arquivo | Conteúdo |
|---------|----------|
| `keyword-index.json` | Índice de termos-chave (playbooks, ações, ficha) |
| `pages-38-95.txt` | Capítulo **The Pilots** — criação, ações, XP, conexões |
| `pages-59-95.txt` | **Pilot Playbooks** (Ace → Soldier) |
| `pages-96-150.txt` | Technician + **Vehicle Creation** |
| `pilot-creation-data.json` | Dados curados para a app (`npm run parse:pilot`) |

## Comandos

```bash
npm run extract:keywords          # índice de termos no PDF inteiro
npm run extract:pilots            # págs. 38–95 (criação + playbooks)
npm run extract:vehicles          # págs. 96–150 (veículos)
npm run extract:pages -- 12 12    # intervalo arbitrário
npm run parse:pilot               # valida dados TS contra OCR
```

## Mapeamento de páginas (v0.461)

| Seção | Páginas PDF |
|-------|-------------|
| Player Resources (links oficiais) | 12 |
| Pilot Creation | 39–44 |
| Pilot Actions | 42–43 |
| Connections / XP / Stress | 45–57 |
| Pilot Playbooks | 59–96 |
| Technician Playbook | 98–101 |
| Vehicle Creation | 111+ |

## Referência: `lotr-character-sheet`

O projeto irmão em `../lotr-character-sheet` usa o mesmo padrão:

- `scripts/docPaths.mjs` — caminhos dos PDFs locais
- `scripts/extract-pages.mjs` — texto nativo por página
- `scripts/extract-pdf-ocr.mjs` — OCR quando o PDF é escaneado
- `src/shared/data/*.ts` — dados curados (fonte da verdade da app)
- `data/extracted/*.txt` — texto bruto para validação

Beam Saber só precisa de extração nativa; LOTR precisou de Tesseract nas páginas escaneadas.
