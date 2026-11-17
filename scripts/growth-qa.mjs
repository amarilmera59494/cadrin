import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4340',dir='evidence/growth/after';await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),report={origin,checks:[],screenshots:[],errors:[]};
try{
 const context=await browser.newContext({locale:'fr-FR',viewport:{width:390,height:844}});const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 const sent=[];page.on('request',r=>{if(r.url().endsWith('/api/measure'))sent.push(r.postDataJSON());});
 await page.goto(origin+'/trouver-ma-montre/?utm_source=tiktok&utm_campaign=tsuyosa-rose');await page.locator('#catalogue-filters:not([aria-disabled])').waitFor();
 assert.equal(sent.length,0);
 await page.locator('#guided-form select[name=budget]').selectOption('300');await page.locator('#guided-form select[name=dial]').selectOption('Rose');await page.locator('#guided-form button[type=submit]').click();assert.ok(await page.locator('.recommendation').count()>=1);assert.equal(await page.locator('.recommendation').first().getAttribute('data-reference'),'NJ0200-50Z');
 const href=await page.locator('.recommendation').first().locator('a.merchant-button').getAttribute('href');assert.ok(href.includes('bg_ref=bDlTL8AyKb'));assert.ok(href.includes('nj0200-50z'));
 await page.locator('#guided-form select[name=budget]').selectOption('30');await page.locator('#guided-form button[type=submit]').click();assert.equal(await page.locator('.recommendation').count(),0);assert.match(await page.locator('#guided-status').textContent(),/Aucune/);
 await page.locator('#guided-form button[type=reset]').click();assert.equal(await page.locator('#guided-result').isVisible(),false);assert.ok(!page.url().includes('choix_'));
 await page.locator('#mesure summary').click();await page.locator('[data-measure-decline]').click();await page.reload();await page.locator('#guided-form button[type=submit]').click();assert.equal(sent.length,0);
 await page.locator('#mesure summary').click();const response=page.waitForResponse(r=>r.url().endsWith('/api/measure'));await page.locator('[data-measure-accept]').click();assert.equal((await response).status(),204);assert.equal(sent[0].event,'page_view');assert.equal(sent[0].source,'tiktok');
 await page.locator('#guided-form select[name=dial]').selectOption('Rose');await page.locator('#guided-form button[type=submit]').click();await page.waitForTimeout(150);assert.ok(sent.some(e=>e.event==='selector_complete'));
 const before=sent.length;await page.locator('[data-measure-decline]').click();await page.locator('#guided-form button[type=submit]').click();await page.waitForTimeout(100);assert.equal(sent.length,before);
 report.checks.push('Consent default/refusal/persistence/withdrawal, real HTTP204, strict guided criteria, reset, affiliate destination');
 await page.goto(origin+'/trouver-ma-montre/?couleur=Rose&mouvement=Automatique&budget=300');await page.locator('#catalogue-filters:not([aria-disabled])').waitFor();assert.equal(await page.locator('#catalogue-filters [name=dial]').inputValue(),'Rose');assert.equal(await page.locator('#catalogue-filters [name=movement]').inputValue(),'Automatique');assert.ok(await page.locator('.catalogue-card').count()>0);
 await page.locator('.catalogue-pick input').first().check();assert.ok(await page.locator('#catalogue-comparison').isVisible());assert.ok(page.url().includes('compare='));assert.equal(await page.locator('#catalogue-comparison a[rel=sponsored]').count(),1);
 await page.goto(origin+'/trouver-ma-montre/?comparer=casio-f91w,citizen-tsuyosa-nj0150-81e#comparaison');await page.locator('#catalogue-filters:not([aria-disabled])').waitFor();assert.equal(await page.locator('#catalogue-comparison a[rel=sponsored]').count(),2);
 report.checks.push('Legacy FR filters and editorial comparisons, global catalogue comparison');
 await page.goto(origin+'/vues-sur-nos-reseaux/');assert.equal(await page.locator('.social-pick').count(),3);await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement),true);
 await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.activeElement!==document.body));
 const nojs=await browser.newContext({javaScriptEnabled:false,locale:'fr-FR',viewport:{width:390,height:844}});const np=await nojs.newPage();await np.goto(origin+'/trouver-ma-montre/');assert.ok(await np.locator('#catalogue-cards .catalogue-card').count()>0);assert.equal(await np.locator('#catalogue-filters').isVisible(),false);await np.locator('#catalogue-pagination a').filter({hasText:'Suivante'}).click();assert.ok(np.url().endsWith('/catalogue/2/'));await np.goto(origin+'/vues-sur-nos-reseaux/');assert.equal(await np.locator('.social-pick a.merchant-button').count(),3);await nojs.close();report.checks.push('Mobile menu/Escape/focus, keyboard, no-JS catalogue pagination/social purchases');
 for(const width of [360,390,768,1440,1920]){await page.setViewportSize({width,height:width<500?844:1000});for(const [name,route] of [['social','/vues-sur-nos-reseaux/'],['finder','/trouver-ma-montre/'],['gift','/guides/offrir-une-montre/'],['home','/']]){
  await page.goto(origin+route);if(name==='finder'){await page.locator('#guided-form button[type=submit]').click();}
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0);});
  const defects=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)}));assert.deepEqual(defects,{overflow:false,broken:[]},`${name} ${width}`);
  if([390,1440].includes(width)){const file=`${dir}/${name}-${width}.png`;await page.screenshot({path:file,fullPage:true});report.screenshots.push(file);}
  if(width===390&&['social','finder'].includes(name)){const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.equal(a.violations.length,0,JSON.stringify(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));}
 }}report.checks.push('360/390/768/1440/1920: no horizontal overflow or broken photos; axe WCAG AA social/finder at390');
 await page.goto(origin+'/en/watch-finder/');await page.locator('#guided-form select[name=dial]').selectOption('Rose');await page.locator('#guided-form button[type=submit]').click();assert.match(await page.locator('#guided-status').textContent(),/choice/);await page.goto(origin+'/en/seen-on-social/');assert.equal(await page.locator('.social-pick').count(),3);report.checks.push('English finder and social hub');assert.deepEqual(report.errors,[]);
}finally{await fs.writeFile('evidence/growth/qa.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify(report,null,2));
