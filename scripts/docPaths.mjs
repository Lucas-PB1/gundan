/**
 * PDFs locais — Beam Saber RPG (playtest v0.461).
 * O livro fica na raiz do projeto por enquanto; mova para doc/ se preferir.
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

export const DOC_DIR = path.join(ROOT, 'doc');

/** Livro de regras completo */
export const PDF_RULEBOOK = 'Beam-Saber.pdf';
export const RULEBOOK_PATH = path.join(ROOT, PDF_RULEBOOK);
export const RULEBOOK_REL = PDF_RULEBOOK;

/** Quick Start (quando disponível) */
export const PDF_QUICKSTART = 'Beam-Saber-Quick-Start.pdf';
export const QUICKSTART_PATH = path.join(DOC_DIR, PDF_QUICKSTART);
