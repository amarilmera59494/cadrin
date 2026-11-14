import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4351',dir=process.env.QA_OUTPUT||'evidence/comparison/after';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),report={origin,layouts:[],checks:[],errors:[]};
const id=ref=>data.products.find(p=>p.reference===ref).id;
const ids=['NJ0200-50Z','NJ0150-81E','AW0102-13AE'].map(id);
const ready=async p=>{await p.locator('#catalogue-filters:not([aria-disabled])').waitFor();await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.comparison-photo')].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});};
try{
 for(const en of [false,true]){
  const root=en?'/en/catalogue/':'/catalogue/',context=await browser.newContext({locale:en?'en-GB':'fr-FR'}),p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));
  // The browser may deny clipboard permission. Both outcomes are controlled explicitly.
  await context.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text;}}}));
  for(const width of [320,390,768,1024,1440]){
   await p.setViewportSize({width,height:900});await p.goto(origin+root+'?brand=Citizen&compare='+ids.join(',')+'#catalogue-comparison');await ready(p);
   assert.equal(await p.locator('.comparison-insight').count(),3);assert.equal(await p.locator('.comparison-insight[open]').count(),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await p.locator('[data-insight=routine] summary').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-insight=routine]').getAttribute('open'),'');
   const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations,[]);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if([390,1440].includes(width))await p.locator('[data-insight=routine]').screenshot({path:`${dir}/routine-${en?'en':'fr'}-${width}.png`});
   await p.locator('[data-insight=routine] summary').click();await p.locator('#catalogue-comparison').evaluate(e=>e.scrollIntoView({block:'start'}));await p.screenshot({path:`${dir}/${en?'en':'fr'}-${width}.png`});report.layouts.push({en,width,axe:0,overflow:false});
  }
  await p.locator('[data-insight=size] summary').click();assert.match(await p.locator('[data-insight=size]').innerText(),/37.*40/);
  await p.locator('#comparison-differences').check();assert.equal(await p.locator('[data-insight=size]').getAttribute('open'),'');
  await p.locator('#comparison-share').click();const shared=new URL(await p.evaluate(()=>window.__copied));assert.equal(shared.searchParams.get('compare'),ids.join(','));assert.equal(shared.searchParams.has('brand'),false);assert.equal(shared.hash,'#catalogue-comparison');assert.equal(shared.pathname,root);
  const other=await context.newPage();await other.goto(shared.href);await ready(other);assert.equal(await other.locator('.comparison-photo').count(),3);await other.close();
  await p.locator('#catalogue-comparison [data-remove="'+ids[2]+'"]').click();assert.match(await p.locator('[data-insight=budget] summary').innerText(),en?/Same recorded price/:/Même prix/);
  assert(!new URL(p.url()).searchParams.get('compare').includes(ids[2]));await p.locator('#comparison-share').click();assert(!new URL(await p.evaluate(()=>window.__copied)).searchParams.get('compare').includes(ids[2]));
  await p.locator('#catalogue-comparison [data-remove]').first().click();assert(await p.locator('#comparison-insights').isHidden());await p.locator('#comparison-clear').click();assert(await p.locator('#catalogue-comparison').isHidden());assert(await p.locator('#catalogue-count').evaluate(e=>document.activeElement===e));
  await p.goto(origin+root+'?compare='+[id('NJ0200-50Z'),id('A158WEA-1EF')].join(',')+'#catalogue-comparison');await ready(p);await p.locator('[data-insight=size] summary').click();assert.match(await p.locator('[data-insight=size]').innerText(),en?/each set/:/cas par cas/);
  for(const a of await p.locator('.comparison-insight-content>a').all()){const response=await context.request.get(new URL(await a.getAttribute('href'),origin).href);assert.equal(response.status(),200);}
  report.checks.push({en,keyboardDisclosure:true,openStatePreserved:true,share:true,sharedReload:true,removeAndClear:true,rectangularSize:true,guideLinks:true});await context.close();
 }
 const c=await browser.newContext(),p=await c.newPage();await c.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}}}));
 await p.goto(origin+'/catalogue/?compare='+ids.join(','));await ready(p);await p.locator('#comparison-share').click();assert(await p.locator('#comparison-share-url').evaluate(e=>e===document.activeElement&&e.selectionEnd===e.value.length));assert.equal(new URL(await p.locator('#comparison-share-url').inputValue()).searchParams.get('compare'),ids.join(','));
 await p.locator('#catalogue-comparison [data-remove]').first().click();assert(await p.locator('#comparison-share-fallback').isHidden());assert.equal(await p.locator('#comparison-share-url').inputValue(),'');report.checks.push({clipboardFallback:true,staleShareCleared:true});await c.close();
 const slow=await browser.newContext(),sp=await slow.newPage();await slow.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>new Promise((_resolve,reject)=>{window.__rejectCopy=reject;})}}));
 await sp.goto(origin+'/catalogue/?compare='+ids.join(','));await ready(sp);await sp.locator('#comparison-share').click();await sp.locator('#comparison-clear').click();await sp.evaluate(()=>window.__rejectCopy(Error('denied later')));assert(await sp.locator('#comparison-share-fallback').isHidden());report.checks.push({lateClipboardRejection:true});await slow.close();
 assert.deepEqual(report.errors,[]);report.pass=true;
}catch(e){report.failure=e.stack;report.pass=false;throw e;}finally{await browser.close();await writeFile(dir+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
