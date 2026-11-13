import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
const logo=await sharp(await readFile('public/brand/cadrin-light.svg')).resize({width:850}).png().toBuffer();
const base=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#4a1725"/><path d="M70 450h1060" stroke="#e6b9ad"/><text x="70" y="520" fill="#f5f0e6" font-family="sans-serif" font-size="30">Une montre. Votre allure.</text><text x="70" y="570" fill="#e6b9ad" font-family="sans-serif" font-size="21">Sélections et guides horlogers · cadrin.fr</text></svg>`);
await sharp(base).composite([{input:logo,left:70,top:140}]).jpeg({quality:90}).toFile('public/images/og.jpg');
await writeFile('public/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#4a1725" d="M0 0h64v64H0z"/><path fill="#f5f0e6" d="M46 13H25L16 22v23l9 8h21v-9H28l-3-3V26l3-4h18z"/><path stroke="#e6b9ad" stroke-width="3" d="M41 59h14"/></svg>');
