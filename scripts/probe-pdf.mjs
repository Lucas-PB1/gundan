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

console.log('Total pages:', info.total);
console.log('Text length:', result.text.length);
console.log('\n--- First 6000 chars ---\n');
console.log(result.text.slice(0, 6000));
