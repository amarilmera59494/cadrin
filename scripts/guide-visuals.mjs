// Visuels des guides : packshot éditorial — vraie photo de montre détourée (non retouchée) sur fond studio uni
// aux couleurs Cadrin, ombre de contact, et un titre court. 1200×675. Écrit public/images/guides/<guide>.webp
// Usage : node scripts/guide-visuals.mjs
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
import sharp from 'sharp';
const visuals = JSON.parse(fs.readFileSync('src/data/guide-visuals.json', 'utf8'));
const assets = path.resolve('marketing/tiktok-noel-carrousels-01/assets');
const words = {
  'acheter-montre-en-ligne': ['Acheter', 'en ligne'], 'automatique-quartz-solaire': ['Quartz,', 'auto, solaire'], 'bambino-tsuyosa-seiko-5': ['Trois', 'automatiques'],
  'choisir-couleur-cadran': ['La couleur', 'du cadran'], 'choisir-premiere-montre': ['La première', 'montre'], 'choisir-taille-montre': ['La bonne', 'taille'],
  'citizen-eco-drive-ou-tsuyosa': ['Solaire', 'ou auto'], 'etancheite-montre-3-5-10-20-atm': ['3, 5, 10', 'ou 20 bar'], 'g-shock-montre-jeune': ['G-Shock', ''],
  'lire-fiche-technique-montre': ['Lire', 'la fiche'], 'montre-automatique-reserve-de-marche': ['Réserve', 'de marche'], 'montre-connectee-gps-bluetooth': ['Montre', 'connectée'],
  'montre-de-plongee-iso-6425': ['Montre', 'de plongée'], 'montres-par-budget': ['Selon', 'le budget'], 'offrir-une-montre': ['Offrir', 'une montre'],
  'premiere-montre-haut-de-gamme': ['Monter', 'en gamme'], 'squelette-coeur-ouvert-tourbillon': ['Cœur', 'ouvert'], 'verre-saphir-mineral-acrylique': ['Saphir', 'ou minéral'],
};
// Trois fonds studio, en alternance : sable, bordeaux, ivoire.
const looks = [
  {bg: 'radial-gradient(120% 120% at 70% 45%, #f4ede2 0%, #e6dccd 55%, #d9cdbb 100%)', ink: '#4a1725', kicker: '#792a40', shadow: 'rgba(74,23,37,.28)'},
  {bg: 'radial-gradient(120% 120% at 70% 45%, #6a2236 0%, #4a1725 55%, #33101b 100%)', ink: '#f5f0e6', kicker: '#e6c88f', shadow: 'rgba(0,0,0,.45)'},
  {bg: 'radial-gradient(120% 120% at 70% 45%, #fbf8f2 0%, #efe8dc 60%, #e3d9c9 100%)', ink: '#36131e', kicker: '#792a40', shadow: 'rgba(54,19,30,.24)'},
];
const out = 'public/images/guides'; fs.mkdirSync(out, {recursive: true});
for (const f of fs.readdirSync(out)) fs.unlinkSync(path.join(out, f));
const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width: 1200, height: 675}, deviceScaleFactor: 1});
let i = 0;
for (const [id, ref] of Object.entries(visuals)) {
  const cut = path.join(assets, 'products', ref + '.png');
  if (!fs.existsSync(cut) || !words[id]) { console.log('manquant', id); continue; }
  const L = looks[i++ % looks.length], [w1, w2] = words[id];
  const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><style>
@font-face{font-family:Barlow;src:url('${pathToFileURL(path.join(assets, 'barlow.woff2'))}');font-weight:600}
@font-face{font-family:DM;src:url('${pathToFileURL(path.join(assets, 'dm.woff2'))}');font-weight:100 1000}
*{margin:0;box-sizing:border-box}body{width:1200px;height:675px;overflow:hidden;background:${L.bg};font-family:DM;position:relative}
.t{position:absolute;left:84px;top:50%;transform:translateY(-50%);color:${L.ink}}
.k{font:700 18px/1 DM;letter-spacing:5px;text-transform:uppercase;color:${L.kicker};margin-bottom:22px}
h1{font:600 104px/.9 Barlow;text-transform:uppercase;letter-spacing:-1px;max-width:560px}
.rule{width:96px;height:6px;background:${L.kicker};margin-top:30px}
.w{position:absolute;right:120px;top:50%;transform:translateY(-52%);height:560px;max-width:430px;object-fit:contain;filter:drop-shadow(0 26px 22px ${L.shadow}) drop-shadow(0 6px 6px ${L.shadow})}
.floor{position:absolute;right:150px;bottom:44px;width:370px;height:34px;border-radius:50%;background:radial-gradient(closest-side, ${L.shadow}, transparent);filter:blur(6px)}
</style><body><div class="t"><div class="k">Le guide Cadrin</div><h1>${w1}${w2 ? '<br>' + w2 : ''}</h1><div class="rule"></div></div><div class="floor"></div><img class="w" src="${pathToFileURL(cut)}"></body></html>`;
  const file = path.resolve('.tmp', 'gv-' + id + '.html'); fs.writeFileSync(file, html);
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(im => im.decode())); });
  await sharp(await page.screenshot()).webp({quality: 84}).toFile(path.join(out, id + '.webp'));
  console.log('ok', id);
}
await browser.close();
