/** Extrai o capítulo de pilotos (criação + playbooks). */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(__dirname, 'extract-pages.mjs');

const ranges = [
  [12, 12, 'player-resources'],
  [38, 95, 'pilots-chapter'],
  [59, 95, 'playbooks'],
  [96, 150, 'technician-and-vehicles'],
];

for (const [start, end, label] of ranges) {
  console.log(`\n=== ${label} (pág. ${start}–${end}) ===`);
  const r = spawnSync(process.execPath, [script, String(start), String(end)], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
