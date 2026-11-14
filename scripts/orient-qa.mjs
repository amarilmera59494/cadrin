import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {orientGuide,bambinoComparison} from '../src/data/orient-features.ts';
import {featurePath} from '../src/data/features.ts';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
import {affiliateUrl} from '../src/data/affiliation.ts';
import {filterCatalogue,emptyFilters,purchaseLabel} from '../src/lib/tempus-catalogue.ts';

const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4343',dir=process.env.QA_OUTPUT||'evidence/orient/qa';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),context=await browser.newContext({locale:'fr-FR'}),page=await context.newPage();
const report={origin,checkedAt:new Date().toISOString(),layouts:[],links:[],axe:[],noJs:[],interactions:[],errors:[]};
const ready=async()=>page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));});
const routes=[orientGuide,bambinoComparison].flatMap(f=>[false,true].map(en=>({f,en,path:featurePath(f,en)})));
page.on('pageerror',e=>report.errors.push(e.message));
try{
 const links=new Set();
 for(const {f,en,path}of routes)for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});assert.equal((await page.goto(origin+path)).status(),200);await ready();
  assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('html').getAttribute('lang'),en?'en':'fr');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  assert.equal(await page.locator('.feature-hero img').count(),f.choices.length);
  for(const choice of f.choices){const p=data.products.find(p=>p.reference===choice.reference),card=page.locator(`.feature-pick[data-reference="${p.reference}"]`),link=card.locator('a.merchant-button');assert.equal(await card.locator('img').getAttribute('src'),p.image);assert.equal(await link.getAttribute('href'),affiliateUrl(p.source));assert.ok((await link.innerText()).includes(purchaseLabel(p,en)));assert.equal(await link.getAttribute('rel'),'sponsored');}
  const table=await page.locator('.feature-specs table').innerText();assert.ok(table.includes(en?'Functions':'Fonctions'));assert.ok(table.includes(en?'Dial':'Cadran'));if(en)assert.equal(/Cuir|Minéral|Date et jour|Automatique|mètres/.test(table),false);
  if(f===bambinoComparison){const prices=f.choices.map(c=>data.products.find(p=>p.reference===c.reference).price);assert.ok((await page.locator('.feature-price-gap').innerText()).includes(new Intl.NumberFormat(en?'en-GB':'fr-FR',{style:'currency',currency:'EUR'}).format(Math.abs(prices[0]-prices[1]))));}
  if(width===390){const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(a.violations,[]);report.axe.push({path,violations:0});}
  if(width===390||width===1440){await page.screenshot({path:`${dir}/${f.slug}-${en?'en':'fr'}-${width}.png`,fullPage:true});await page.locator('.feature-hero').screenshot({path:`${dir}/${f.slug}-${en?'en':'fr'}-hero-${width}.png`});await page.locator('.feature-specs').screenshot({path:`${dir}/${f.slug}-${en?'en':'fr'}-table-${width}.png`});}
  if(width===1440)for(const href of await page.locator('main a[href]').evaluateAll(as=>as.map(a=>a.href)))if(href.startsWith(origin))links.add(href);
  report.layouts.push({path,width,photos:f.choices.length,overflow:false});
 }
 for(const href of links){const url=new URL(href),r=await context.request.get(url.origin+url.pathname),html=await r.text();assert.equal(r.status(),200,href);if(url.hash)assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),href);report.links.push(href);}
 await page.setViewportSize({width:390,height:844});await page.goto(origin+featurePath(bambinoComparison));
 const table=page.locator('.feature-table-wrap'),label=table.locator('tbody th').first();const initialX=(await label.boundingBox()).x;await table.focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.feature-table-wrap').scrollLeft>0);assert.ok(Math.abs((await label.boundingBox()).x-initialX)<2);report.interactions.push('Table scrolls with keyboard and row labels remain visible');
 const saved=page.locator('.feature-pick').first().locator('[data-save-id]');await saved.click();assert.equal(await saved.getAttribute('aria-pressed'),'true');await page.reload();assert.equal(await page.locator('.feature-pick').first().locator('[data-save-id]').getAttribute('aria-pressed'),'true');report.interactions.push('Save persists after reload');
 await page.locator('.feature-specs a.text-link').click();await page.locator('#catalogue-comparison').waitFor();assert.equal(new URL(page.url()).searchParams.get('compare').split(',').length,2);assert.ok((await page.locator('#catalogue-comparison').innerText()).includes('SRPB41J1'));assert.ok((await page.locator('#catalogue-comparison').innerText()).includes('RA-AC0M04Y'));report.interactions.push('Exact two-model comparison');
 for(const en of [false,true])for(const filter of [{brand:'Orient',movement:'Automatique',strap:'Cuir'},{brand:'Seiko',q:'Presage',dial:'Bleu'}]){
  const query=new URLSearchParams(filter).toString();await page.goto(origin+(en?'/en':'')+'/catalogue/?'+query);await page.waitForFunction(()=>!document.querySelector('select[name=brand]').disabled);
  const n=filterCatalogue(data.products,{...emptyFilters,...filter}).length;assert.ok(n>0);await page.waitForFunction(n=>document.querySelector('#catalogue-count').textContent.replace(/\s/g,'').startsWith(String(n)),n);report.interactions.push({en,filter,results:n});
 }
 // Shared table additions must remain readable in the existing English comparison.
 await page.goto(origin+'/en/comparisons/g-shock-ga-2100-1a1er-or-1aer/');assert.ok((await page.locator('.feature-specs table').innerText()).includes('Alarms, stopwatch'));assert.equal((await page.locator('.feature-specs table').innerText()).includes('chronomètre'),false);
 const plainContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plain=await plainContext.newPage();
 for(const {f,path}of routes){assert.equal((await plain.goto(origin+path)).status(),200);assert.equal(await plain.locator('.feature-pick').count(),f.choices.length);assert.equal(await plain.locator('.feature-pick a.merchant-button').count(),f.choices.length);assert.equal(await plain.locator('.feature-table-wrap').isVisible(),true);report.noJs.push(path);}
 await plainContext.close();assert.deepEqual(report.errors,[]);report.result='PASS';
}finally{await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({result:report.result,layouts:report.layouts.length,links:report.links.length,axe:report.axe.length,noJs:report.noJs.length,interactions:report.interactions.length,errors:report.errors}));
