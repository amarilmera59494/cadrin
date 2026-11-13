import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const temp=path.resolve('.tmp');await mkdir(temp,{recursive:true});process.env.TEMP=temp;process.env.TMP=temp;
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4321';
const pass=process.env.QA_PASS||'final';const dir=`evidence/${pass}`;await mkdir(dir,{recursive:true});
const routes=['/concepts/',...['revue','mesure','allure'].flatMap(d=>[`/concepts/${d}/`,`/concepts/${d}/guide/`])];
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={browser:browser.version(),date:new Date().toISOString(),origin,viewports:[],interactions:[],noJavaScript:[],links:[],errors:[]};
const context=await browser.newContext({deviceScaleFactor:1});const page=await context.newPage();
page.on('pageerror',e=>report.errors.push({page:page.url(),error:e.message}));
page.on('console',m=>{if(m.type()==='error')report.errors.push({page:page.url(),console:m.text()})});
const allLinks=new Set();
for(const width of [1440,768,390,360]){
 await page.setViewportSize({width,height:width<600?844:1000});
 for(const route of routes){
  const response=await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);
  await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))});
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),h1:document.querySelectorAll('h1').length,noindex:document.querySelector('meta[name="robots"]')?.content,links:[...document.querySelectorAll('a[href]')].map(a=>a.href),font:getComputedStyle(document.querySelector('h1')).fontFamily}));
  state.links.filter(l=>l.startsWith(origin)).forEach(l=>allLinks.add(l));delete state.links;
  const result={route,width,status:response.status(),...state};
  if(width===1440||width===390){
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
   result.axeViolations=audit.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
   const slug=route.replace(/^\//,'').replace(/\/$/,'').replaceAll('/','-');
   await page.screenshot({path:`${dir}/${slug}-${width}.png`,fullPage:true});
   await page.screenshot({path:`${dir}/${slug}-${width}-top.png`});
  }
  report.viewports.push(result);console.log(`${width} ${route}: HTTP ${result.status}, overflow ${result.overflow}, images ${result.brokenImages.length}, axe ${result.axeViolations?.length??'—'}`);
 }
}
for(const route of routes){
 await page.setViewportSize({width:390,height:844});await page.goto(origin+route);await page.keyboard.press('Tab');const skipFocused=await page.locator('.skip').evaluate(e=>e===document.activeElement);await page.keyboard.press('Enter');
 const result={route,skipFocused};
 if(route!=='/concepts/'){
  const menu=page.locator('.mobile-nav');await menu.locator('summary').focus();await page.keyboard.press('Enter');result.menuKeyboardOpen=await menu.evaluate(e=>e.open);await page.keyboard.press('Escape');result.menuEscapeClose=await menu.evaluate(e=>!e.open);
  if(!route.includes('guide')){const detail=page.locator('.product-details').first();await detail.locator('summary').focus();await page.keyboard.press('Enter');result.productDisclosure=await detail.evaluate(e=>e.open);}
  else{await page.locator('.toc a[href="#taille"]').click();result.guideAnchor=new URL(page.url()).hash==='#taille';}
 }
 await page.emulateMedia({reducedMotion:'reduce'});result.reducedMotion=await page.evaluate(()=>[...document.querySelectorAll('*')].every(e=>{const s=getComputedStyle(e);return s.animationName==='none'&&s.transitionDuration.split(',').every(t=>parseFloat(t)===0)}));await page.emulateMedia({reducedMotion:'no-preference'});
 report.interactions.push(result);
}
await page.goto(origin+'/concepts/mesure/');await page.selectOption('[name=movement]','Automatique');report.interactions.push({filter:'automatic',visible:await page.locator('[data-product-row]:visible').count(),expected:2});await page.selectOption('[name=size]','small');report.interactions.push({filter:'empty',visible:await page.locator('[data-product-row]:visible').count(),emptyVisible:await page.locator('#empty').isVisible(),expected:0});await page.getByRole('button',{name:'Tout réinitialiser'}).click();await page.waitForFunction(()=>document.querySelector('#result-count').textContent.startsWith('6'));report.interactions.push({filter:'reset',visible:await page.locator('[data-product-row]:visible').count(),expected:6});await page.selectOption('[name=use]','bureau');report.interactions.push({filter:'office',visible:await page.locator('[data-product-row]:visible').count(),expected:1});
for(const href of allLinks){const u=new URL(href);const response=await context.request.get(u.origin+u.pathname);let anchor=true;if(u.hash){const html=await response.text();anchor=html.includes(`id="${decodeURIComponent(u.hash.slice(1))}"`);}report.links.push({url:u.pathname+u.hash,status:response.status(),anchor});}
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();
for(const route of routes){await np.goto(origin+route);const entry={route,h1Visible:await np.locator('h1').isVisible(),mainTextLength:(await np.locator('main').innerText()).length};if(!route.includes('guide')&&route!=='/concepts/')entry.products=await np.locator('[data-product-row]:visible').count();if(route!=='/concepts/'){await np.locator('.mobile-nav summary').click();entry.nativeMenuOpen=await np.locator('.mobile-nav').evaluate(e=>e.open)}report.noJavaScript.push(entry);}
await browser.close();
await writeFile(`${dir}/browser-report.json`,JSON.stringify(report,null,2));
const failures=report.viewports.filter(v=>v.overflow||v.status!==200||v.brokenImages.length||v.h1!==1||v.axeViolations?.length);const badLinks=report.links.filter(l=>l.status!==200||!l.anchor);const badInteractions=report.interactions.filter(i=>Object.values(i).includes(false)||('expected'in i&&i.visible!==i.expected));const badNoJs=report.noJavaScript.filter(i=>!i.h1Visible||i.mainTextLength<500||i.nativeMenuOpen===false||(i.products!==undefined&&i.products!==6));
console.log(JSON.stringify({viewportFailures:failures.length,badLinks,badInteractions,badNoJs,consoleErrors:report.errors.length,report:`${dir}/browser-report.json`}));if(failures.length||badLinks.length||badInteractions.length||badNoJs.length||report.errors.length)process.exitCode=1;
