// Read-only reachability audit. A product-shaped HTTP 200 is not proof of stock or reference identity.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const raw=await fs.readFile('src/data/tempus-catalogue.json','utf8'),catalogue=JSON.parse(raw);
const references=process.argv.find(a=>a.startsWith('--references='))?.slice(13).split(',');
const products=catalogue.products.filter(p=>!references||references.includes(p.reference));
const folder=process.env.QA_OUTPUT||'evidence/tempus-destinations';await fs.mkdir(folder,{recursive:true});
const report={startedAt:new Date().toISOString(),sourceHash:createHash('sha256').update(raw).digest('hex'),scope:'GET destination reachability only; no stock, reference identity or commission verification',expected:products.length,results:[],complete:false};
let index=0,rateLimits=0,stopped=false;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function probe(p){
 let current=p.source;const hops=[];
 for(let hop=0;hop<6;hop++){
  const url=new URL(current);if(url.protocol!=='https:'||url.hostname!=='tempusshop.com')return {state:'external-redirect',final:current,hops};
  const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)}),location=response.headers.get('location');
  const status=response.status;await response.body?.cancel();hops.push({url:current,status,location});
  if(status===429){rateLimits++;if(rateLimits>=3)stopped=true;await delay(5000);return {state:'rate-limited',final:current,status,hops};}
  if(status>=300&&status<400&&location){current=new URL(location,url).href;const target=new URL(current);if(target.hostname==='tempusshop.com'&&!/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?products\/[^/]+\/?$/i.test(target.pathname))return {state:'redirected-away',final:current,status,hops};continue;}
  return {state:status===200?'product-response':'http-error',final:current,status,hops};
 }
 return {state:'redirect-limit',final:current,hops};
}
async function save(){await fs.writeFile(`${folder}/report.json`,JSON.stringify({...report,updatedAt:new Date().toISOString(),stoppedForRateLimit:stopped},null,2));}
await Promise.all(Array.from({length:2},async()=>{while(index<products.length&&!stopped){const p=products[index++];let result;try{result=await probe(p);}catch(e){result={state:'request-error',error:String(e)};}report.results.push({id:p.id,brand:p.brand,reference:p.reference,source:p.source,checkedAt:new Date().toISOString(),...result});if(report.results.length%100===0){await save();console.log(JSON.stringify({checked:report.results.length,total:products.length,notProduct:report.results.filter(r=>r.state!=='product-response').length}));}await delay(250);}}));
report.complete=report.results.length===products.length;report.finishedAt=new Date().toISOString();await save();
console.log(JSON.stringify({complete:report.complete,total:report.results.length,states:Object.fromEntries([...new Set(report.results.map(r=>r.state))].map(state=>[state,report.results.filter(r=>r.state===state).length]))}));
if(!report.complete||report.results.some(r=>['rate-limited','request-error','redirect-limit'].includes(r.state)))process.exitCode=2;
