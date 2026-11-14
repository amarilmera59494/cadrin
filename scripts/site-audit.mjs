// Audit statique du site construit (dist-production) : liens internes, balises SEO, images, affiliation.
// Usage : SITE_STAGE=production npm run build && node scripts/site-audit.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';
const dir = 'dist-production';
const files = []; (function walk(d) { for (const f of fs.readdirSync(d, {withFileTypes: true})) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (f.name.endsWith('.html')) files.push(p); } })(dir);
const route = f => '/' + path.relative(dir, f).split(path.sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
const exists = href => { const p = decodeURI(href.split('#')[0].split('?')[0]); if (!p || p === '/') return fs.existsSync(path.join(dir, 'index.html'));
  const t = path.join(dir, p); return fs.existsSync(t) && fs.statSync(t).isFile() || fs.existsSync(path.join(t, 'index.html')); };
const issues = {}, add = (k, v) => (issues[k] ||= []).push(v);
const titles = new Map(), descs = new Map();
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').trim();
for (const f of files) {
  const r = route(f), h = fs.readFileSync(f, 'utf8');
  if (r.startsWith('/404')) continue;
  const title = strip(h.match(/<title>([\s\S]*?)<\/title>/)?.[1] || ''), desc = h.match(/<meta name="description" content="([^"]*)"/)?.[1] || '';
  // Les pages non indexées (/partage/, aperçus Facebook) ne sont pas soumises aux longueurs des résultats de recherche.
  const noindex = /<meta name="robots" content="noindex/.test(h);
  if (!title) add('titre manquant', r); else { if (title.length > 70 && !noindex) add('titre > 70 car.', `${r} (${title.length})`); if (!noindex) (titles.get(title) || titles.set(title, []).get(title)).push(r); }
  if (!desc) add('description manquante', r); else { if (desc.length > 170 && !noindex) add('description > 170 car.', `${r} (${desc.length})`); if (desc.length < 70) add('description < 70 car.', `${r} (${desc.length})`); (descs.get(desc) || descs.set(desc, []).get(desc)).push(r); }
  const h1 = (h.match(/<h1\b/g) || []).length; if (h1 !== 1) add('nombre de H1 ≠ 1', `${r} (${h1})`);
  if (!/<link rel="canonical"/.test(h)) add('canonical manquante', r);
  if (noindex && !r.startsWith('/partage/')) add('noindex en production', r);
  for (const m of h.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith('/') && !href.startsWith('//') && !exists(href)) add('lien interne cassé', `${r} → ${href}`);
    if (/tempusshop\.com/.test(href) && (!href.includes('bg_ref=bDlTL8AyKb') || !/rel="[^"]*sponsored/.test(m[0]))) add('lien Tempus non affilié', `${r} → ${href.slice(0, 80)}`);
  }
  for (const m of h.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) add('image sans alt', `${r} ${m[0].slice(0, 80)}`);
    if (!/\bwidth="/.test(m[0]) || !/\bheight="/.test(m[0])) add('image sans dimensions', `${r} ${m[0].match(/src="([^"]+)"/)?.[1]}`);
    const src = m[0].match(/src="([^"]+)"/)?.[1]; if (src?.startsWith('/') && !exists(src)) add('image introuvable', `${r} → ${src}`);
  }
  if (/tempusshop\.com/.test(h) && !/commission|rémunérer|affili|Affiliate|commission/i.test(strip(h))) add('liens Tempus sans mention d’affiliation', r);
}
for (const [t, rs] of titles) if (rs.length > 1) add('titre en double', `${t} : ${rs.slice(0, 4).join(', ')}${rs.length > 4 ? ` (+${rs.length - 4})` : ''}`);
for (const [d, rs] of descs) if (rs.length > 1) add('description en double', `${d.slice(0, 60)}… : ${rs.slice(0, 3).join(', ')}${rs.length > 3 ? ` (+${rs.length - 3})` : ''}`);
const summary = Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, v.length]));
if (process.argv.includes('--json')) console.log(JSON.stringify(issues, null, 2));
else { console.log(JSON.stringify({pages: files.length, ...summary}, null, 1)); for (const [k, v] of Object.entries(issues)) console.log('\n## ' + k + '\n' + v.slice(0, 8).join('\n')); }
