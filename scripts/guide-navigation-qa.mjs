import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readdir} from 'node:fs/promises';
import {routePairs} from '../src/lib/i18n.ts';
import groups from '../src/data/guide-examples.json' with {type:'json'};
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4353',dir=process.env.QA_OUTPUT||'evidence/guides/after';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),report={origin,routes:[],layouts:[],journeys:[],noJavaScript:[],errors:[]};
const guidePaths=(await readdir('src/content/guides')).filter(f=>f.endsWith('.md')).map(f=>'/guides/'+f.slice(0,-3)+'/');
const gift='/guides/offrir-une-montre/',first='/guides/choisir-premiere-montre/',movement='/guides/automatique-quartz-solaire/';
const ready=async p=>p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
const state=async p=>p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),duplicateIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((id,i,all)=>all.indexOf(id)!==i),missingAnchors:[...document.querySelectorAll('.guide-start a,.guide-navigation a,.gift-directions a,.guide-return a')].map(a=>a.hash).filter(hash=>!hash||!document.getElementById(decodeURIComponent(hash.slice(1))))}));
try{
 for(const en of [false,true]){
  const context=await browser.newContext({locale:en?'en-GB':'fr-FR'}),p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));
  for(const fr of guidePaths){
   const route=en?routePairs[fr]:fr;assert(route,'Missing translated route '+fr);await p.setViewportSize({width:390,height:900});assert.equal((await p.goto(origin+route)).status(),200);await ready(p);
   const observed=await state(p);assert.deepEqual(observed,{overflow:false,broken:[],duplicateIds:[],missingAnchors:[]},route);
   assert.equal(await p.locator('.guide-navigation').count(),1);assert.equal(await p.locator('.guide-mobile-contents[open]').count(),0);
   await p.locator('.guide-start a[href="#lecture"]').click();assert.equal(new URL(p.url()).hash,'#lecture');assert(await p.locator('#lecture').evaluate(e=>e===document.activeElement));
   report.routes.push({route,...observed});
  }
  for(const fr of [gift,first,movement])for(const width of [320,390,700,701,768,1024,1440]){
   const route=en?routePairs[fr]:fr;await p.setViewportSize({width,height:900});await p.goto(origin+route);await ready(p);
   assert.deepEqual(await state(p),{overflow:false,broken:[],duplicateIds:[],missingAnchors:[]});
   assert.equal(await p.locator('.guide-mobile-contents').isVisible(),width<=700);assert.equal(await p.locator('.guide-desktop-contents').isVisible(),width>700);
   await p.locator('.guide-start a[href="#sommaire"]').focus();await p.keyboard.press('Enter');
   if(width<=700){await p.locator('.guide-mobile-contents[open]').waitFor();assert.equal(await p.locator('.guide-mobile-contents[open]').count(),1);assert(await p.locator('.guide-mobile-contents summary').evaluate(e=>e===document.activeElement));await p.keyboard.press('Space');assert.equal(await p.locator('.guide-mobile-contents[open]').count(),0);await p.locator('.guide-start a[href="#sommaire"]').click();assert.equal(await p.locator('.guide-mobile-contents[open]').count(),1);}
   else assert(await p.locator('#sommaire').evaluate(e=>e===document.activeElement));
   let axe=null;
   if([390,768,1440].includes(width)){const audit=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();assert.deepEqual(audit.violations,[]);axe=0;}
   if(fr===gift&&[390,768,1440].includes(width)){
    await p.locator('#sommaire').evaluate(e=>e.scrollIntoView({block:'start'}));await p.screenshot({path:`${dir}/${en?'en':'fr'}-contents-${width}.png`});
    await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${dir}/${en?'en':'fr'}-top-${width}.png`});
    await p.locator('.gift-directions').screenshot({path:`${dir}/${en?'en':'fr'}-directions-${width}.png`});
    await p.locator('.guide-examples').first().screenshot({path:`${dir}/${en?'en':'fr'}-models-${width}.png`});
   }
   report.layouts.push({route,width,axe,overflow:false});
  }
  const route=en?routePairs[gift]:gift;await p.setViewportSize({width:390,height:900});await p.goto(origin+route);
  const expectedRefs=['gift-retro','gift-dress','gift-tsuyosa'].flatMap(k=>groups[k].map(([ref])=>ref));
  assert.deepEqual(await p.locator('.guide-example').evaluateAll(es=>es.map(e=>e.dataset.reference)),expectedRefs);
  const directionLinks=await p.locator('.gift-directions a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));assert.equal(directionLinks.length,3);
  for(const href of directionLinks){await p.locator(`.gift-directions a[href="${href}"]`).click();assert.equal(decodeURIComponent(new URL(p.url()).hash),href);}
  assert.equal(await p.locator('[data-compare-group]').count(),3);
  for(const key of ['gift-retro','gift-dress','gift-tsuyosa']){
   await p.goto(origin+route);await p.locator(`[data-compare-group="${key}"]`).click();await p.locator('#catalogue-filters:not([aria-disabled])').waitFor();
   const ids=groups[key].map(([ref])=>data.products.find(w=>w.reference===ref).id);
   assert.equal(new URL(p.url()).pathname,en?'/en/catalogue/':'/catalogue/');assert.equal(new URL(p.url()).searchParams.get('compare'),ids.join(','));
   assert.equal(await p.locator('.comparison-photo').count(),ids.length);
   assert.deepEqual(await p.locator('#catalogue-comparison [data-remove]').evaluateAll(es=>es.map(e=>e.dataset.remove)),ids);
  }
  for(const hash of ['#lecture','#sommaire','#pistes-cadeaux']){
   await p.goto(origin+route+hash);await p.locator(`.language-switch [data-language="${en?'fr':'en'}"]`).click();
   assert.equal(new URL(p.url()).pathname,en?gift:routePairs[gift]);assert.equal(new URL(p.url()).hash,hash);
  }
  report.journeys.push({en,giftReferences:7,comparisonGroups:3,languageAnchors:3,keyboardContents:true,reopenSameHash:true});await context.close();
  const nojs=await browser.newContext({javaScriptEnabled:false,locale:en?'en-GB':'fr-FR',viewport:{width:390,height:900}}),np=await nojs.newPage();
  for(const fr of [gift,first,movement]){
   const route=en?routePairs[fr]:fr;await np.goto(origin+route);await ready(np);assert.deepEqual(await state(np),{overflow:false,broken:[],duplicateIds:[],missingAnchors:[]});
   await np.locator('.guide-start a[href="#lecture"]').click();assert.equal(new URL(np.url()).hash,'#lecture');
   await np.locator('.guide-start a[href="#sommaire"]').click();await np.locator('.guide-mobile-contents summary').focus();await np.keyboard.press('Enter');assert.equal(await np.locator('.guide-mobile-contents[open]').count(),1);
   await np.locator('.guide-mobile-contents a').first().click();assert.notEqual(new URL(np.url()).hash,'#sommaire');
   if(fr===gift){assert.equal(await np.locator('.guide-example').count(),7);assert.equal(await np.locator('.guide-example .merchant-button[href*="bg_ref=bDlTL8AyKb"]').count(),7);assert.equal(await np.locator('[data-compare-group]').count(),3);}
   report.noJavaScript.push({route,read:true,nativeContents:true,anchors:true});
  }
  await nojs.close();
 }
 assert.deepEqual(report.errors,[]);report.pass=true;
}catch(e){report.pass=false;report.failure=e.stack;process.exitCode=1;}finally{await browser.close();await writeFile(dir+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({pass:report.pass,routes:report.routes.length,layouts:report.layouts.length,journeys:report.journeys,noJavaScript:report.noJavaScript.length,errors:report.errors,failure:report.failure}));}
