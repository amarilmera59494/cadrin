// Contrôle lent, lien par lien, des destinations Tempus des montres commandables.
// Usage : node scripts/probe-tempus-destinations.mjs            → rapport seul (evidence/tempus-probe.json)
//         node scripts/probe-tempus-destinations.mjs --apply    → met à jour src/data/paused-tempus-destinations.json :
//           ajoute les liens qui renvoient vers l'accueil, retire ceux redevenus valides (raison « redirect-to-home »).
// Un lien est valide s'il répond 200, ou redirige vers une autre page produit.
import fs from 'node:fs';
const apply = process.argv.includes('--apply');
const delay = Number(process.env.PROBE_DELAY_MS || 900);
const catalogue = JSON.parse(fs.readFileSync('src/data/tempus-catalogue.json', 'utf8')).products;
const pausedFile = 'src/data/paused-tempus-destinations.json';
const paused = JSON.parse(fs.readFileSync(pausedFile, 'utf8'));
const targets = catalogue.filter(p => p.orderable && p.brand !== 'Longines');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Paris'}).format(new Date());
// Témoin de marché : la boutique ne montre pas les mêmes produits selon le pays du visiteur. Si des liens suspendus
// (qui renvoient vers l'accueil depuis la France) répondent normalement ici, ce contrôle ne voit pas le marché français
// (par exemple depuis un serveur GitHub aux États-Unis) : il s'arrête sans rien modifier.
const sentinels = paused.filter(v => v.reason === 'redirect-to-home').slice(0, 5);
let sentinelOk = 0;
for (const v of sentinels) {
  try { const r = await fetch(v.source + '?bg_ref=bDlTL8AyKb', {redirect: 'manual', headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36', 'Accept-Language': 'fr-FR,fr;q=0.9', 'Cookie': 'localization=FR; cart_currency=EUR'}, signal: AbortSignal.timeout(20000)}); await r.body?.cancel(); if (r.status === 200) sentinelOk++; } catch {}
  await sleep(delay);
}
if (sentinels.length && sentinelOk === sentinels.length) {
  console.log(`Marché français non visible depuis cette connexion (${sentinelOk}/${sentinels.length} liens témoins répondent normalement) : contrôle ignoré, rien n'est modifié. Lancez-le depuis une connexion française : npm run links:probe.`);
  process.exit(0);
}
const results = {};
let done = 0;
for (const p of targets) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const r = await fetch(p.source + '?bg_ref=bDlTL8AyKb', {redirect: 'manual', headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36', 'Accept-Language': 'fr-FR,fr;q=0.9', 'Cookie': 'localization=FR; cart_currency=EUR'}, signal: AbortSignal.timeout(20000)});
      const loc = r.headers.get('location'); await r.body?.cancel();
      if (r.status === 429) { await sleep(30000); continue; }
      const to = loc ? new URL(loc, p.source).pathname : '';
      results[p.source] = {reference: p.reference, brand: p.brand, status: r.status, to, ok: r.status === 200 || (r.status >= 300 && r.status < 400 && /\/products\//.test(to))};
      break;
    } catch { await sleep(5000); }
  }
  if (++done % 100 === 0) console.log(done, '/', targets.length);
  await sleep(delay);
}
const probed = Object.keys(results).length;
if (probed < targets.length * 0.95) throw Error(`Contrôle incomplet (${probed}/${targets.length}) : rien n'est modifié.`);
const dead = Object.entries(results).filter(([, x]) => !x.ok);
const revived = paused.filter(v => v.reason === 'redirect-to-home' && results[v.source]?.ok);
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
