import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {routePairs} from '../src/lib/i18n.ts';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4323',dir=process.env.QA_OUTPUT||'evidence/selection-audit/after';await mkdir(dir,{recursive:true});
const data=JSON.parse(await readFile('src/data/tempus-catalogue.json','utf8')),visuals=JSON.parse(await readFile('src/data/guide-visuals.json','utf8')),byId=new Map(data.products.map(p=>[p.id,p]));
const report={viewports:[],checks:[],errors:[],guides:[],noJS:[]};
const check=(name,pass)=>{report.checks.push({name,pass:!!pass});assert.ok(pass,name)};
const browser=await chromium.launch({channel:'chrome'});
const ready=async page=>{await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode()}catch{}}));});};
const loaded=page=>page.locator('#catalogue-filters:not([aria-disabled])').waitFor();
try{
 for(const en of [false,true]){
 const c=await browser.newContext({locale:en?'en-GB':'fr-FR',viewport:{width:390,height:900}}),p=await c.newPage();p.on('pageerror',e=>report.errors.push(e.message));
 const root=en?'/en/catalogue/':'/catalogue/';
 for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});await p.goto(origin+root+'?dial=Bleu&strap=Acier&collection=best&budget=400');await loaded(p);await ready(p);
 const ids=await p.locator('.catalogue-card').evaluateAll(xs=>xs.map(x=>x.dataset.id));check('combined-'+en+'-'+width,ids.length>0&&ids.every(id=>{const x=byId.get(id);return x.dialColors.includes('Bleu')&&x.strapFamily==='Acier'&&x.bestseller&&x.price<=400}));check('budget-restored-'+en+'-'+width,await p.locator('[name=budget]').inputValue()==='400');
 const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),axe=(await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));report.viewports.push({en,width,overflow,axe});check('layout-accessibility-'+en+'-'+width,!overflow&&!axe.length);
 if(!en&&[390,1440].includes(width)){await p.screenshot({path:dir+'/catalogue-'+width+'.png',fullPage:true});await p.locator('#catalogue-cards').scrollIntoViewIfNeeded();await p.screenshot({path:dir+'/catalogue-cards-'+width+'.png'});}
 }
 await p.setViewportSize({width:390,height:900});await p.locator('#catalogue-active button').first().click();check('chip-remove-'+en,await p.locator('[name=budget]').inputValue()==='');check('chip-focus-'+en,await p.locator('[name=budget]').evaluate(e=>e===document.activeElement));
 await p.locator('[type=reset]').click();await p.waitForFunction(()=>document.querySelectorAll('.catalogue-card').length===48);await p.locator('.catalogue-advanced').evaluate(e=>e.open=true);await p.locator('[name=size]').selectOption('36');check('size-filter-'+en,(await p.locator('.catalogue-card').evaluateAll(xs=>xs.map(x=>x.dataset.id))).every(id=>parseFloat(byId.get(id).caseSize.replace(',','.'))<=36));
 await p.goto(origin+root+'?feature=GPS');await loaded(p);check('integrated-gps-'+en,(await p.locator('#catalogue-cards').innerText()).includes('025115')&&!(await p.locator('#catalogue-cards').innerText()).includes('GBD-200'));
 await p.goto(origin+root+'?q=F91W1YEG');await loaded(p);check('compact-reference-'+en,await p.locator('.catalogue-card').count()===1);const summary=p.locator('.catalogue-details summary');await summary.focus();await p.keyboard.press('Enter');check('details-keyboard-'+en,await p.locator('.catalogue-details').evaluate(e=>e.open));await p.locator('.catalogue-pick input').check();check('comparison-dimensions-'+en,(await p.locator('#catalogue-comparison-table').innerText()).includes('33,20'));
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('Denied')}}}));await p.locator('#catalogue-share').click();check('share-fallback-'+en,(await p.locator('#catalogue-share-status').innerText()).length>20);
 for(const id of Object.keys(visuals)){
 const route=en?routePairs['/guides/'+id+'/']:'/guides/'+id+'/';await p.goto(origin+route);await ready(p);
 const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),markers:document.body.innerText.includes('::montres['),photos:document.querySelectorAll('main img').length,examples:document.querySelectorAll('.guide-example').length,affiliate:[...document.querySelectorAll('.guide-example a')].every(a=>a.rel.includes('sponsored')&&new URL(a.href).searchParams.get('bg_ref')==='bDlTL8AyKb')}));report.guides.push({en,route,...state});check('illustrated-guide-'+route,!state.overflow&&!state.broken.length&&!state.markers&&state.photos>0&&state.affiliate);
 if(!en&&['montres-par-budget','g-shock-montre-jeune','montre-connectee-gps-bluetooth','squelette-coeur-ouvert-tourbillon'].includes(id))for(const width of [390,1440]){await p.setViewportSize({width,height:900});await ready(p);await p.screenshot({path:dir+'/'+id+'-'+width+'.png',fullPage:true});await p.locator('.guide-examples').first().evaluate(e=>e.scrollIntoView({block:'start'}));await p.screenshot({path:dir+'/'+id+'-'+width+'-cards.png'});const axe=(await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>v.id);check('guide-axe-'+id+'-'+width,!axe.length);await p.setViewportSize({width:390,height:900});}
 }
 await c.close();const nc=await browser.newContext({javaScriptEnabled:false,locale:en?'en-GB':'fr-FR',viewport:{width:390,height:900}}),np=await nc.newPage();await np.goto(origin+(en?'/en/guides/watches-by-budget/':'/guides/montres-par-budget/'));await ready(np);const examples=await np.locator('.guide-example').count();check('static-guide-'+en,examples===9);report.noJS.push({en,examples});await nc.close();
 }
 assert.equal(report.errors.length,0);
}finally{await browser.close();await writeFile(dir+'/report.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({viewports:report.viewports.length,checks:report.checks.length,guides:report.guides.length,noJS:report.noJS.length,errors:report.errors}));
