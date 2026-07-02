/**
 * Extrai descrições de habilidades dos playbooks a partir do texto OCR.
 * Gera src/shared/data/beamSaberAbilities.generated.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sources = [
  path.join(__dirname, '../data/extracted/pages-59-95.txt'),
  path.join(__dirname, '../data/extracted/pages-96-150.txt'),
];

const PLAYBOOK_MAP = {
  ACE: 'ace',
  BUREAUCRAT: 'bureaucrat',
  EMPATH: 'empath',
  ENVOY: 'envoy',
  HACKER: 'hacker',
  INFILTRATOR: 'infiltrator',
  OFFICER: 'officer',
  SCOUT: 'scout',
  SOLDIER: 'soldier',
  TECHNICIAN: 'technician',
};

const text = sources.map((f) => fs.readFileSync(f, 'utf8')).join('\n');

const result = {};

for (const [key, id] of Object.entries(PLAYBOOK_MAP)) {
  const marker = `${key} ABILITIES`;
  const start = text.indexOf(marker);
  if (start < 0) continue;

  const chunk = text.slice(start, start + 12000);
  const endMarkers = [
    'EXAMPLE GATHER INFORMATION',
    'EXAMPLE STARTING',
    'SPECIALIST PILOT GEAR',
    '===== PÁGINA',
  ];
  let end = chunk.length;
  for (const em of endMarkers) {
    const i = chunk.indexOf(em, marker.length);
    if (i > 0) end = Math.min(end, i);
  }
  const section = chunk.slice(marker.length, end);

  const abilities = {};
  const lines = section.split('\n');
  let current = null;
  let buf = '';

  for (const line of lines) {
    const m = line.match(/^[\s\uf000-\uffff\u2022\-•]*([^:]+):\s*(.+)/u);
    if (m) {
      if (current) abilities[current] = buf.trim().replace(/\s+/g, ' ');
      current = m[1].trim();
      buf = m[2].trim();
    } else if (current && line.trim() && !line.startsWith('=====')) {
      buf += ' ' + line.trim();
    }
  }
  if (current) abilities[current] = buf.trim().replace(/\s+/g, ' ');

  result[id] = abilities;
}

const out = path.join(__dirname, '../src/shared/data/beamSaberAbilities.generated.json');
fs.writeFileSync(out, JSON.stringify(result, null, 2), 'utf8');
console.log('Gerado:', out);
for (const [id, abs] of Object.entries(result)) {
  console.log(`  ${id}: ${Object.keys(abs).length} habilidades`);
}
