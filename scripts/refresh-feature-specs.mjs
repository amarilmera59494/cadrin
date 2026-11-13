import fs from 'node:fs/promises';
import {parseSpecs,traits,matchesReference,norm} from './import-tempus-specifications.mjs';
const refs=(process.argv.find(a=>a.startsWith('--references='))||'').slice(13).split(',').filter(Boolean);if(!refs.length)throw Error('Supply --references=REF,REF for a bounded documentary check');
const overrides=JSON.parse(await fs.readFile('src/data/tempus-spec-overrides.json','utf8'));
const data=JSON.parse(await fs.readFile('src/data/tempus-catalogue.json','utf8')),specs=JSON.parse(await fs.readFile('src/data/tempus-specifications.json','utf8')),report=[];
for(const reference of refs){
 const p=data.products.find(p=>p.reference===reference);if(!p)throw Error('Unknown '+reference);
 const r=await fetch(p.source,{signal:AbortSignal.timeout(30000)});
 if(r.status===429)throw Error('Rate limited; stopped without applying');
 if(!r.ok){report.push({reference,source:p.source,status:'not-refreshed',reason:'HTTP '+r.status});continue;}
 if(new URL(r.url).pathname!==new URL(p.source).pathname){report.push({reference,source:p.source,status:'not-refreshed',reason:'redirect',destination:r.url});continue;}
 const rows=parseSpecs(await r.text()),record={version:2,source:p.source,checkedAt:new Date().toISOString(),rows};
 if(!rows.length||!matchesReference(p,record)){report.push({reference,status:'not-refreshed',reason:rows.length?'reference mismatch':'table unavailable'});continue;}
 specs.records[p.id]=record;const fields=traits(rows);for(const [key,value]of Object.entries(fields))if(Array.isArray(value)?value.length:value)p[key]=value;
 const movement=norm(fields.specMovement||'');if(movement.includes('automatique'))p.movement='Automatique';else if(movement.includes('eco-drive')||movement.includes('solaire'))p.movement='Solaire';else if(movement.includes('quartz'))p.movement='Quartz';
 const override=overrides[p.id];if(override?.source===p.source&&override.reference===p.reference)Object.assign(p,override.values);
 p.specCheckedAt=record.checkedAt.slice(0,10);report.push({reference,status:'refreshed',rows:rows.length,source:p.source});await new Promise(r=>setTimeout(r,1000));
}
await fs.mkdir('evidence/retention',{recursive:true});await fs.writeFile('evidence/retention/spec-refresh.json',JSON.stringify(report,null,2));await fs.writeFile('src/data/tempus-specifications.json',JSON.stringify(specs));await fs.writeFile('src/data/tempus-catalogue.json',JSON.stringify(data));await fs.writeFile('public/catalogue.json',JSON.stringify({...data,products:data.products.map(({imageSource,...p})=>p)}));console.log(JSON.stringify(report,null,2));
