// Historique des prix relevés par Cadrin : une ligne par variation, par montre.
// Usage : node scripts/price-history.mjs   (après catalogue:apply ; idempotent pour une même date)
// Format : {since, updatedAt, items: {id: [[date, prix, commandable], ...]}}. Un relevé du même jour remplace le précédent.
import fs from 'node:fs/promises';
const file = 'src/data/price-history.json', catalogue = JSON.parse(await fs.readFile('src/data/tempus-catalogue.json', 'utf8'));
const date = process.env.PRICE_DATE || catalogue.offersCheckedAt || catalogue.checkedAt;
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw Error('Date de relevé invalide : ' + date);
let history; try { history = JSON.parse(await fs.readFile(file, 'utf8')); } catch { history = {since: date, updatedAt: date, items: {}}; }
if (history.updatedAt > date) throw Error(`Relevé du ${date} plus ancien que l’historique (${history.updatedAt}).`);
let added = 0, replaced = 0;
for (const p of catalogue.products) {
  const rows = history.items[p.id] ||= [], last = rows.at(-1), entry = [date, p.price, p.orderable ? 1 : 0];
  if (last && last[0] === date) { if (last[1] !== p.price || last[2] !== entry[2]) { rows[rows.length - 1] = entry; replaced++; } continue; }
  if (!last || last[1] !== p.price || last[2] !== entry[2]) { rows.push(entry); added++; }
}
// Une montre retirée du catalogue garde son historique, sans nouvelle ligne.
history.updatedAt = date;
await fs.writeFile(file, JSON.stringify(history));
console.log(JSON.stringify({date, products: catalogue.products.length, added, replaced, tracked: Object.keys(history.items).length}));
