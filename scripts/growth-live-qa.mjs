import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin='https://cadrin.fr',directory='evidence/growth/live';await fs.mkdir(directory,{recursive:true});
const report={origin,checkedAt:new Date().toISOString(),routes:[],browser:[],errors:[],screenshots:[]};
const xml=await(await fetch(origin+'/sitemap.xml')).text();
const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.ok(urls.length>100);
let next=0;await Promise.all(Array.from({length:4},async()=>{while(next<urls.length){const url=urls[next++],response=await fetch(url),html=await response.text();const robots=html.match(/<meta name="robots" content="([^"]+)"/)?.[1]||'';assert.equal(response.status,200,url);assert.ok(!/noindex/.test(robots),url);assert.ok(!/noindex/.test(response.headers.get('x-robots-tag')||''),url);report.routes.push({url,status:response.status,robots});}}));
const missing=await fetch(origin+'/cadrin-qa-page-absente/');assert.equal(missing.status,404);assert.match(await missing.text(),/noindex/);
const browser=await chromium.launch({channel:'chrome'});
try{
 const context=await browser.newContext({locale:'fr-FR'}),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:width===390?844:1000});
  for(const [name,route,selector] of [['home','/',''],['social','/vues-sur-nos-reseaux/','.social-pick'],['finder','/trouver-ma-montre/','[data-guided-choice]'],['gift','/guides/offrir-une-montre/','#pour-trancher']]){
   await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);
   if(name==='finder'){await page.locator('#guided-form select[name=budget]').selectOption('300');await page.locator('#guided-form select[name=dial]').selectOption('Rose');await page.locator('#guided-form button[type=submit]').click();assert.equal(await page.locator('.recommendation').count(),1);}
   if(selector)await page.locator(selector).first().scrollIntoViewIfNeeded();
   await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.naturalWidth).length),0);
   const file=`${directory}/${name}-${width}.png`;await page.screenshot({path:file,fullPage:false});report.screenshots.push(file);report.browser.push({name,width});
  }
 }
 await page.goto(origin+'/en/watch-finder/');assert.equal(await page.locator('#guided-form').count(),1);
 assert.deepEqual(report.errors,[]);
}finally{await browser.close();await fs.writeFile(`${directory}/report.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({publicRoutes:report.routes.length,browserChecks:report.browser.length,errors:report.errors,screenshots:report.screenshots}));
