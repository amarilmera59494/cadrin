import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const root=process.env.QA_ORIGIN||'http://127.0.0.1:4323',dir=process.env.QA_OUTPUT||'evidence/tempus-catalogue/offer';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),checks=[];
try{for(const en of [false,true])for(const width of [390,1440]){
 const context=await browser.newContext({locale:en?'en-GB':'fr-FR',viewport:{width,height:900}}),page=await context.newPage();
 await page.addInitScript(()=>{window.__copied='';Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text}},configurable:true})});
 await page.goto(root+(en?'/en/':'/'));await page.locator('[data-copy-offer]').waitFor({state:'visible'});await page.locator('[data-copy-offer]').first().focus();await page.keyboard.press('Enter');
 assert.equal(await page.evaluate(()=>window.__copied),'WELCOME10');assert.equal(await page.locator('.offer-action [role=status]').first().innerText(),en?'Code copied':'Code copié');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('Denied')}},configurable:true}));await page.locator('[data-copy-offer]').first().click();assert.match(await page.locator('.offer-action [role=status]').first().innerText(),/WELCOME10/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const axe=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations;assert.deepEqual(axe.map(v=>v.id),[]);
 await page.locator('.tempus-offer').first().screenshot({path:`${dir}/${en?'en':'fr'}-${width}.png`});checks.push({en,width,keyboardCopy:true,deniedFallback:true,axe:0});await context.close();
 const nojs=await browser.newContext({javaScriptEnabled:false,locale:en?'en-GB':'fr-FR'}),np=await nojs.newPage();await np.goto(root+(en?'/en/':'/'));assert.equal(await np.locator('.tempus-offer code').first().innerText(),'WELCOME10');assert.ok(await np.locator('[data-copy-offer]').first().isHidden());await nojs.close();
}}finally{await browser.close();await writeFile(dir+'/report.json',JSON.stringify(checks,null,2));}console.log(checks);
