import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};

const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4340';
const folder=process.env.QA_OUTPUT||'evidence/quality/qa';
await fs.mkdir(folder,{recursive:true});
const report={origin,checks:[],layouts:[],screenshots:[],errors:[]};
const browser=await chromium.launch({channel:'chrome'});
const id=ref=>data.products.find(p=>p.reference===ref).id;
const gshocks=[id('GA-2100-1A1ER'),id('GA-2100-1AER')];
const tsuyosa=id('NJ0150-81E');
const ready=async page=>{
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
};
try{
 const context=await browser.newContext({locale:'fr-FR',viewport:{width:390,height:844}}),page=await context.newPage();
 page.on('pageerror',error=>report.errors.push(error.message));
 await page.goto(origin+'/catalogue/?brand=Casio&q=GA-2100');
 const recover=page.locator('[data-recovery-key=brand]');await recover.waitFor();
 assert.equal(await page.locator('.catalogue-card').count(),0);
 assert.equal(await page.locator('#catalogue-pagination').isVisible(),false);
 assert.equal(await page.locator('select[name=brand]').inputValue(),'Casio');
 await recover.focus();await page.keyboard.press('Enter');
 assert.ok(await page.locator('.catalogue-card').count()>0);
 assert.equal(await page.locator('input[name=q]').inputValue(),'GA-2100');
 assert.equal(await page.locator('select[name=brand]').inputValue(),'');
 assert.equal(await page.locator('#catalogue-count').evaluate(e=>document.activeElement===e),true);
 await page.goBack();await recover.waitFor();
 assert.equal(await page.locator('select[name=brand]').inputValue(),'Casio');
 report.checks.push('Empty search: exact filter recovery, keyboard activation, focus restoration and browser Back');

 await page.goto(origin+'/catalogue/?compare='+gshocks.join(',')+'#catalogue-comparison');
 await page.locator('.comparison-photo').first().waitFor();
 await page.waitForFunction(()=>document.activeElement?.id==='catalogue-comparison');
 assert.equal(await page.locator('.comparison-photo').count(),2);
 assert.equal(await page.locator('#catalogue-compare-jump').isVisible(),false);
 await page.locator('#comparison-differences').check();
 assert.equal(await page.locator('tr[data-different=false]:visible').count(),0);
 const dimension=page.locator('#catalogue-comparison tbody tr').filter({has:page.getByRole('rowheader',{name:'Dimension',exact:true})});
 assert.equal(await dimension.isVisible(),false,'45.4 mm and 45.4mm must not be presented as different');
 assert.equal(await page.locator('#catalogue-comparison .merchant-button').count(),2);
 await page.locator('#catalogue-comparison button[data-save-id]').first().focus();await page.keyboard.press('Enter');
 assert.equal(await page.locator('#primary-navigation [data-saved-count]').textContent(),'1');
 await page.locator('#catalogue-comparison button[data-remove]').first().click();
 assert.equal(await page.locator('.comparison-photo').count(),1);
 assert.equal(await page.locator('#comparison-differences-control').isVisible(),false);
 assert.equal(await page.locator('#catalogue-comparison button[data-remove]').evaluate(e=>document.activeElement===e),true);
 await page.locator('#comparison-clear').click();
 assert.equal(await page.locator('#catalogue-comparison').isVisible(),false);
 assert.equal(new URL(page.url()).searchParams.has('compare'),false);
 report.checks.push('Comparison: direct fragment, photos, differences, formatting equivalence, save count, remove focus and clear');

 await page.goto(origin+'/catalogue/?q=GA-2100');
 await page.locator('.catalogue-pick input').first().check();
 await page.locator('.catalogue-pick input').nth(1).check();
 assert.match(await page.locator('#catalogue-compare-jump').textContent(),/2\/3/);
 await page.locator('.catalogue-pick input').nth(2).check();
 assert.equal(await page.locator('.catalogue-pick input').nth(3).isDisabled(),true);
 await page.locator('input[name=q]').fill('unknown-watch-xyz');
 await page.locator('#catalogue-empty').waitFor();
 assert.equal(await page.locator('.comparison-photo').count(),3);
 await page.locator('.recovery-reset').click();
 assert.equal(await page.locator('.comparison-photo').count(),3);
 report.checks.push('Comparison limit and live counter; selections survive filters and empty-search reset');

 await page.goto(origin+'/montres/citizen-tsuyosa-nj0150-81e/');
 const save=page.locator('.purchase-panel button[data-save-id]');await save.waitFor();
 await save.click();assert.equal(await save.getAttribute('aria-pressed'),'true');
 assert.ok((await page.locator('.watch-reading').innerText()).includes('37 ou 40'));
 await page.locator('.purchase-tools a').click();
 await page.locator('.comparison-photo').waitFor();
 assert.equal(new URL(page.url()).searchParams.get('compare'),tsuyosa);
 await page.goto(origin+'/montres/seiko-srpe55k1/');
 assert.match(await page.locator('.purchase-panel .merchant-button').innerText(),/Vérifier chez Tempus/);
 assert.match(await page.locator('.purchase-status').innerText(),/indisponible/);
 await page.goto(origin+'/montres/citizen-aw0102-13ae/');
 assert.match(await page.locator('.purchase-panel .merchant-button').innerText(),/Précommander/);
 await page.goto(origin+'/vues-sur-nos-reseaux/');
 assert.equal(await page.locator('.social-pick button[data-save-id]:visible').count(),3);
 report.checks.push('Watch pages: latest offer status, saving, contextual reading and preselected comparison; social saves');

 await page.goto(origin+'/en/catalogue/?compare='+gshocks.join(',')+'#catalogue-comparison');
 await page.locator('.comparison-photo').first().waitFor();
 assert.ok((await page.locator('#catalogue-comparison').innerText()).includes('Show differences only'));
 await page.locator('#comparison-differences').check();
 assert.equal(await page.locator('tr[data-different=false]:visible').count(),0);
 const external=await page.locator('#catalogue-comparison a.merchant-button').evaluateAll(nodes=>nodes.map(a=>({url:a.href,rel:a.rel})));
 assert.ok(external.every(a=>new URL(a.url).searchParams.get('bg_ref')==='bDlTL8AyKb'&&a.rel.includes('sponsored')));
 await page.goto(origin+'/en/watches/seiko-srpe55k1/');
 assert.match(await page.locator('.purchase-panel .merchant-button').innerText(),/Check at Tempus/);
 report.checks.push('English comparison and offer labels; exact affiliate code and sponsored links');

 for(const width of [360,390,550,700,701,768,1024,1440,1920]){
  await page.setViewportSize({width,height:width<700?844:1000});
  for(const [name,path]of [
   ['watch','/montres/citizen-tsuyosa-nj0150-81e/'],
   ['comparison','/catalogue/?compare='+gshocks.join(',')+'#catalogue-comparison'],
   ['empty','/catalogue/?brand=Casio&q=GA-2100'],
   ['guide','/guides/montres-par-budget/']]){
   await page.goto(origin+path);if(path.includes('catalogue'))await page.locator('#catalogue-filters:not([aria-disabled])').waitFor();
   await ready(page);
   const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)}));
   assert.deepEqual(result,{overflow:false,broken:[]},name+' '+width);
   report.layouts.push({name,width,...result});
   if([390,1440].includes(width)){
    const screenshot=`${folder}/${name}-${width}.png`;
    if(name==='comparison')await page.locator('#catalogue-comparison').scrollIntoViewIfNeeded();else if(name==='empty')await page.locator('#catalogue-empty').scrollIntoViewIfNeeded();else if(name==='guide')await page.locator('.guide-examples').first().scrollIntoViewIfNeeded();else await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:screenshot});assert.equal((await sharp(screenshot).metadata()).width,width);report.screenshots.push(screenshot);
   }
   if(width===390){const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.equal(axe.violations.length,0,JSON.stringify(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));}
  }
 }
 report.checks.push('36 layouts at 360/390/550/700/701/768/1024/1440/1920; decoded photos; exact screenshot widths; axe on four mobile templates');
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/');
 const toggle=page.locator('.menu-toggle');await toggle.click();
 assert.equal(await toggle.getAttribute('aria-expanded'),'true');
 const savedLink=page.locator('#primary-navigation a[href="/mes-favoris/"]');assert.ok(await savedLink.isVisible());
 await savedLink.focus();await page.keyboard.press('Escape');
 assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(await toggle.evaluate(e=>document.activeElement===e),true);
 report.checks.push('Mobile menu exposes saved list; Escape closes and restores focus');

 const nojs=await browser.newContext({javaScriptEnabled:false,locale:'fr-FR',viewport:{width:390,height:844}}),np=await nojs.newPage();
 for(const path of ['/montres/seiko-srpe55k1/','/montres/citizen-tsuyosa-nj0150-81e/','/en/watches/seiko-srpe55k1/','/vues-sur-nos-reseaux/','/guides/montres-par-budget/','/catalogue/']){
  assert.equal((await np.goto(origin+path)).status(),200);assert.equal(await np.locator('h1').count(),1);
  assert.ok(await np.locator('a.merchant-button').count()>0);assert.equal(await np.locator('button[data-save-id]:visible').count(),0);
  if(path.includes('seiko-srpe'))assert.match(await np.locator('.purchase-panel .merchant-button').innerText(),/Vérifier|Check/);
 }
 await nojs.close();
 const fail=await browser.newContext({locale:'fr-FR'});await fail.route('**/catalogue.json',route=>route.abort());const fp=await fail.newPage();await fp.goto(origin+'/catalogue/');await fp.locator('#catalogue-error').waitFor();assert.ok(await fp.locator('.catalogue-card a.merchant-button').count()>0);assert.ok(await fp.locator('#catalogue-pagination a').count()>0);await fail.close();
 report.checks.push('Six routes without JavaScript; catalogue remains browsable if JSON download fails');
 assert.deepEqual(report.errors,[]);
}catch(error){report.errors.push(error.stack);throw error;}
finally{await browser.close();await fs.writeFile(folder+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
