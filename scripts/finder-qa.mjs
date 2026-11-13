import {destinations} from '../src/data/destinations.ts';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
const root=process.env.QA_ORIGIN || 'http://127.0.0.1:4323';
const dir=process.env.QA_OUTPUT || 'evidence/iteration-04';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const report=[];
try {
 const page=await browser.newPage();
 const base=root+'/trouver-ma-montre/';
 const visible=page.locator('.model:visible');
 for(const width of [1440,390,320,768]){
  await page.setViewportSize({width,height:width>740?1000:844});
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await visible.count(),6);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width===390){
    const toggle=page.locator('#filter-toggle');
    await toggle.focus();await page.keyboard.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Enter');assert.ok(await page.locator('#filter-options').isHidden());
  }
  if ([1440,390].includes(width))await page.screenshot({path:dir+'/selecteur-'+width+'.png'});
  report.push('Affichage sans débordement à '+width);
 }
 await page.goto(root+'/guides/montres-par-budget/');
 await page.getByRole('link',{name:'Comparer les automatiques jusqu’à 350 €'}).click();
 await page.waitForLoadState('load');
 assert.equal(new URL(page.url()).pathname,'/catalogue/');assert.equal(new URL(page.url()).searchParams.get('budget'),'350');await page.goto(base+'?budget=350&mouvement=Automatique');assert.equal(await visible.count(),3);
 for(const name of ['NJ0150-81E','SRPE55K1']) assert.ok((await visible.allTextContents()).join(' ').includes(name));
 await page.getByLabel('Marque ou référence').fill('NJ015081E');assert.equal(await visible.count(),1);
 await page.locator('.pick:visible input').check();
 await page.getByLabel('Marque ou référence').fill('inconnu');assert.ok(await page.locator('#no-matches').isVisible());
 await page.getByRole('button',{name:'Afficher toutes les montres'}).click();await page.waitForFunction(()=>!document.querySelector('#models article').hidden);
 assert.equal(await visible.count(),6);
 for(const id of ['orient-bambino-ra-ac0m04y','casio-f91w'])await page.locator('.pick input[value="'+id+'"]').check();
 assert.equal(await page.locator('.pick input:disabled').count(),3);
 const shared=page.url();await page.reload();assert.equal(await page.locator('.pick input:checked').count(),3);
 await page.getByRole('link',{name:/Voir ma comparaison/}).click();
 await page.locator('#comparaison').screenshot({path:dir+'/comparaison.png'});
 await page.locator('[data-remove="casio-f91w"]').click();assert.equal(await page.locator('.pick input:checked').count(),2);
 await page.goto(root+'/guides/offrir-une-montre/');
 await page.getByRole('link',{name:/classées femme/}).click();await page.waitForLoadState('load');assert.equal(await visible.count(),1);
 assert.ok((await visible.innerText()).includes('EM1201-52L'));
 await visible.getByRole('link',{name:'Consulter la fiche'}).click();
 assert.equal(await page.getByRole('link',{name:'Voir chez Tempus Shop'}).getAttribute('href'),destinations['citizen-rainell-em1201-52l'].url);
 await page.goBack();assert.equal(await visible.count(),1);
 await page.goto(base+'?largeur=30');assert.equal(await visible.count(),1);
 await page.goto(shared);
 report.push('Budget et catégorie depuis les guides, recherche de référence, vide/reset, trois favoris maximum, URL restaurée, retrait, filtre de largeur, aller-retour marchand');
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const np=await nojs.newPage();await np.goto(base);
 assert.ok(await np.locator('#criteria').isHidden());
 assert.equal(await np.locator('.model:visible').count(),6);assert.equal(await np.locator('thead th:visible').count(),7);
 assert.ok(await np.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 report.push('Sans JavaScript : six fiches et tableau intégral');
 await nojs.close();
} finally {await browser.close()}
await writeFile(dir+'/selecteur-tests.json',JSON.stringify(report,null,2));console.log(report);
