import {readFile,readdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {isTempusProduct,tempusAffiliate} from '../src/data/affiliation.ts';
import catalogue from '../src/data/tempus-catalogue.json' with {type:'json'};
import {purchaseLabel,merchantLinkAvailable} from '../src/lib/tempus-catalogue.ts';
const production=process.env.SITE_STAGE==='production';const dir=production?'dist-production':'dist';
async function walk(path){return(await Promise.all((await readdir(path,{withFileTypes:true})).map(f=>f.isDirectory()?walk(`${path}/${f.name}`):`${path}/${f.name}`))).flat()}
const files=await walk(dir), results=[];const errors=[];
for(const file of files.filter(f=>f.endsWith('.html'))){const html=await readFile(file,'utf8');const route=file.slice(dir.length);const is404=route==='/404.html';
 if(/AU PORTÉ|Étude de design|\/concepts\/|cadrin\.com/.test(html))errors.push(`${route}: marque ou concept archivé`);
 const noindex=html.includes('content="noindex, nofollow"');if(noindex!==(!production||is404))errors.push(`${route}: robots incorrects`);
 if(production&&!is404&&!html.includes('rel="canonical" href="https://cadrin.fr/'))errors.push(`${route}: canonical absent`);
 if(!production&&html.includes('rel="canonical"'))errors.push(`${route}: canonical en preview`);
 // Every product exit, including source citations, must credit the real account.
 for(const anchor of html.matchAll(/<a\b([^>]+)>/g)){
  const href=anchor[1].match(/\bhref="([^"]+)"/)?.[1]?.replaceAll('&amp;','&');
  if(href&&isTempusProduct(href)){
   const target=new URL(href),rel=anchor[1].match(/\brel="([^"]+)"/)?.[1]||'';
   if(target.searchParams.getAll('bg_ref').length!==1||target.searchParams.get('bg_ref')!==tempusAffiliate.code||!rel.split(/\s+/).includes('sponsored'))errors.push(`${route}: lien produit Tempus non affilié ou non signalé: ${href}`);
  }
 }
 // A dated unavailable/preorder offer must not keep a generic Buy CTA in cached Markdown.
 const english=route.startsWith('/en/');
 for(const [,attrs,body]of html.matchAll(/<a\b([^>]+)>([\s\S]*?)<\/a>/g)){
  if(!/\bclass="[^"]*merchant-button/.test(attrs))continue;
  const href=attrs.match(/\bhref="([^"]+)"/)?.[1]?.replaceAll('&amp;','&');
  if(!href||!isTempusProduct(href))continue;
  const path=new URL(href).pathname.replace(/^\/en\//,'/');
  const product=catalogue.products.find(p=>new URL(p.source).pathname===path);
  if(product&&(!merchantLinkAvailable(product)||!body.replace(/<[^>]+>/g,'').includes(purchaseLabel(product,english))))errors.push(`${route}: bouton incohérent avec le statut de ${product.reference}`);
 }
 for(const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){const json=JSON.parse(match[1]);if(/"(?:Offer|Review|AggregateRating|Product)"/.test(JSON.stringify(json)))errors.push(`${route}: schema non autorisé`)}
 let jsBytes=0;for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(match[1].includes('application/ld+json'))continue;const src=match[1].match(/src="([^"]+)"/);jsBytes+=gzipSync(src?await readFile(dir+src[1]):Buffer.from(match[2])).length;}if(jsBytes>60000)errors.push(`${route}: budget JS dépassé`);
 results.push({route,jsGzipBytes:jsBytes,noindex,htmlBytes:Buffer.byteLength(html)});
}
// Detect stale Markdown caches after product prices, references or illustrations change.
const {guideExamples}=await import('./remark-guide-examples.mjs');
for(const file of await readdir('src/content/guides')){
 const markdown=await readFile('src/content/guides/'+file,'utf8');
 const groups=[...markdown.matchAll(/::montres\[([a-z0-9-]+)\]/g)];if(!groups.length)continue;
 const html=await readFile(`${dir}/guides/${file.replace(/\.md$/,'')}/index.html`,'utf8');
 for(const [,key]of groups){
  // Astro can normalise whitespace and attribute syntax; compare visible snapshot values.
  const expected=guideExamples(key);
  for(const value of expected.matchAll(/class="(?:example-ref|example-price|example-specs)">([^<]+)/g)){
   if(!html.includes(value[1]))errors.push(`${file}: stale guide example ${key}: ${value[1]}`);
  }
 }
}
if(files.some(f=>f.includes('/concepts/')))errors.push('Concepts dans le build');
const hasSitemap=files.includes(`${dir}/sitemap.xml`);if(hasSitemap!==production)errors.push('Sitemap incorrect');
if(production){
 const sitemap=await readFile(`${dir}/sitemap.xml`,'utf8');
 const expected=files.filter(f=>f.endsWith('/index.html')).map(f=>'https://cadrin.fr/'+f.slice(dir.length+1,-10)).sort();
 const actual=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]).sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))errors.push('Sitemap différent des pages indexables générées');
}
await writeFile(`evidence/cadrin/${production?'production':'preview'}-build-report.json`,JSON.stringify({results,errors},null,2));
console.log(JSON.stringify({routes:results.length,maxJsGzip:Math.max(...results.map(r=>r.jsGzipBytes)),errors}));if(errors.length)process.exitCode=1;
