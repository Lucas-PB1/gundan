import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfPath = path.join(__dirname, '..', 'Beam-Saber.pdf');

const buf = fs.readFileSync(pdfPath);
const parser = new PDFParse({ data: buf });
const info = await parser.getInfo();
const result = await parser.getText();
await parser.destroy();

const text = result.text;

const keywords = [
  'PILOT CREATION',
  'Pilot Playbook',
  'PLAYBOOK',
  'character sheet',
  'Character Sheet',
  'VEHICLE CREATION',
  'SQUAD CREATION',
  'Series Playbook',
  'TRAITS',
  'ABILITIES',
  'ACTIONS',
  'STRESS',
  'TRAUMA',
  'HARM',
  'Loadout',
  'LOADOUT',
  'FRAME',
  'MECHA',
  'PILOT',
];

const out = [];
for (const k of keywords) {
  let idx = 0;
  while ((idx = text.indexOf(k, idx)) !== -1) {
  const lineStart = text.lastIndexOf('\n', idx) + 1;
  const lineEnd = text.indexOf('\n', idx);
  const line = text.slice(lineStart, lineEnd > 0 ? lineEnd : idx + 80);
  out.push({ keyword: k, index: idx, line: line.trim().slice(0, 120) });
  idx += k.length;
  }
}

const outPath = path.join(__dirname, '..', 'data', 'extracted', 'keyword-index.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ totalPages: info.total, textLength: text.length, matches: out }, null, 2));

console.log(`Pages: ${info.total}, chars: ${text.length}`);
console.log(`Keywords found: ${out.length} → ${outPath}`);
for (const k of [...new Set(out.map((m) => m.keyword))]) {
  console.log(`  ${k}: ${out.filter((m) => m.keyword === k).length}`);
}
