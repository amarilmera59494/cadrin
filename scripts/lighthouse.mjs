import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {mkdir,mkdtemp,writeFile} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
const tmp=path.resolve('.tmp');await mkdir(tmp,{recursive:true});process.env.TEMP=tmp;process.env.TMP=tmp;
await mkdir('evidence/lighthouse',{recursive:true});
const userDataDir=await mkdtemp(path.join(tmp,'lighthouse-'));
const probe=net.createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
const chrome=await launch({port,chromeFlags:['--headless','--disable-gpu','--no-first-run'],userDataDir});
const results=[];
try{for(const route of ['/concepts/',...['revue','mesure','allure'].flatMap(d=>[`/concepts/${d}/`,`/concepts/${d}/guide/`])]){
 const run=await lighthouse(`http://127.0.0.1:4321${route}`,{port:chrome.port,output:['json','html'],logLevel:'error',onlyCategories:['performance','accessibility'],formFactor:'mobile'});
 if(!run)throw Error('Lighthouse returned no result');
 const name=route.slice(1,-1).replaceAll('/','-');await writeFile(`evidence/lighthouse/${name}.json`,run.report[0]);await writeFile(`evidence/lighthouse/${name}.html`,run.report[1]);
 const r={route,performance:run.lhr.categories.performance.score*100,accessibility:run.lhr.categories.accessibility.score*100,LCP_ms:run.lhr.audits['largest-contentful-paint'].numericValue,CLS:run.lhr.audits['cumulative-layout-shift'].numericValue,TBT_ms:run.lhr.audits['total-blocking-time'].numericValue,version:run.lhr.lighthouseVersion,fetchTime:run.lhr.fetchTime};results.push(r);console.log(JSON.stringify(r));
}}finally{chrome.kill();await writeFile('evidence/lighthouse/summary.json',JSON.stringify(results,null,2));}
