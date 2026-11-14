import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4345',dir=process.env.QA_OUTPUT||'evidence/polish/navigation';
const data=JSON.parse(await readFile('src/data/tempus-catalogue.json','utf8'));
await mkdir(dir,{recursive:true});
const report={origin,layouts:[],flows:[],fallback:[],errors:[]},browser=await chromium.launch({channel:'chrome'});
try{
 for(const lang of ['fr','en']){
  const route=lang==='fr'?'/catalogue/':'/en/catalogue/',context=await browser.newContext({locale:lang==='fr'?'fr-FR':'en-GB'}),p=await context.newPage();
  p.on('pageerror',e=>report.errors.push(e.message));
  for(const width of [320,390,768,1024,1440]){
   await p.setViewportSize({width,height:900});await p.goto(origin+route+'?brand=Seiko&budget=500');await p.locator('#catalogue-filters:not([aria-disabled])').waitFor();await p.evaluate(()=>document.fonts.ready);
   assert(await p.locator('[name=sort]').isVisible());assert.equal(await p.locator('.catalogue-advanced').getAttribute('open'),null);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations,[]);
   await p.locator('#catalogue-count').evaluate(e=>e.scrollIntoView({block:'start'}));await p.screenshot({path:`${dir}/${lang}-${width}.png`});report.layouts.push({lang,width,axe:0,overflow:false});
  }
  await p.setViewportSize({width:390,height:844});await p.goto(origin+route);await p.locator('#catalogue-filters:not([aria-disabled])').waitFor();
  await p.locator('.catalogue-browse').click();assert((await p.locator('#catalogue-count').boundingBox()).y<400);
  await p.locator('#catalogue-pagination-top a').last().click();assert.equal(new URL(p.url()).searchParams.get('page'),'2');assert(await p.locator('#catalogue-count').evaluate(e=>e===document.activeElement));
  await p.locator('.catalogue-pick input').first().check();const selected=new URL(p.url()).searchParams.get('compare');assert(selected);
  for(const selector of ['#catalogue-pagination','#catalogue-pagination-top'])assert.equal(new URL(await p.locator(selector+' a').last().getAttribute('href'),origin).searchParams.get('compare'),selected);
  await p.locator('[name=sort]').selectOption('price');assert.equal(new URL(p.url()).searchParams.get('page'),null);assert.equal(new URL(p.url()).searchParams.get('compare'),selected);
  const ids=await p.locator('.catalogue-card').evaluateAll(es=>es.map(e=>e.dataset.id)),prices=ids.map(id=>data.products.find(p=>p.id===id).price);assert(prices.every((v,i)=>!i||v>=prices[i-1]));
  await p.goBack();assert.equal(await p.locator('[name=sort]').inputValue(),'');assert.equal(new URL(p.url()).searchParams.get('page'),'2');
  await p.locator('#catalogue-comparison [data-remove]').click();assert.equal(new URL(p.url()).searchParams.get('compare'),null);assert.equal(new URL(await p.locator('#catalogue-pagination-top a').last().getAttribute('href'),origin).searchParams.get('compare'),null);
  await p.locator('.catalogue-edit-filters').click();assert(await p.locator('[name=q]').evaluate(e=>e===document.activeElement));
  await p.locator('[name=sort]').selectOption('price-desc');await p.locator('#catalogue-filters [type=reset]').click();await p.waitForFunction(()=>!new URL(location.href).searchParams.has('sort'));assert.equal(await p.locator('[name=sort]').inputValue(),'');
  await p.locator('[name=q]').fill('NJ0150-81E');await p.waitForFunction(()=>document.querySelectorAll('.catalogue-card').length===1);assert(await p.locator('#catalogue-pagination-top').isHidden());
  await p.locator('[name=sort]').selectOption('price');await p.locator('.language-switch [data-language='+ (lang==='fr'?'en':'fr') +']').click();await p.locator('#catalogue-filters:not([aria-disabled])').waitFor();assert.equal(await p.locator('[name=sort]').inputValue(),'price');assert.equal(await p.locator('[name=q]').inputValue(),'NJ0150-81E');
  report.flows.push({lang,topPagination:true,focus:true,sort:true,history:true,comparisonLinks:true,reset:true,language:true});await context.close();
  const staticContext=await browser.newContext({javaScriptEnabled:false,locale:lang==='fr'?'fr-FR':'en-GB',viewport:{width:390,height:844}}),s=await staticContext.newPage();await s.goto(origin+route);assert(await s.locator('[data-catalogue-tools]').isHidden());await s.locator('#catalogue-pagination-top a').last().click();assert.equal(new URL(s.url()).pathname,route+'2/');assert.equal(await s.locator('.catalogue-card').count(),48);report.fallback.push({lang,noJS:true});await staticContext.close();
 }
 const context=await browser.newContext(),p=await context.newPage();await p.route('**/catalogue.json',r=>r.abort());await p.goto(origin+'/catalogue/');await p.locator('#catalogue-error').waitFor();assert(await p.locator('[data-catalogue-tools]').isHidden());await p.locator('#catalogue-pagination-top a').last().click();assert.equal(new URL(p.url()).pathname,'/catalogue/2/');report.fallback.push({failedData:true,nativePagination:true});await context.close();
 assert.deepEqual(report.errors,[]);report.pass=true;
}catch(e){report.failure=e.stack;report.pass=false;throw e;}finally{await browser.close();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
