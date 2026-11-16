import {Miniflare} from 'miniflare';import {access,writeFile,readFile} from 'node:fs/promises';import path from 'node:path';import cloudflare from '../cloudflare.config.ts';
const {name,compatibilityDate,assets}=cloudflare.worker;
const server=new Miniflare({host:'127.0.0.1',port:0,telemetry:{enabled:false},workers:[{config:{name,compatibilityDate,manifest:{mainModule:'empty.mjs',modules:{'empty.mjs':{type:'esm',contents:'export default {fetch(){return new Response(null,{status:404})}}'}}},assets:{...assets,directory:path.resolve('dist-production'),hasUserWorker:false}}}]});
const published=JSON.parse(await readFile('evidence/cadrin/production-routes.json','utf8'));
const preview=JSON.parse(await readFile('evidence/cadrin/preview-routes.json','utf8'));
const excluded=[...new Set([...preview.filter(route=>!published.includes(route)), '/concepts/', '/concepts/allure/', '/inexistante/'])];
const results=[];function check(name,pass,detail){results.push({name,pass,detail})}
const indexable=[];
try{const origin=String(await server.ready);for(const route of published){const r=await fetch(new URL(route,origin));const html=await r.text();
 // Pages publiques : indexables avec canonique sur elles-mêmes, ou volontairement en « noindex, follow » / canoniques vers une page plus complète.
 const canon=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]||'';const soft=html.includes('content="noindex, follow"');const self=canon==='https://cadrin.fr'+route;
 if(html.includes('content="index, follow"')&&self&&!route.startsWith('/partage/'))indexable.push(route);
 check('public:'+route,r.status===200&&(html.includes('content="index, follow"')||soft)&&canon.startsWith('https://cadrin.fr/')&&!r.headers.has('x-robots-tag'),{status:r.status});}
for(const route of excluded){const r=await fetch(new URL(route,origin));const html=await r.text();check('excluded:'+route,r.status===404&&html.includes('Reprenons le fil')&&html.includes('noindex, nofollow'),{status:r.status});}
for(const route of ['/','/en/']){const html=await (await fetch(new URL(route,origin))).text();check('language-alternates:'+route,html.includes('hreflang="fr"')&&html.includes('hreflang="en"')&&html.includes('hreflang="x-default"'));}
const redirect=await fetch(new URL('/guides',origin),{redirect:'manual'});check('trailing-slash',[301,302,307,308].includes(redirect.status)&&redirect.headers.get('location')?.endsWith('/guides/'),{status:redirect.status,location:redirect.headers.get('location')});
const sitemap=await fetch(new URL('/sitemap.xml',origin));const xml=await sitemap.text();const sitemapUrls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]).sort();check('sitemap',sitemap.status===200&&JSON.stringify(sitemapUrls)===JSON.stringify(indexable.map(route=>'https://cadrin.fr'+route).sort()));
let previewSitemap=false;try{await access('dist/sitemap.xml');previewSitemap=true}catch{}check('preview-sitemap-absent',!previewSitemap);
}finally{await server.dispose();await writeFile('evidence/cadrin/production-hosting-report.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify(results,null,2));if(results.some(r=>!r.pass))process.exitCode=1;
