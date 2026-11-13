import fs from 'node:fs/promises';
import path from 'node:path';
import {digest,prepareOffers} from './tempus-refresh-lib.mjs';
const source='src/data/tempus-catalogue.json',client='public/catalogue.json',folder='evidence/tempus-refresh';await fs.mkdir(folder,{recursive:true});
const original=await fs.readFile(source,'utf8'),current=JSON.parse(original),draftFile=path.join(folder,'candidate.json');
if(process.argv.includes('--apply')){
 const draft=JSON.parse(await fs.readFile(draftFile,'utf8'));
 if(draft.sourceHash!==digest(original)||draft.candidateHash!==digest(JSON.stringify(draft.result.catalogue)))throw Error('Candidate or current catalogue changed. Refresh again.');
 if(!Number.isFinite(Date.parse(draft.retrievedAt))||Date.parse(draft.retrievedAt)>Date.now()+60000||Date.now()-Date.parse(draft.retrievedAt)>86400000||draft.result.blockers.length)throw Error('Expired or blocked candidate. Review report before applying.');
 const previousClient=await fs.readFile(client,'utf8');await fs.writeFile(path.join(folder,'backup-'+Date.now()+'.json'),JSON.stringify({source:original,client:previousClient}));
 const next=draft.result.catalogue;
 try{await fs.writeFile(source,JSON.stringify(next));await fs.writeFile(client,JSON.stringify({...next,products:next.products.map(({imageSource,...p})=>p)}));}
 catch(error){await fs.writeFile(source,original);await fs.writeFile(client,previousClient);throw error;}
 await fs.writeFile(path.join(folder,'applied.json'),JSON.stringify({appliedAt:new Date().toISOString(),sourceHash:draft.sourceHash,candidateHash:draft.candidateHash,changes:draft.result.changes},null,2));
 console.log(`Applied ${next.products.length} checked offers; ${draft.result.changes.length} changes. Specifications and images preserved.`);
}else{
 if(!process.argv.includes('--check'))throw Error('Use --check to prepare a report, then --apply after reviewing it.');
 const get=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`HTTP ${r.status}: stopped, current catalogue unchanged`);return r.json();};
 const market=await get('https://tempusshop.com/cart.js?country=FR&currency=EUR');if(market.currency!=='EUR')throw Error('EUR market not confirmed');
 const raw=[],pages=[];for(let page=1;page<=100;page++){const data=await get(`https://tempusshop.com/products.json?limit=250&page=${page}&country=FR&currency=EUR`);if(!Array.isArray(data.products))throw Error('Unexpected response');raw.push(...data.products);pages.push(data.products.length);if(data.products.length<250)break;if(page===100)throw Error('Pagination cap reached');}
 const retrievedAt=new Date().toISOString(),date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris'}).format(new Date());
 const result=prepareOffers(current,raw,date),draft={retrievedAt,market:{country:'FR',currency:'EUR'},pages,sourceHash:digest(original),candidateHash:digest(JSON.stringify(result.catalogue)),result};
 await fs.writeFile(draftFile,JSON.stringify(draft));await fs.writeFile(path.join(folder,'report.json'),JSON.stringify({...draft,result:{...result,catalogue:undefined}},null,2));
 console.log(JSON.stringify({checkedAt:date,remote:raw.length,existing:current.products.length,changes:result.changes.length,blockers:result.blockers.length,newOrExcluded:result.newProducts.length,report:folder+'/report.json'}));
 if(result.blockers.length)process.exitCode=2;
}
