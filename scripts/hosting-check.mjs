import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const origin=(process.env.QA_ORIGIN || 'http://127.0.0.1:4323').replace(/\/$/,'');
const results=[];
async function check(route,status){
 const response=await fetch(origin+route,{redirect:'manual'});
 assert.equal(response.status,status,route);
 const html=await response.text();
 results.push({route,status:response.status,location:response.headers.get('location')});
 if(status===200||status===404){
  assert.match(response.headers.get('x-robots-tag')||'',/noindex/);
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  assert.equal(response.headers.get('x-frame-options'),'DENY');
  assert.match(response.headers.get('content-security-policy')||'',/frame-ancestors 'none'/);
 }
 if(status===404){assert.equal(response.headers.get('cache-control'),'public, max-age=0, must-revalidate');assert.match(html,/Reprenons le fil/);assert.match(html,/noindex, nofollow/);}
 return {response,html};
}
for(const route of JSON.parse(await readFile('evidence/cadrin/preview-routes.json','utf8')))await check(route,200);
for(const route of ['/page-absente-test/','/guides/page-absente/','/images/introuvable.jpg','/_astro/introuvable.js','/.env','/.git/config','/docs/cadrin-launch.md','/concepts/','/sitemap.xml'])await check(route,404);
const slash=await check('/guides?origine=test',307);
assert.equal(new URL(slash.response.headers.get('location'),origin).pathname,'/guides/');
assert.equal(new URL(slash.response.headers.get('location'),origin).search,'?origine=test');
const home=await fetch(origin+'/');const html=await home.text();
const asset=html.match(/href="(\/_astro\/[^"?]+\.css)"/)[1];
const css=await fetch(origin+asset);assert.equal(css.status,200);assert.equal(css.headers.get('cache-control'),'public, max-age=31536000, immutable');
const head=await fetch(origin+'/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
const post=await fetch(origin+'/',{method:'POST'});assert.equal(post.status,405);
await mkdir('evidence/deployment',{recursive:true});
await writeFile(`evidence/deployment/hosting-${new URL(origin).hostname}.json`,JSON.stringify({checkedAt:new Date().toISOString(),origin,results,immutableAssets:true,head:true,post405:true},null,2));
console.log(JSON.stringify({origin,checks:results.length+3,passed:true}));
