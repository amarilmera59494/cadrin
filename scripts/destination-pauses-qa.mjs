import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
import pauses from '../src/data/paused-tempus-destinations.json' with {type:'json'};
import {emptyFilters,filterCatalogue} from '../src/lib/tempus-catalogue.ts';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4346',dir=process.env.QA_OUTPUT||'evidence/destinations/after';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),report={origin,checks:[],layouts:[],errors:[]};
const paused=data.products.find(p=>p.reference==='T137.410.11.051.00'),active=data.products.find(p=>p.reference==='NJ0150-81E');
const forbidden=async locator=>assert.equal(await locator.locator('a[href*="tempusshop.com/products/"]').count(),0);
try{
 for(const en of [false,true]){
  const root=en?'/en/catalogue/':'/catalogue/',context=await browser.newContext({locale:en?'en-GB':'fr-FR'}),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  for(const entry of pauses){
   await page.goto(origin+root+'?q='+encodeURIComponent(entry.reference));await page.locator('#catalogue-filters:not([aria-disabled])').waitFor();
   const p=data.products.find(p=>p.source===entry.source),card=page.locator(`.catalogue-card[data-id="${p.id}"]`);
   await card.waitFor();await forbidden(card);assert.match(await card.innerText(),en?/paused/:/suspendu/);
  }
  report.checks.push({en,pausedCards:pauses.length});
  await page.goto(origin+root+'?compare='+paused.id+','+active.id+'#comparaison');await page.locator('#catalogue-comparison').waitFor();
  assert.equal(await page.locator('#catalogue-comparison a[rel=sponsored]').count(),1);
  assert.equal(new URL(await page.locator('#catalogue-comparison a[rel=sponsored]').getAttribute('href')).searchParams.get('bg_ref'),'bDlTL8AyKb');
  await page.goto(origin+(en?'/en/saved-watches/':'/mes-favoris/')+'#liste='+paused.id);await page.locator('.saved-card').waitFor();await forbidden(page.locator('.saved-card'));
  await page.goto(origin+root+'?q='+paused.reference);await page.locator('#catalogue-filters:not([aria-disabled])').waitFor();
  await page.locator('.catalogue-card .text-link').click();await page.locator('#liens-marchands').waitFor();assert.equal(new URL(page.url()).hash,'#liens-marchands');
  await page.locator('a[data-language='+ (en?'fr':'en') +']').first().click();assert.equal(new URL(page.url()).hash,'#liens-marchands');
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto(origin+root+'?q='+paused.reference);await page.locator('#catalogue-filters:not([aria-disabled])').waitFor();
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations,[]);
   await page.locator('#catalogue-count').evaluate(e=>e.scrollIntoView({block:'start'}));await page.screenshot({path:`${dir}/${en?'en':'fr'}-${width}.png`});report.layouts.push({en,width,axe:0});
  }
  await page.goto(origin+(en?'/en/guides/buying-a-higher-end-watch/':'/guides/premiere-montre-haut-de-gamme/'));
  await forbidden(page.locator('.guide-example[data-reference="'+paused.reference+'"]'));
  assert.equal(await page.locator('a[href*="/products/tissot-prx-noir"]').count(),0);report.checks.push({en,comparison:true,saved:true,helpAndLanguage:true,guide:true});await context.close();
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),np=await nojs.newPage();
  const number=Math.floor(filterCatalogue(data.products,emptyFilters).findIndex(p=>p.id===paused.id)/data.pageSize)+1;
  await np.goto(origin+root+(number===1?'':number+'/'));const card=np.locator('.catalogue-card[data-id="'+paused.id+'"]');await card.waitFor();await forbidden(card);report.checks.push({en,noJSPage:number});await nojs.close();
 }
 assert.deepEqual(report.errors,[]);report.pass=true;
}catch(e){report.pass=false;report.failure=e.stack;throw e;}finally{await browser.close();await writeFile(dir+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
