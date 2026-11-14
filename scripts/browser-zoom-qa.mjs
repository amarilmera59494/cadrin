import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4344',dir=process.env.QA_OUTPUT||'evidence/final-audit/zoom';await mkdir(dir,{recursive:true});
// A temporary Chrome profile changes native browser zoom, never the user's profile or CSS zoom.
const context=await chromium.launchPersistentContext('',{channel:'chrome',viewport:null,locale:'fr-FR',args:['--window-size=1440,1000']});
const page=await context.newPage(),settings=await context.newPage(),report={origin,results:[]};
const cdp=await context.newCDPSession(page);
const paths=['/','/selections/trois-montres-au-quotidien/','/montres/casio-f91w/','/guides/choisir-premiere-montre/','/catalogue/','/trouver-ma-montre/','/en/selections/three-everyday-watches/'];
try{
 await settings.goto('chrome://settings/appearance');
 const zoom=level=>settings.evaluate(async z=>{await chrome.settingsPrivate.setDefaultZoom(z);return await chrome.settingsPrivate.getDefaultZoom()},level);
 for(const level of [1,2,4]){
  const setting=await zoom(level);assert(Math.abs(setting-level)<1e-9);
  for(const [i,path] of paths.entries()){
   await page.goto(origin+path);await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>({inner:innerWidth,outer:outerWidth,dpr:devicePixelRatio,cssZoom:getComputedStyle(document.documentElement).zoom,overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.equal(state.cssZoom,'1');assert.equal(state.overflow,false);assert(state.inner<=Math.ceil(1440/level));assert(Math.abs(state.dpr-level)<1e-9);
   report.results.push({path,level,setting,...state});if([1,3,4].includes(i)&&level>1){const capture=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});await writeFile(`${dir}/${i}-${level*100}.png`,Buffer.from(capture.data,'base64'));}
  }
 }
 report.pass=true;
}catch(e){report.pass=false;report.failure=e.stack;throw e;}finally{await context.close();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
