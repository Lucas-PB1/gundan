/**
 * Valida beamSaberPilotData.ts contra o texto extraído do PDF.
 * Gera pilot-creation-data.json para referência.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../data/extracted/pilot-creation-data.json');
const OCR_PATH = path.join(__dirname, '../data/extracted/pages-38-95.txt');

const dataModule = await import(
  pathToFileURL(path.join(__dirname, '../src/shared/data/beamSaberPilotData.ts')).href
);

const {
  PILOT_PLAYBOOKS,
  PILOT_ACTIONS,
  VEHICLE_ACTIONS,
  EXAMPLE_HISTORIES,
  EXAMPLE_TRAGEDIES,
  EXAMPLE_OPENINGS,
  CREATION_STEPS,
} = dataModule;

const payload = {
  source: 'Beam Saber RPG v0.461 — Cap. The Pilots (validado com extração pág. 38–95)',
  extractedAt: new Date().toISOString(),
  creationSteps: CREATION_STEPS,
  pilotActions: PILOT_ACTIONS,
  vehicleActions: VEHICLE_ACTIONS,
  histories: EXAMPLE_HISTORIES,
  tragedies: EXAMPLE_TRAGEDIES,
  openings: EXAMPLE_OPENINGS,
  playbooks: PILOT_PLAYBOOKS,
};

fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf8');

let ocrValidation = { found: [], missing: [] };
if (fs.existsSync(OCR_PATH)) {
  const ocr = fs.readFileSync(OCR_PATH, 'utf8').toLowerCase();
  const terms = [
    'pilot creation',
    'choose a playbook',
    'insight actions',
    'prowess actions',
    'resolve actions',
    'the ace',
    'the bureaucrat',
    'the empath',
    'the envoy',
    'the hacker',
    'the infiltrator',
    'the officer',
    'the scout',
    'the soldier',
    'the technician',
    'connection clock',
    'playbook xp',
    'vehicle creation',
  ];
  for (const t of terms) {
    (ocr.includes(t) ? ocrValidation.found : ocrValidation.missing).push(t);
  }
  fs.writeFileSync(
    path.join(__dirname, '../data/extracted/ocr-validation.json'),
    JSON.stringify(ocrValidation, null, 2),
    'utf8',
  );
}

console.log('Gerado:', OUT);
console.log('Playbooks:', PILOT_PLAYBOOKS.length);
console.log('OCR — encontrados:', ocrValidation.found.length, '| ausentes:', ocrValidation.missing.length);
