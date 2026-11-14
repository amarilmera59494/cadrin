// Relevé Black Friday : lit le catalogue public Tempus (products.json) et met à jour src/data/black-friday.json
// pour la sélection Cadrin. Usage : node scripts/black-friday-refresh.mjs
// - « was » = prix barré affiché par Tempus (compare_at_price) ; non vérifié par Cadrin.
// - « firstSeen » = premier prix relevé par Cadrin pour cette montre ; sert à prouver une vraie baisse.
import {readFile, writeFile} from 'node:fs/promises';

const FILE = 'src/data/black-friday.json';
const current = JSON.parse(await readFile(FILE, 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const byHandle = new Map();
for (let page = 1; page <= 20; page++) {
  const res = await fetch(`https://tempusshop.com/collections/all/products.json?limit=250&page=${page}`, {headers: {'User-Agent': 'Mozilla/5.0 (Cadrin price check)'}});
  if (!res.ok) throw Error(`Tempus a répondu ${res.status} à la page ${page}`);
  const {products} = await res.json();
  if (!products?.length) break;
  for (const p of products) byHandle.set(p.handle, p);
  await new Promise(r => setTimeout(r, 1500));
}
if (byHandle.size < 500) throw Error(`Catalogue incomplet (${byHandle.size} produits) : relevé annulé`);

const items = current.items.map(item => {
  const p = byHandle.get(item.handle);
  if (!p) return {...item, available: false};
  const v = p.variants.find(x => x.available) || p.variants[0];
  const price = Number(v.price), was = v.compare_at_price && Number(v.compare_at_price) > price ? Number(v.compare_at_price) : null;
  const history = [...(item.history || [])];
  if (!history.length || history.at(-1).price !== price) history.push({date: today, price});
  return {...item, price, was, available: Boolean(v.available), history};
});
await writeFile(FILE, JSON.stringify({...current, checkedAt: today, items}, null, 1) + '\n');
console.log(JSON.stringify({checkedAt: today, items: items.length, available: items.filter(i => i.available).length, drops: items.filter(i => i.history.length > 1 && i.price < i.history[0].price).length}));
