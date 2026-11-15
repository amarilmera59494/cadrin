// Contrôle lent, lien par lien, des destinations Tempus des montres commandables.
// Usage : node scripts/probe-tempus-destinations.mjs            → rapport seul (evidence/tempus-probe.json)
//         node scripts/probe-tempus-destinations.mjs --apply    → met à jour src/data/paused-tempus-destinations.json :
//           ajoute les liens qui renvoient vers l'accueil, retire ceux redevenus valides (raison « redirect-to-home »).
// Un lien est valide s'il aboutit (redirections suivies) à une page produit du marché français, en 200.
import fs from 'node:fs';
const apply = process.argv.includes('--apply');
const delay = Number(process.env.PROBE_DELAY_MS || 900);
const catalogue = JSON.parse(fs.readFileSync('src/data/tempus-catalogue.json', 'utf8')).products;
const pausedFile = 'src/data/paused-tempus-destinations.json';
const paused = JSON.parse(fs.readFileSync(pausedFile, 'utf8'));
const targets = catalogue.filter(p => p.orderable && p.brand !== 'Longines');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Paris'}).format(new Date());
// Marché français forcé : la boutique ne montre pas les mêmes produits selon le pays. Le paramètre ?country=FR
// (vérifié le 15/11/2026 : ?country=US bascule bien vers /en-us/) impose le catalogue français, même depuis un serveur
// GitHub aux États-Unis. Les redirections sont suivies à la main, en gardant les cookies de pays posés par la boutique.
const headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', 'Accept': 'text/html', 'Accept-Language': 'fr-FR,fr;q=0.9'};
async function check(source) {
  let url = source + '?country=FR&bg_ref=bDlTL8AyKb', jar = '', status = 0;
  for (let hop = 0; hop < 6; hop++) {
    let r;
    for (let attempt = 0; attempt < 5; attempt++) {
      r = await fetch(url, {redirect: 'manual', headers: {...headers, ...(jar ? {Cookie: jar} : {})}, signal: AbortSignal.timeout(20000)});
      if (r.status !== 429) break;
      await r.body?.cancel(); await sleep(30000 * (attempt + 1));
    }
    status = r.status;
    const set = (r.headers.getSetCookie?.() || []).map(c => c.split(';')[0]);
    if (set.length) { const m = new Map(jar.split('; ').filter(Boolean).map(c => [c.split('=')[0], c])); for (const c of set) m.set(c.split('=')[0], c); jar = [...m.values()].join('; '); }
    const loc = r.headers.get('location'); await r.body?.cancel();
    if (!loc || status < 300 || status >= 400) break;
    url = new URL(loc, url).href;
  }
  const to = new URL(url).pathname;
  return {status, to, ok: status === 200 && /\/products\//.test(to) && !/^\/[a-z]{2}-[a-z]{2}\//.test(to)};
}
// Témoin : des liens suspendus (qui renvoient vers l'accueil en France) doivent rester morts. S'ils répondent tous
// normalement, ce contrôle ne voit pas le marché français : il s'arrête sans rien modifier.
const sentinels = paused.filter(v => v.reason === 'redirect-to-home').slice(0, 5);
let sentinelOk = 0;
for (const v of sentinels) { try { if ((await check(v.source)).ok) sentinelOk++; } catch {} await sleep(delay); }
if (sentinels.length && sentinelOk === sentinels.length) {
  console.log(`Marché français non visible depuis cette connexion (${sentinelOk}/${sentinels.length} liens témoins répondent normalement) : contrôle ignoré, rien n'est modifié.`);
  process.exit(0);
}
console.log(`Témoins : ${sentinels.length - sentinelOk}/${sentinels.length} liens suspendus bien morts, marché français visible.`);
const limit = Number(process.env.PROBE_LIMIT || 0);
const results = {};
let done = 0;
for (const p of limit ? targets.slice(0, limit) : targets) {
  try { results[p.source] = {reference: p.reference, brand: p.brand, ...(await check(p.source))}; } catch { await sleep(5000); }
  if (++done % 100 === 0) console.log(done, '/', targets.length);
  await sleep(delay);
}
const probed = Object.keys(results).length;
if (!limit && probed < targets.length * 0.95) throw Error(`Contrôle incomplet (${probed}/${targets.length}) : rien n'est modifié.`);
const dead = Object.entries(results).filter(([, x]) => !x.ok);
const revived = paused.filter(v => v.reason === 'redirect-to-home' && results[v.source]?.ok);
if (limit && apply) throw Error('PROBE_LIMIT sert aux essais : rien n’est appliqué.');
fs.mkdirSync('evidence', {recursive: true});
fs.writeFileSync('evidence/tempus-probe.json', JSON.stringify({checkedAt: today, probed, dead: dead.length, revived: revived.length, results}, null, 1));
const byBrand = {}; for (const [, x] of dead) byBrand[x.brand] = (byBrand[x.brand] || 0) + 1;
console.log(JSON.stringify({checkedAt: today, probed, dead: dead.length, revived: revived.length, byBrand}));
// Garde-fous : un écart massif d'un coup signale plutôt un problème de contrôle (marché, blocage) qu'un vrai changement.
const newlyDead = dead.filter(([source]) => !paused.some(v => v.source === source)).length;
const maxChange = Number(process.env.PROBE_MAX_CHANGE || 60);
if (apply && (newlyDead > maxChange || revived.length > maxChange)) {
  console.error(`Écart trop important (${newlyDead} nouveaux liens morts, ${revived.length} réactivés) : rien n'est appliqué. Vérifiez à la main, puis relancez avec PROBE_MAX_CHANGE si c'est confirmé.`);
  process.exit(3);
}
if (apply) {
  const known = new Set(paused.map(v => v.source)), revivedSet = new Set(revived.map(v => v.source));
  const next = paused.filter(v => !revivedSet.has(v.source));
  for (const [source, x] of dead) if (!known.has(source)) next.push({reference: x.reference, source, checkedAt: today, reason: 'redirect-to-home'});
  fs.writeFileSync(pausedFile, JSON.stringify(next, null, 2) + '\n');
  console.log(`Liste mise à jour : ${next.length} liens suspendus (${next.length - paused.length >= 0 ? '+' : ''}${next.length - paused.length}).`);
}
