// Visuels des guides : vraie photo de montre détourée (non retouchée) posée sur un décor d'ambiance, 1200×675.
// Usage : node scripts/guide-visuals.mjs <dossier des décors> ; écrit public/images/guides/<guide>.webp
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const bgDir = process.argv[2]; if (!bgDir) throw Error('Indiquez le dossier des décors.');
const visuals = JSON.parse(fs.readFileSync('src/data/guide-visuals.json', 'utf8'));
const cutouts = 'marketing/tiktok-noel-carrousels-01/assets/products';
const theme = {
  'etancheite-montre-3-5-10-20-atm': 'water', 'montre-de-plongee-iso-6425': 'water',
  'montre-automatique-reserve-de-marche': 'workshop', 'premiere-montre-haut-de-gamme': 'workshop', 'squelette-coeur-ouvert-tourbillon': 'workshop', 'lire-fiche-technique-montre': 'workshop',
  'choisir-couleur-cadran': 'linen', 'verre-saphir-mineral-acrylique': 'linen', 'choisir-taille-montre': 'linen', 'choisir-premiere-montre': 'linen', 'acheter-montre-en-ligne': 'linen',
  'offrir-une-montre': 'gift', 'montres-par-budget': 'gift',
  'g-shock-montre-jeune': 'urban', 'montre-connectee-gps-bluetooth': 'urban',
  'bambino-tsuyosa-seiko-5': 'leather', 'citizen-eco-drive-ou-tsuyosa': 'leather', 'automatique-quartz-solaire': 'leather',
};
const W = 1200, H = 675, out = 'public/images/guides'; fs.mkdirSync(out, {recursive: true});
for (const [id, ref] of Object.entries(visuals)) {
  const t = theme[id]; if (!t) { console.log('sans thème', id); continue; }
  const bg = path.join(bgDir, t + '.png'), cut = path.join(cutouts, ref + '.png');
  if (!fs.existsSync(bg) || !fs.existsSync(cut)) { console.log('manquant', id, fs.existsSync(bg), fs.existsSync(cut)); continue; }
  const base = await sharp(bg).resize(W, H, {fit: 'cover'}).modulate({brightness: 0.96}).toBuffer();
  const watch = await sharp(cut).resize({height: Math.round(H * 0.8), width: Math.round(W * 0.42), fit: 'inside'}).toBuffer();
  const m = await sharp(watch).metadata();
  // Ombre : silhouette de la montre assombrie, floutée et décalée vers le bas.
  const alpha = await sharp(watch).extractChannel('alpha').toBuffer();
  const shadow = await sharp({create: {width: m.width, height: m.height, channels: 3, background: {r: 20, g: 10, b: 12}}}).joinChannel(await sharp(alpha).linear(0.45, 0).toBuffer()).png().toBuffer();
  const pad = 40, blurred = await sharp(shadow).extend({top: pad, bottom: pad, left: pad, right: pad, background: {r: 0, g: 0, b: 0, alpha: 0}}).blur(18).toBuffer();
  const left = Math.round((W - m.width) / 2), top = Math.round((H - m.height) / 2) + 6;
  await sharp(base).composite([{input: blurred, left: left - pad + 10, top: top - pad + 22}, {input: watch, left, top}]).webp({quality: 82}).toFile(path.join(out, id + '.webp'));
  console.log('ok', id, '←', t, ref);
}
