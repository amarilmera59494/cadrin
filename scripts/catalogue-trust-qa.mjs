import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
import {emptyFilters,filterCatalogue} from '../src/lib/tempus-catalogue.ts';

const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4342';
const output=process.env.QA_OUTPUT||'evidence/catalogue-trust/after';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),context=await browser.newContext({locale:'fr-FR'}),page=await context.newPage();
const report={origin,checkedAt:new Date().toISOString(),layouts:[],filters:[],axe:[],noJs:[],errors:[]};
page.on('pageerror',e=>report.errors.push(e.message));
const ready=async()=>{await page.waitForFunction(()=>!document.querySelector('select[name=brand]').disabled);};
const count=async(filter)=>{
 const expected=filterCatalogue(data.products,{...emptyFilters,...filter}).length;
 await page.waitForFunction(n=>document.querySelector('#catalogue-count').textContent.replace(/\s/g,'').startsWith(String(n)),expected);
 report.filters.push({filter,expected});
};
try{
 for(const width of [320,390,768,1440])for(const [slug,route,selector]of [
  ['type26','/catalogue/?q=T26DLC','.catalogue-card[data-reference="T26DLC"]'],
  ['colour','/catalogue/?q=MTP-1302PD-4AVEF','.catalogue-card[data-reference="MTP-1302PD-4AVEF"]'],
  ['sources','/en/guides/watch-water-resistance-3-5-10-20-atm/','#sources']
 ]){
  await page.setViewportSize({width,height:844});assert.equal((await page.goto(origin+route)).status(),200);
  if(slug!=='sources')await ready();
  const el=page.locator(selector);await el.waitFor();
  await el.evaluate(async e=>{e.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...e.querySelectorAll('img')].map(i=>i.decode()));await document.fonts.ready;});
  if(await el.locator('details').count()){await el.locator('details').evaluate(e=>e.open=false);await el.locator('summary').click();}
  const text=await el.innerText();
  if(slug!=='sources'&&width<=700){const card=await el.boundingBox(),grid=await page.locator('#catalogue-cards').boundingBox();assert.ok(Math.abs(card.width-grid.width)<2,'Single result should fill the mobile grid');}
  if(slug==='type26')assert.equal(text.includes('Chronographe'),false);
  if(slug==='colour'){assert.ok(text.includes('Rouge'));assert.equal(text.includes('ajoute une touche'),false);}
  if(slug==='sources'){assert.ok(text.includes('Citizen'));assert.ok(text.includes('GA-2100-1A1ER'));assert.equal(/source \d/.test(text),false);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  const links=await el.locator('a[href*="tempusshop.com/products/"]').evaluateAll(as=>as.map(a=>({url:a.href,rel:a.rel})));
  assert.ok(links.length);for(const link of links){assert.deepEqual(new URL(link.url).searchParams.getAll('bg_ref'),['bDlTL8AyKb']);assert.ok(link.rel.split(' ').includes('sponsored'));}
  if(width===390||width===1440){await el.screenshot({path:`${output}/${slug}-${width}.png`});await page.screenshot({path:`${output}/${slug}-viewport-${width}.png`});}
  if(width===390){const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(a.violations,[]);report.axe.push({route,violations:0});}
  report.layouts.push({route,width,text});
 }
 await page.goto(origin+'/catalogue/?q=T26DLC&feature=Chronographe');await ready();await count({q:'T26DLC',feature:'Chronographe'});
 await page.goto(origin+'/catalogue/?brand=Longines&order=open');await ready();await count({brand:'Longines',order:'open'});
 assert.equal(await page.locator('.catalogue-card a[href*="tempusshop.com/products/"]').count(),0);
 await page.locator('select[name=order]').selectOption('');await count({brand:'Longines'});
 assert.equal(await page.locator('.catalogue-card a[href*="tempusshop.com/products/"]').count(),0);
 await page.goBack();await count({brand:'Longines',order:'open'});
 await page.goto(origin+'/en/catalogue/?q=MTP-1302PD-4AVEF');await ready();
 const card=page.locator('.catalogue-card[data-reference="MTP-1302PD-4AVEF"]');await card.locator('summary').click();assert.ok((await card.innerText()).includes('Red'));
 const plainContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plain=await plainContext.newPage();
 // Static pagination remains usable without scripts; query filters are explicitly unavailable.
 for(const route of ['/catalogue/','/en/catalogue/','/en/guides/watch-water-resistance-3-5-10-20-atm/']){
  assert.equal((await plain.goto(origin+route)).status(),200);assert.ok(await plain.locator('main a[href*="tempusshop.com/products/"]').count());
  if(route.includes('catalogue'))assert.equal(await plain.locator('#catalogue-filters').isVisible(),false);
  else assert.ok((await plain.locator('#sources').innerText()).includes('GA-2100-1A1ER'));
  report.noJs.push(route);
 }
 await plainContext.close();assert.deepEqual(report.errors,[]);report.result='PASS';
}finally{await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({result:report.result,layouts:report.layouts.length,filters:report.filters.length,axe:report.axe.length,noJs:report.noJs.length,errors:report.errors}));
