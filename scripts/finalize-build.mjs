import {writeFile,readFile,readdir,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const production=process.env.SITE_STAGE==='production';const dir=production?'dist-production':'dist';
const security='  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n';
async function walk(path){const files=await readdir(path,{withFileTypes:true});return (await Promise.all(files.map(f=>f.isDirectory()?walk(`${path}/${f.name}`):`${path}/${f.name}`))).flat()}
const files=await walk(dir);const routes=files.filter(f=>f.endsWith('/index.html')).map(f=>'/'+f.slice(dir.length+1,-10));
const scriptHashes=new Set();
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await readFile(file,'utf8');
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  if(!/\bsrc=|application\/ld\+json/.test(match[1])&&match[2].trim())scriptHashes.add(`'sha256-${createHash('sha256').update(match[2].replace(/\r\n?/g,'\n')).digest('base64')}'`);
 }
}
const csp=`default-src 'self'; script-src 'self' ${[...scriptHashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`;
if(csp.length>1900)throw new Error('CSP trop longue pour les en-têtes Cloudflare.');
const assetHeaders=files.filter(f=>f.startsWith(`${dir}/_astro/`)).map(f=>`/${f.slice(dir.length+1)}\n  ! Cache-Control\n  Cache-Control: public, max-age=31536000, immutable\n`).join('\n');
if(files.filter(f=>f.startsWith(`${dir}/_astro/`)).length+3>100)throw new Error('Limite de règles _headers Cloudflare dépassée.');
await writeFile(`${dir}/_headers`,`/*\n${production?'':'  X-Robots-Tag: noindex, nofollow\n'}${security}  Content-Security-Policy: ${csp}\n  Cache-Control: public, max-age=0, must-revalidate\n\n/404.html\n  X-Robots-Tag: noindex, nofollow\n\n/images/*\n  ! Cache-Control\n  Cache-Control: public, max-age=604800, stale-while-revalidate=86400\n\n${assetHeaders}`);
await writeFile(`${dir}/robots.txt`,`User-agent: *\nAllow: /\n${production?'Sitemap: https://cadrin.fr/sitemap.xml\n':'# Preview : noindex dans le HTML et les en-têtes. Aucun sitemap.\n'}`);
if(production)await writeFile(`${dir}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>!r.startsWith('/partage/')).map(r=>`<url><loc>https://cadrin.fr${r}</loc></url>`).join('')}</urlset>`);
await mkdir('evidence/cadrin',{recursive:true});
await writeFile(`evidence/cadrin/${production?'production':'preview'}-routes.json`,JSON.stringify(routes,null,2));
console.log(`${production?'Production':'Preview'} : ${routes.length} routes, headers et robots générés.`);
