import {destinations} from '../src/data/destinations.ts';
const production=process.env.SITE_STAGE==='production';
const expectedRobots=production?'index, follow':'noindex, nofollow';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
const temp=path.resolve('.tmp');await mkdir(temp,{recursive:true});process.env.TEMP=temp;process.env.TMP=temp;
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4323';
const dir=process.env.QA_OUTPUT || 'evidence/cadrin/final';await mkdir(dir,{recursive:true});
const core=['/','/selections/trois-montres-au-quotidien/','/guides/choisir-premiere-montre/','/montres/casio-f91w/','/guides/automatique-quartz-solaire/','/guides/'];
const routes=[...new Set([...JSON.parse(await readFile(`evidence/cadrin/${production?'production':'preview'}-routes.json`,'utf8')).filter(r=>!r.startsWith('/en/')&&!/\/catalogue\/\d+\//.test(r)),...core,'/trouver-ma-montre/','/guides/offrir-une-montre/','/guides/montres-par-budget/','/guides/bambino-tsuyosa-seiko-5/','/guides/citizen-eco-drive-ou-tsuyosa/','/montres/citizen-rainell-em1201-52l/','/montres/citizen-tsuyosa-nj0150-81e/','/montres/orient-bambino-ra-ac0m04y/','/selections/','/guides/','/montres/seiko-srpe55k1/','/montres/citizen-aw0102-13ae/',...(!production?['/montres/seiko-srpe55/','/montres/citizen-aw1231/']:[]),'/notre-methode/'])];
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={browser:browser.version(),testedAt:new Date().toISOString(),origin,viewports:[],interactions:[],noJavaScript:[],links:[],errors:[],failures:[]};
const context=await browser.newContext({deviceScaleFactor:1});const page=await context.newPage();const allLinks=new Set();
page.on('pageerror',e=>report.errors.push({page:page.url(),error:e.message}));
page.on('console',m=>{if(m.type()==='error')report.errors.push({page:page.url(),console:m.text()})});
function check(name,value,detail){report.interactions.push({name,pass:!!value,detail});if(!value)report.failures.push(name)}
try{
 for(const width of [1440,390,320,360,768,1920]){
  await page.setViewportSize({width,height:width<700?844:1000});
  for(const route of (width===1440||width===390?routes:core)){
   const response=await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);
   await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))});
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),h1:document.querySelectorAll('h1').length,noindex:document.querySelector('meta[name=robots]')?.content,links:[...document.querySelectorAll('a[href]')].map(a=>a.href)}));
   state.links.filter(l=>l.startsWith(origin)).forEach(l=>allLinks.add(l));delete state.links;
   const result={route,width,status:response.status(),...state};
   if(width===1440||width===390){
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    result.axeViolations=audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
    if(core.includes(route)){const slug=route==='/'?'accueil':route.split('/').filter(Boolean).join('-');await page.screenshot({path:`${dir}/${slug}-${width}.png`,fullPage:true});await page.screenshot({path:`${dir}/${slug}-${width}-top.png`});}
   }
   report.viewports.push(result);if(result.status!==200||state.overflow||state.brokenImages.length||state.h1!==1||state.noindex!==expectedRobots||result.axeViolations?.length)report.failures.push(`viewport:${width}:${route}`);
   console.log(`${width} ${route}: ${result.status}, overflow=${state.overflow}, axe=${result.axeViolations?.length??'—'}`);
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/');await page.keyboard.press('Tab');check('skip-first',await page.locator('.skip').evaluate(e=>e===document.activeElement));await page.keyboard.press('Enter');check('skip-main',await page.locator('#main').evaluate(e=>e===document.activeElement));
 const menu=page.locator('.menu-toggle');await menu.focus();await page.keyboard.press('Enter');check('menu-keyboard-open',await menu.getAttribute('aria-expanded')==='true');await page.keyboard.press('Tab');check('menu-focus-link',await page.locator('#primary-navigation a').first().evaluate(e=>e===document.activeElement));await page.keyboard.press('Escape');check('menu-escape-restores-focus',await menu.getAttribute('aria-expanded')==='false'&&await menu.evaluate(e=>e===document.activeElement));
 await menu.click();await page.getByRole('navigation',{name:'Navigation principale'}).getByRole('link',{name:'Sélections',exact:true}).click();check('menu-navigation',new URL(page.url()).pathname==='/selections/');
 await page.getByRole('link',{name:'Explorer les trois montres'}).click();await page.locator('[name=movement]').selectOption('Automatique');check('filter-automatic',await page.locator('[data-product-row]:visible').count()===1);
 await page.locator('[name=size]').selectOption('unknown');check('filter-empty',await page.locator('[data-product-row]:visible').count()===0&&await page.locator('#empty').isVisible());await page.getByRole('button',{name:'Réinitialiser les filtres',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#result-count').textContent.startsWith('3'));check('empty-reset',await page.locator('[data-product-row]:visible').count()===3);
 await page.locator('[name=use]').selectOption('bureau');check('filter-office',await page.locator('[data-product-row]:visible').count()===1);await page.getByRole('button',{name:'Tout réinitialiser'}).click();await page.waitForFunction(()=>document.querySelector('#result-count').textContent.startsWith('3'));check('filter-reset-url',!new URL(page.url()).search);
 await page.goto(origin+core[1]+'?movement=Quartz#choisir');check('filter-deep-link',await page.locator('[data-product-row]:visible').count()===1);await page.locator('[data-product-row]:visible').getByRole('link',{name:'Découvrir la fiche'}).click();check('journey-watch',new URL(page.url()).pathname==='/montres/casio-f91w/');
 await page.goBack();check('back-to-filtered-selection',new URL(page.url()).searchParams.get('movement')==='Quartz'&&await page.locator('[data-product-row]:visible').count()===1);
 await page.locator('[data-product-row]:visible').getByRole('link',{name:'Découvrir la fiche'}).click();
 const merchant=page.getByRole('link',{name:'Acheter chez Tempus'});check('merchant-exact-url',await merchant.getAttribute('href')===destinations['casio-f91w'].url);check('affiliate-link-sponsored',(await merchant.getAttribute('rel')||'').includes('sponsored'));
 // Observe an ordinary click up to the actual navigation request, without submitting anything externally.
 let destination=null;await page.route('https://tempusshop.com/**',route=>{destination=route.request().url();return route.fulfill({status:200,contentType:'text/html',body:'<h1>Destination interceptée par le test local</h1>'})});await merchant.click();check('journey-merchant-click',destination===destinations['casio-f91w'].url);await page.unroute('https://tempusshop.com/**');
 await page.goto(origin+core[2]);await page.locator('.toc a[href="#taille"]').click();check('guide-anchor',new URL(page.url()).hash==='#taille');await page.locator('.table-scroll').focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.table-scroll').scrollLeft>0);check('table-keyboard-scroll',await page.locator('.table-scroll').evaluate(e=>e.scrollLeft>0));
 await page.getByRole('link',{name:'Explorer la sélection',exact:true}).click();check('guide-return-selection',new URL(page.url()).pathname===core[1]);
 await page.emulateMedia({reducedMotion:'reduce'});check('reduced-motion',await page.evaluate(()=>[...document.querySelectorAll('*')].every(e=>{const s=getComputedStyle(e);return s.animationName==='none'&&s.transitionDuration.split(',').every(t=>parseFloat(t)===0)})));await page.emulateMedia({reducedMotion:'no-preference'});
 for(const route of core){await page.setViewportSize({width:1280,height:1000});await page.goto(origin+route);await page.evaluate(()=>{document.documentElement.style.zoom='2'});check('zoom-200:'+route,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.evaluate(()=>{document.documentElement.style.zoom=''})}
 for(const href of allLinks){const u=new URL(href);const response=await context.request.get(u.origin+u.pathname);const html=await response.text();const anchor=!u.hash||html.includes(`id="${decodeURIComponent(u.hash.slice(1))}"`);report.links.push({url:u.pathname+u.hash,status:response.status(),anchor});if(response.status()!==200||!anchor)report.failures.push('link:'+u.pathname+u.hash)}
 const response404=await context.request.get(origin+'/inexistante-cadrin/');check('hosting-404',response404.status()===404);check('404-branded',(await response404.text()).includes('Reprenons le fil'));
 check('stage-header',production?!(await context.request.get(origin+'/')).headers()['x-robots-tag']:(await context.request.get(origin+'/')).headers()['x-robots-tag']==='noindex, nofollow');
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();
 for(const route of routes){await np.goto(origin+route);const state={route,h1:await np.locator('h1').isVisible(),navigation:await np.locator('#primary-navigation a').first().isVisible(),overflow:await np.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};if(route===core[1]){state.products=await np.locator('[data-product-row]:visible').count();state.filtersHidden=await np.locator('#filters').isHidden()}report.noJavaScript.push(state);if(!state.h1||!state.navigation||state.overflow||state.products!==undefined&&state.products!==3)report.failures.push('nojs:'+route)}
 await nojs.close();
}catch(error){report.failures.push(error.stack)}finally{await browser.close();await writeFile(`${dir}/browser-report.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({failures:report.failures,errors:report.errors,viewports:report.viewports.length,links:report.links.length}));if(report.failures.length||report.errors.length)process.exitCode=1;
