import {readFile,readdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const routes=['concepts','concepts/revue','concepts/revue/guide','concepts/mesure','concepts/mesure/guide','concepts/allure','concepts/allure/guide'];
const results=[];
for(const route of routes){
 const html=await readFile(`dist/${route}/index.html`,'utf8');
 if(!html.includes('content="noindex, nofollow"'))throw Error(`Missing noindex: ${route}`);
 if(/rel="canonical"|application\/ld\+json[^>]*>[^<]*"(?:Offer|Review|AggregateRating)"/.test(html))throw Error(`Unapproved SEO output: ${route}`);
 let jsBytes=0;for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(match[1].includes('application/ld+json'))continue;const src=match[1].match(/src="([^"]+)"/);jsBytes+=gzipSync(src?await readFile('dist'+src[1]):Buffer.from(match[2])).length;}
 if(jsBytes>60000)throw Error(`JS budget exceeded: ${route} ${jsBytes}`);
 results.push({route:'/'+route+'/',jsGzipBytes:jsBytes,htmlBytes:Buffer.byteLength(html),noindex:true});
}
if((await readdir('dist')).some(n=>n.startsWith('sitemap')))throw Error('Concepts must not have a sitemap');
await writeFile('evidence/build-report.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
