import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4344';
const dir=process.env.QA_OUTPUT||'evidence/final-audit/selection';
await mkdir(dir,{recursive:true});
const report={origin,date:new Date().toISOString(),layouts:[],interactions:[],noJS:[],axe:[],errors:[]};
const browser=await chromium.launch({channel:'chrome'});
const routes={fr:'/selections/trois-montres-au-quotidien/',en:'/en/selections/three-everyday-watches/'};
try{
 for(const [lang,route] of Object.entries(routes)){
  const context=await browser.newContext({locale:lang==='fr'?'fr-FR':'en-GB'}),page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  for(const width of [320,360,390,768,1440,1920]){
   await page.setViewportSize({width,height:width<700?844:1000});await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);
   await page.locator('.selection-overview img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   const layout=await page.evaluate(()=>({width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,firstPhotoY:document.querySelector('.selection-overview img').getBoundingClientRect().top,photos:[...document.querySelectorAll('.selection-overview img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.getAttribute('src')})),closed:!document.querySelector('.selection-refine').open}));
   assert.equal(layout.overflow,false);assert.equal(layout.photos.length,3);assert(layout.photos.every(p=>p.loaded));assert(layout.closed);assert(layout.firstPhotoY<layout.height);
   await page.screenshot({path:`${dir}/${lang}-${width}.png`});report.layouts.push({lang,...layout});
  }
  await page.setViewportSize({width:390,height:844});await page.goto(origin+route);
  const summary=page.locator('.selection-refine summary');await summary.focus();await page.keyboard.press('Enter');assert(await page.locator('#filters').isVisible());
  await page.locator('[name=movement]').selectOption('Automatique');assert.equal(await page.locator('[data-product-row]:visible').count(),1);
  const other=page.locator(`.language-switch [data-language=${lang==='fr'?'en':'fr'}]`);assert(new URL(await other.getAttribute('href'),origin).searchParams.get('movement')==='Automatique');
  await page.locator('[name=size]').selectOption('unknown');assert.equal(await page.locator('[data-product-row]:visible').count(),0);assert(await page.locator('#empty').isVisible());
  await page.goBack();assert.equal(await page.locator('[name=size]').inputValue(),'');assert.equal(await page.locator('[data-product-row]:visible').count(),1);
  await page.goForward();assert.equal(await page.locator('[name=size]').inputValue(),'unknown');assert(await page.locator('#empty').isVisible());
  await page.locator('#empty-reset').click();await page.waitForFunction(()=>document.querySelector('#result-count').textContent.startsWith('3'));assert.equal(await page.locator('[data-product-row]:visible').count(),3);assert(await page.locator('[name=movement]').evaluate(e=>e===document.activeElement));
  await page.goto(origin+route+'?movement=Quartz');assert(await page.locator('#filters').isVisible());assert.equal(await page.locator('[data-product-row]:visible').count(),1);
  await other.click();await page.waitForLoadState('load');assert.equal(await page.locator('[name=movement]').inputValue(),'Quartz');assert.equal(await page.locator('[data-product-row]:visible').count(),1);
  await page.goto(origin+route);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']).analyze();assert.deepEqual(axe.violations,[]);report.axe.push({lang,violations:axe.violations});
  const photoSources=await page.locator('.watch-grid img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));assert.deepEqual(await page.locator('.selection-overview img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src'))),photoSources);
  await page.locator('.selection-overview a').last().click();await page.waitForLoadState('load');assert(new URL(page.url()).pathname.includes('/casio-f91w/'));
  const outgoing=await page.locator('a[href*="tempusshop.com/products/"]').evaluateAll(as=>as.map(a=>({href:a.href,rel:a.rel})));assert(outgoing.length);assert(outgoing.every(a=>new URL(a.href).searchParams.get('bg_ref')==='bDlTL8AyKb'&&a.rel.split(' ').includes('sponsored')));
  report.interactions.push({lang,keyboard:true,filter:true,empty:true,back:true,forward:true,resetFocus:true,deepLink:true,languagePreservesFilter:true,registeredPhotosReused:true,watchJourney:true,affiliateLinks:outgoing.length});await context.close();
  const plain=await browser.newContext({javaScriptEnabled:false,locale:lang==='fr'?'fr-FR':'en-GB',viewport:{width:390,height:844}}),p=await plain.newPage();await p.goto(origin+route);assert.equal(await p.locator('[data-product-row]:visible').count(),3);assert.equal(await p.locator('.selection-overview a').count(),3);await p.locator('.selection-overview a').last().click();assert(new URL(p.url()).pathname.includes('/casio-f91w/'));report.noJS.push({lang,threeCards:true,journey:true});await plain.close();
 }
 assert.deepEqual(report.errors,[]);report.pass=true;
}catch(e){report.pass=false;report.failure=e.stack;throw e;}finally{await browser.close();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({pass:report.pass,layouts:report.layouts.length,interactions:report.interactions.length,noJS:report.noJS.length,failure:report.failure}));}
