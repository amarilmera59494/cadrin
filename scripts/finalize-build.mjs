import {writeFile,readFile,readdir,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
const production=process.env.SITE_STAGE==='production';const dir=production?'dist-production':'dist';
const security='  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n';
async function walk(path){const files=await readdir(path,{withFileTypes:true});return (await Promise.all(files.map(f=>f.isDirectory()?walk(`${path}/${f.name}`):`${path}/${f.name}`))).flat()}
const files=await walk(dir);const routes=files.filter(f=>f.endsWith('/index.html')).map(f=>'/'+f.slice(dir.length+1,-10));
// Tout lien vers Tempus porte l'identifiant d'affiliation et rel="sponsored", y compris les pages d'information
// (conditions, FAQ, codes promo) écrites à la main dans les contenus. Le build échoue s'il en reste un sans.
const affiliateCode=(await readFile('src/data/affiliation.ts','utf8')).match(/code:'([A-Za-z0-9]+)'/)[1];
const tempusHref=/href="(https:\/\/(?:www\.)?tempusshop\.com[^"]*)"/;
let tagged=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await readFile(file,'utf8');
 const next=html.replace(/<a\b[^>]*>/g,tag=>{
  const m=tag.match(tempusHref);if(!m)return tag;
  const url=new URL(m[1].replaceAll('&amp;','&'));url.hostname='tempusshop.com';
  let out=tag;if(url.searchParams.get('bg_ref')!==affiliateCode){url.searchParams.set('bg_ref',affiliateCode);out=out.replace(m[0],`href="${url.href.replaceAll('&','&amp;')}"`);tagged++;}
  const rel=out.match(/\srel="([^"]*)"/);
  if(!rel)out=out.replace(/^<a\b/,'<a rel="sponsored"');else if(!/\bsponsored\b/.test(rel[1]))out=out.replace(rel[0],` rel="${rel[1]} sponsored"`);
  return out;
 });
 const missing=[...next.matchAll(/<a\b[^>]*href="https:\/\/(?:www\.)?tempusshop\.com[^"]*"[^>]*>/g)].filter(t=>!t[0].includes(`bg_ref=${affiliateCode}`)||!/\brel="[^"]*\bsponsored\b/.test(t[0]));
 if(missing.length)throw new Error(`Lien Tempus sans affiliation dans ${file} : ${missing[0][0]}`);
 if(next!==html)await writeFile(file,next);
}
// Typographie française sur le texte visible des pages françaises : espace insécable avant : ; ? ! » et après «.
// Seuls les nœuds de texte sont touchés (jamais les balises, attributs, scripts ou styles).
let typoPages=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await readFile(file,'utf8');if(!/<html lang="fr"/.test(html))continue;
 const next=html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/).map((part,i)=>i%2?part:part.replace(/ ([:;?!»])/g,' $1').replace(/« /g,'« ')).join('');
 if(next!==html){await writeFile(file,next);typoPages++;}
}
const scriptHashes=new Set();
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await readFile(file,'utf8');
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  if(!/\bsrc=|application\/ld\+json/.test(match[1])&&match[2].trim())scriptHashes.add(`'sha256-${createHash('sha256').update(match[2].replace(/\r\n?/g,'\n')).digest('base64')}'`);
 }
}
const csp=`default-src 'self'; script-src 'self' https://static.cloudflareinsights.com ${[...scriptHashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`;
if(csp.length>1900)throw new Error('CSP trop longue pour les en-têtes Cloudflare.');
const assetHeaders=files.filter(f=>f.startsWith(`${dir}/_astro/`)).map(f=>`/${f.slice(dir.length+1)}\n  ! Cache-Control\n  Cache-Control: public, max-age=31536000, immutable\n`).join('\n');
if(files.filter(f=>f.startsWith(`${dir}/_astro/`)).length+3>100)throw new Error('Limite de règles _headers Cloudflare dépassée.');
await writeFile(`${dir}/_headers`,`/*\n${production?'':'  X-Robots-Tag: noindex, nofollow\n'}${security}  Content-Security-Policy: ${csp}\n  Cache-Control: public, max-age=0, must-revalidate\n\n/404.html\n  X-Robots-Tag: noindex, nofollow\n\n/images/catalogue/*\n  ! Cache-Control\n  Cache-Control: public, max-age=604800, stale-while-revalidate=86400\n\n${assetHeaders}`);
// Adresses renommées (ex. orthographe d'une marque corrigée) : redirections permanentes vers la nouvelle page.
const moved=JSON.parse(await readFile('src/data/redirects.json','utf8'));
for(const {from,to} of moved){if(!existsSync(`${dir}${to}index.html`))throw new Error(`Redirection vers une page absente : ${to}`);if(existsSync(`${dir}${from}index.html`))throw new Error(`Redirection depuis une page encore publiée : ${from}`);}
await writeFile(`${dir}/_redirects`,moved.map(({from,to})=>`${from} ${to} 301`).join('\n')+'\n');
await writeFile(`${dir}/robots.txt`,`User-agent: *\nAllow: /\n${production?'Sitemap: https://cadrin.fr/sitemap.xml\n':'# Preview : noindex dans le HTML et les en-têtes. Aucun sitemap.\n'}`);
if(production)await writeFile(`${dir}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>!r.startsWith('/partage/')).map(r=>`<url><loc>https://cadrin.fr${r}</loc></url>`).join('')}</urlset>`);
await mkdir('evidence/cadrin',{recursive:true});
await writeFile(`evidence/cadrin/${production?'production':'preview'}-routes.json`,JSON.stringify(routes,null,2));
console.log(`${production?"Production":"Preview"} : ${routes.length} routes, headers et robots générés ; ${tagged} liens Tempus complétés avec l’affiliation.`);
