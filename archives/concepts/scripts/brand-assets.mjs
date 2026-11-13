import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
import {site} from '../src/data/site.ts';
const safe=site.name.replaceAll('&','&amp;').replaceAll('<','&lt;');
await sharp(Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="#f7f6f2"/><text x="70" y="120" font-size="26" font-family="sans-serif" fill="#aa3022">TROIS REGARDS SUR L’HORLOGERIE</text><text x="65" y="330" font-size="140" font-family="serif" fill="#252522">${safe}</text><path d="M70 400h1060" stroke="#252522"/><text x="70" y="480" font-size="32" font-family="sans-serif" fill="#252522">REVUE / MESURE / ALLURE</text><text x="70" y="555" font-size="20" font-family="sans-serif" fill="#555">Étude de design · Maquettes non publiées</text></svg>`)).jpeg({quality:90}).toFile('public/images/og.jpg');
await writeFile('public/favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f7f6f2"/><text x="10" y="48" font-family="serif" font-size="46" fill="#252522">${safe[0]}</text><circle cx="53" cy="49" r="4" fill="#aa3022"/></svg>`);
