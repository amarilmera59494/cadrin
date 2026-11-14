import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
import {filterCatalogue,emptyFilters} from '../src/lib/tempus-catalogue.ts';

const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4341';
const output=process.env.QA_OUTPUT||'evidence/editorial';
await mkdir(output,{recursive:true});
const routes=['/comparatifs/g-shock-ga-2100-1a1er-ou-1aer/','/en/comparisons/g-shock-ga-2100-1a1er-or-1aer/','/guides/etancheite-montre-3-5-10-20-atm/','/en/guides/watch-water-resistance-3-5-10-20-atm/'];
const browser=await chromium.launch({channel:'chrome'}),context=await browser.newContext(),page=await context.newPage();
const report={origin,checkedAt:new Date().toISOString(),layouts:[],axe:[],errors:[],internalLinks:0,filterCases:[],noJs:[]};
page.on('pageerror',e=>report.errors.push(e.message));
try{
 const links=new Set();
 for(const [i,route]of routes.entries())for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});const response=await page.goto(origin+route);assert.equal(response.status(),200);
  await page.locator('h1').waitFor();await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));await document.fonts.ready;});
  assert.equal(await page.locator('h1').count(),1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`${route} ${width}`);
  const images=await page.locator('main img').evaluateAll(imgs=>imgs.map(img=>({src:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0})));
  assert.ok(images.length>=2);assert.ok(images.every(img=>img.loaded),JSON.stringify(images));
  const affiliates=await page.locator('a[href*="tempusshop.com/products/"]').evaluateAll(as=>as.map(a=>({href:a.href,rel:a.rel})));
  assert.ok(affiliates.length>=2);assert.ok(affiliates.every(a=>new URL(a.href).searchParams.getAll('bg_ref').join()==='bDlTL8AyKb'&&a.rel.split(' ').includes('sponsored')));
  if(width===390){const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.axe.push({route,violations:a.violations});assert.equal(a.violations.length,0,JSON.stringify(a.violations));}
  if(width===390||width===1440)await page.screenshot({path:`${output}/${i}-${width}.png`,fullPage:true});
  if(width===1440)for(const href of await page.locator('main a[href]').evaluateAll(as=>as.map(a=>a.href)))if(href.startsWith(origin))links.add(href.split('#')[0]);
  report.layouts.push({route,width,images:images.length,affiliateLinks:affiliates.length,overflow});
 }
 for(const href of links){const r=await context.request.get(href);assert.equal(r.status(),200,href);report.internalLinks++;}
 await page.setViewportSize({width:390,height:844});
 await page.goto(origin+'/catalogue/?water=20&brand=G-Shock&budget=150');
 const water=page.locator('select[name=water]');await water.waitFor();await page.waitForFunction(()=>!document.querySelector('select[name=water]').disabled);
 assert.equal(await water.inputValue(),'20');assert.equal(await page.locator('.catalogue-advanced').evaluate(e=>e.open),true);
 const assertCount=async(filter)=>{const expected=filterCatalogue(data.products,{...emptyFilters,...filter}).length;await page.waitForFunction(n=>document.querySelector('#catalogue-count').textContent.replace(/\s/g,'').startsWith(String(n)),expected);report.filterCases.push({filter,expected});};
 await assertCount({water:'20',brand:'G-Shock',budget:'150'});
 await water.selectOption('10');await assertCount({water:'10',brand:'G-Shock',budget:'150'});assert.equal(new URL(page.url()).searchParams.get('water'),'10');
 await page.goBack();await assertCount({water:'20',brand:'G-Shock',budget:'150'});assert.equal(await water.inputValue(),'20');
 await water.focus();await page.keyboard.press('ArrowUp');await page.keyboard.press('Tab');await assertCount({water:'10',brand:'G-Shock',budget:'150'});
 await page.locator('#catalogue-filters button[type=reset]').click();await assertCount({});assert.equal(await water.inputValue(),'');assert.equal(new URL(page.url()).searchParams.has('water'),false);
 await page.goto(origin+'/en/catalogue/?water=5');await page.waitForFunction(()=>!document.querySelector('select[name=water]').disabled);await assertCount({water:'5'});
 await page.locator('select[name=water]').scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/water-filter-390.png`});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plain=await noJs.newPage();
 for(const route of [...routes,'/catalogue/?water=20','/en/catalogue/?water=20']){
  assert.equal((await plain.goto(origin+route)).status(),200);assert.ok(await plain.locator('main a[href*="tempusshop.com/products/"]').count());
  if(route.includes('catalogue'))assert.equal(await plain.locator('#catalogue-filters').isVisible(),false);
  report.noJs.push(route);
 }
 await noJs.close();assert.deepEqual(report.errors,[]);
 report.result='PASS';
}finally{await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({result:report.result,layouts:report.layouts.length,axe:report.axe.length,links:report.internalLinks,filterCases:report.filterCases.length,noJs:report.noJs.length,errors:report.errors}));
