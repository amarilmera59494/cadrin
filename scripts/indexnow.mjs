// IndexNow : signale à Bing (et aux moteurs partenaires) les pages publiées ou modifiées.
// Usage : node scripts/indexnow.mjs            → toutes les URL du sitemap en ligne
//         node scripts/indexnow.mjs /a/ /b/    → seulement ces chemins
// La clé est publiée à la racine du site (public/<clé>.txt), ce qui prouve que la demande vient du propriétaire.
import {readdir} from 'node:fs/promises';

const host = 'cadrin.fr';
const key = (await readdir('public')).map(f => f.match(/^([0-9a-f]{32})\.txt$/)?.[1]).find(Boolean);
if (!key) throw new Error('Clé IndexNow absente de public/.');
const live = await fetch(`https://${host}/${key}.txt`);
if (!live.ok || (await live.text()).trim() !== key) throw new Error('La clé IndexNow n’est pas encore en ligne : déployez avant de soumettre.');

let urls = process.argv.slice(2).map(p => new URL(p, `https://${host}`).href);
if (!urls.length) {
  const sitemap = await (await fetch(`https://${host}/sitemap.xml`)).text();
  urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}
for (let i = 0; i < urls.length; i += 10000) {
  const urlList = urls.slice(i, i + 10000);
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    body: JSON.stringify({host, key, keyLocation: `https://${host}/${key}.txt`, urlList}),
  });
  console.log(`IndexNow : ${urlList.length} URL envoyées, réponse ${r.status} ${r.statusText}`);
  if (r.status >= 400) { console.log(await r.text()); process.exitCode = 1; }
}
