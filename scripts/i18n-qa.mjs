import {destinations} from '../src/data/destinations.ts';
const production=process.env.SITE_STAGE==='production';
const expectedRobots=production?'index, follow':'noindex, nofollow';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
process.env.TEMP=process.env.TMP=path.resolve('.tmp');
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4323';
const dir=process.env.QA_OUTPUT||'evidence/international/browser';await mkdir(dir,{recursive:true});
const routes=JSON.parse(await readFile(`evidence/cadrin/${production?'production':'preview'}-routes.json`,'utf8')).filter(r=>r.startsWith('/en/')&&!/\/catalogue\/\d+\//.test(r));
const core=['/en/','/en/watch-finder/','/en/guides/choosing-your-first-watch/','/en/watches/casio-f91w/','/en/guides/automatic-quartz-or-solar/','/en/guides/'];
const report={origin,testedAt:new Date().toISOString(),viewports:[],links:[],interactions:[],noJS:[],errors:[],failures:[]};
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({locale:'en-GB',deviceScaleFactor:1});
const page=await context.newPage(),links=new Set();
const check=(name,pass)=>{report.interactions.push({name,pass:!!pass});if(!pass)report.failures.push(name)};
page.on('pageerror',e=>report.errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')report.errors.push({message:m.text(),location:m.location(),page:page.url()})});
try{
 for(const width of [1440,390,320,768]){
  await page.setViewportSize({width,height:900});
  for(const route of width===1440||width===390?routes:core){
   const response=await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,robots:document.querySelector('meta[name=robots]')?.content,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),french:[...document.querySelectorAll('h1,h2,h3,label,button,option,dt,caption')].map(e=>e.textContent).filter(t=>/sélect|modèles|préférence|critères|Boîtier|Mouvement|réinitialiser|Consulter/i.test(t)),links:[...document.querySelectorAll('a[href]')].map(a=>a.href)}));
   state.links.filter(l=>l.startsWith(origin)).forEach(l=>links.add(l));delete state.links;
   const axe=width===390||width===1440?(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})):[];
   report.viewports.push({route,width,status:response.status(),...state,axe});
   if(response.status()!==200||state.lang!=='en'||state.overflow||state.h1!==1||state.robots!==expectedRobots||state.broken.length||state.french.length||axe.length)report.failures.push(`viewport:${route}:${width}`);
   if(core.includes(route)&&(width===390||width===1440)){const name=route==='/en/'?'home':route.split('/').filter(Boolean).slice(1).join('-');await page.screenshot({path:`${dir}/${name}-${width}.png`,fullPage:true});await page.screenshot({path:`${dir}/${name}-${width}-top.png`});}
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/en/');
 await page.keyboard.press('Tab');check('skip-first',await page.locator('.skip').evaluate(e=>e===document.activeElement));await page.keyboard.press('Enter');check('skip-main',await page.locator('#main').evaluate(e=>e===document.activeElement));
 const menu=page.locator('.menu-toggle');await menu.focus();await page.keyboard.press('Enter');check('menu-opens',await menu.getAttribute('aria-expanded')==='true');await page.keyboard.press('Escape');check('menu-escape',await menu.getAttribute('aria-expanded')==='false'&&await menu.evaluate(e=>e===document.activeElement));
 await page.goto(origin+'/en/watch-finder/?budget=350&mouvement=Automatique&comparer=citizen-tsuyosa-nj0150-81e,seiko-srpe55k1');
 check('english-filter-count',await page.locator('#models .model:visible').count()===3);
 check('english-count-copy',(await page.locator('#matches').textContent())==='3 watches');
 check('comparison-restored',await page.locator('.pick input:checked').count()===2);
 await page.locator('.language-switch [data-language=fr]').click();await page.waitForLoadState('load');
 check('switch-keeps-filters',new URL(page.url()).pathname==='/trouver-ma-montre/'&&new URL(page.url()).searchParams.get('budget')==='350'&&await page.locator('#models .model:visible').count()===3);
 await page.locator('.language-switch [data-language=en]').click();await page.waitForLoadState('load');check('switch-back-keeps-comparison',await page.locator('.pick input:checked').count()===2);
 await page.locator('#filter-toggle').click();await page.locator('[name=recherche]').fill('no-such-reference');check('empty-state',await page.locator('#no-matches').isVisible());await page.getByRole('button',{name:'Show all watches'}).click();await page.waitForFunction(()=>document.querySelector('#matches').textContent==='6 watches');
 check('empty-reset',await page.locator('#models .model:visible').count()===6);
 await page.locator('#sort-order').selectOption('prix');check('price-sort',await page.locator('#models .model').first().getAttribute('data-id')==='casio-f91w');
 await page.locator('#sort-order').selectOption('largeur');check('tempus-width-sort',await page.locator('#models .model').nth(1).getAttribute('data-id')==='casio-f91w');check('sort-in-url',new URL(page.url()).searchParams.get('tri')==='largeur');
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('Denied')}}})});await page.locator('#share-finder').click();check('share-fallback',await page.locator('#share-fallback').isVisible()&&await page.locator('#share-fallback input').inputValue()===page.url());
 await page.goto(origin+'/en/watch-finder/?comparer=casio-f91w,citizen-tsuyosa-nj0150-81e,seiko-srpe55k1');check('three-max',await page.locator('.pick input:disabled').count()===3);
 await page.locator('[data-remove=casio-f91w]').click();check('remove-reenables',await page.locator('.pick input:disabled').count()===0);
 await page.goto(origin+'/en/selections/');await page.getByRole('link',{name:'Explore the three watches'}).click();await page.waitForLoadState('load');await page.getByRole('link',{name:'View watch details for Casio'}).click();await page.waitForLoadState('load');
 const merchant=page.getByRole('link',{name:'View at Tempus Shop'});const href=await merchant.getAttribute('href');check('exact-english-merchant',href===destinations['casio-f91w'].englishUrl);
 let outgoing;await page.route('https://tempusshop.com/**',r=>{if(r.request().isNavigationRequest())outgoing=r.request().url();return r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Navigation test</title><link rel="icon" href="data:,"><p>Verified navigation interception</p>'})});await merchant.click();check('merchant-navigation',outgoing===href);await page.goto(origin+'/en/');await page.unroute('https://tempusshop.com/**');
 for(const url of links){const u=new URL(url),r=await context.request.get(u.origin+u.pathname),html=await r.text();const anchor=!u.hash||html.includes(`id="${decodeURIComponent(u.hash.slice(1))}"`);report.links.push({path:u.pathname,hash:u.hash,status:r.status(),anchor});if(r.status()!==200||!anchor)report.failures.push('link:'+u.pathname+u.hash);}
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const staticPage=await noJS.newPage();
 for(const route of routes){await staticPage.goto(origin+route);const pass=await staticPage.locator('html').getAttribute('lang')==='en'&&await staticPage.locator('#primary-navigation').isVisible()&&await staticPage.locator('.language-switch [data-language=fr]').isVisible()&&await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);report.noJS.push({route,pass});if(!pass)report.failures.push('noJS:'+route);}
 await staticPage.goto(origin+'/en/watch-finder/');check('noJS-all-models',await staticPage.locator('#models .model').count()===6);check('noJS-full-comparison',await staticPage.locator('#comparaison [data-col]:visible').count()>6);await noJS.close();
 const fresh=await browser.newContext({locale:'en-US'});const visitor=await fresh.newPage();await visitor.goto(origin+'/');check('suggestion-for-english',await visitor.locator('.language-suggestion').isVisible());check('no-forced-redirect',new URL(visitor.url()).pathname==='/');await visitor.locator('.language-suggestion button').click();await visitor.reload();check('dismissal-persists',await visitor.locator('.language-suggestion').isHidden());await fresh.close();
 const blocked=await browser.newContext({locale:'en-GB'});await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked')}})});const bp=await blocked.newPage();await bp.goto(origin+'/');await bp.locator('.language-switch [data-language=en]').click();check('storage-blocked-navigation',new URL(bp.url()).pathname==='/en/');await blocked.close();
}catch(e){report.failures.push(e.stack)}finally{await browser.close();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2))}
console.log(JSON.stringify({viewports:report.viewports.length,links:report.links.length,noJS:report.noJS.length,errors:report.errors,failures:report.failures}));assert.equal(report.failures.length+report.errors.length,0);
