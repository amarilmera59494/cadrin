import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {filterCatalogue} from '../src/lib/tempus-catalogue.ts';
const data=JSON.parse(await readFile('src/data/tempus-catalogue.json','utf8'));
const base=process.env.QA_ORIGIN||'http://127.0.0.1:4323',dir=process.env.QA_OUTPUT||'evidence/tempus-catalogue/browser';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),report={viewports:[],interactions:[],noJS:[],errors:[]};
const check=(name,pass)=>{report.interactions.push({name,pass});assert.ok(pass,name)};
try{
 for(const en of [false,true]){
  const root=en?'/en/catalogue/':'/catalogue/';const context=await browser.newContext({locale:en?'en-GB':'fr-FR'}),page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});await page.goto(base+root+'?brand=Seiko&budget=500');await page.locator('#catalogue-filters:not([aria-disabled])').waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),axe=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
   const broken=await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));report.viewports.push({en,width,overflow,axe,broken});
   if([390,1440].includes(width)){await page.screenshot({path:`${dir}/${en?'en':'fr'}-catalogue-${width}.png`,fullPage:true});await page.screenshot({path:`${dir}/${en?'en':'fr'}-catalogue-${width}-top.png`});await page.locator('#catalogue-cards').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/${en?'en':'fr'}-cards-${width}.png`});}
   assert.ok(!overflow&&!axe.length&&!broken.length,`viewport ${en} ${width}`);
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base+root);await page.locator('#catalogue-filters:not([aria-disabled])').waitFor({state:'visible'});
  const next=page.locator('#catalogue-pagination a').last();await next.click();check('pagination-'+en,new URL(page.url()).searchParams.get('page')==='2');check('page-focus-'+en,await page.locator('#catalogue-count').evaluate(e=>e===document.activeElement));
  await page.locator('[name=q]').fill('NJ0150-81E');await page.waitForFunction(()=>document.querySelectorAll('.catalogue-card').length===1);check('exact-ref-'+en,(await page.locator('.catalogue-card').innerText()).includes('NJ0150-81E'));
  const href=await page.locator('.catalogue-cta').getAttribute('href');check('affiliate-product-'+en,new URL(href).searchParams.get('bg_ref')==='bDlTL8AyKb'&&new URL(href).pathname==='/products/citizen-tsuyosa-noir-nj0150-81e');
  await page.locator('[name=q]').fill('does-not-exist-123456');await page.locator('#catalogue-empty').waitFor({state:'visible'});check('empty-'+en,await page.locator('.catalogue-card').count()===0);
  await page.locator('[type=reset]').click();await page.waitForFunction(()=>document.querySelectorAll('.catalogue-card').length===48);
  const picks=page.locator('.catalogue-pick input');for(let i=0;i<3;i++)await picks.nth(i).check();check('cap-three-'+en,await picks.nth(3).isDisabled());const ids=new URL(page.url()).searchParams.get('compare');
  await page.locator('[name=brand]').selectOption('Citizen');check('persistent-comparison-'+en,await page.locator('#catalogue-comparison-table thead th').count()===4);check('comparison-query-'+en,new URL(page.url()).searchParams.get('compare')===ids);
  await page.reload();await page.locator('#catalogue-filters:not([aria-disabled])').waitFor({state:'visible'});check('restore-comparison-'+en,await page.locator('#catalogue-comparison-table thead th').count()===4);
  await page.locator('#catalogue-comparison-table button[data-remove]').first().click();check('remove-'+en,await page.locator('#catalogue-comparison-table thead th').count()===3);
  await page.locator('.catalogue-advanced').evaluate(e=>e.open=true);await page.locator('[name=movement]').selectOption('Solaire');await page.locator('[name=budget]').selectOption('500');
  const expected=filterCatalogue(data.products,{q:'',brand:'Citizen',movement:'Solaire',budget:'500',category:'',order:'',sort:''}).length;check('combined-filters-'+en,(await page.locator('#catalogue-count').innerText()).startsWith(String(expected)));
  await page.locator('[name=sort]').selectOption('price');const orderedIds=await page.locator('.catalogue-card').evaluateAll(cards=>cards.map(c=>c.dataset.id));const orderedPrices=orderedIds.map(id=>data.products.find(p=>p.id===id).price);check('sort-'+en,orderedPrices.length>0&&orderedPrices.every((price,i)=>i===0||price>=orderedPrices[i-1]));
  await page.goBack();check('history-restores-'+en,await page.locator('[name=sort]').inputValue()==='');
  await page.locator('[name=category]').selectOption('Homme');check('listed-category-filter-'+en,await page.locator('.catalogue-card').count()===Math.min(48,filterCatalogue(data.products,{q:'',brand:'Citizen',movement:'Solaire',budget:'500',category:'Homme',order:'',sort:''}).length));
  await page.locator('.language-switch [data-language='+ (en?'fr':'en') +']').click();await page.locator('#catalogue-filters:not([aria-disabled])').waitFor();check('switch-preserves-changed-filters-'+en,await page.locator('[name=category]').inputValue()==='Homme'&&await page.locator('[name=budget]').inputValue()==='500');check('switch-preserves-comparison-'+en,await page.locator('#catalogue-comparison-table thead th').count()===3);
  await context.close();
  const nojs=await browser.newContext({javaScriptEnabled:false,locale:en?'en-GB':'fr-FR',viewport:{width:390,height:844}}),np=await nojs.newPage();await np.goto(base+root);assert.equal(await np.locator('.catalogue-card').count(),48);assert.ok(await np.locator('#catalogue-filters').isHidden());await np.locator('#catalogue-pagination a').last().click();assert.equal(new URL(np.url()).pathname,root+'2/');assert.equal(await np.locator('.catalogue-card').count(),48);report.noJS.push({en,pagination:true,cards:48});await nojs.close();
 }
 const failureContext=await browser.newContext(),failurePage=await failureContext.newPage();await failurePage.route('**/catalogue.json',r=>r.abort());await failurePage.goto(base+'/catalogue/');await failurePage.locator('#catalogue-error').waitFor({state:'visible'});check('fetch-failure-keeps-static-cards',await failurePage.locator('.catalogue-card').count()===48);await failureContext.close();
 assert.equal(report.errors.length,0);
}finally{await browser.close();await writeFile(dir+'/report.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({viewports:report.viewports.length,interactions:report.interactions.length,noJS:report.noJS.length,errors:report.errors}));
