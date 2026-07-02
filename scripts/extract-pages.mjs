/**
 * Extrai texto nativo do PDF Beam Saber por intervalo de páginas.
 * Uso: node scripts/extract-pages.mjs [inicio] [fim]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';
import { RULEBOOK_PATH, RULEBOOK_REL } from './docPaths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'data', 'extracted');

const startPage = Number(process.argv[2] ?? 38);
const endPage = Number(process.argv[3] ?? 120);

if (!fs.existsSync(RULEBOOK_PATH)) {
  console.error('PDF não encontrado:', RULEBOOK_PATH);
  process.exit(1);
}

const buf = fs.readFileSync(RULEBOOK_PATH);
const parser = new PDFParse({ data: buf });
const info = await parser.getInfo();

const partial = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
const native = await parser.getText({ partial });
await parser.destroy();

const pages = native.pages.map((p) => ({
  page: p.num,
  chars: p.text?.trim().length ?? 0,
  text: p.text?.trim() ?? '',
}));

fs.mkdirSync(OUT_DIR, { recursive: true });

const slug = `pages-${startPage}-${endPage}`;
const combined = pages.map((p) => `\n\n===== PÁGINA ${p.page} =====\n\n${p.text}`).join('\n');

fs.writeFileSync(path.join(OUT_DIR, `${slug}.txt`), combined, 'utf8');
fs.writeFileSync(
  path.join(OUT_DIR, `${slug}.json`),
  JSON.stringify({ pdfPath: RULEBOOK_REL, startPage, endPage, totalPages: info.total, pages }, null, 2),
  'utf8',
);

console.log(`Extraído pág. ${startPage}–${endPage} (${pages.reduce((s, p) => s + p.chars, 0)} chars)`);
console.log(`→ data/extracted/${slug}.txt`);
