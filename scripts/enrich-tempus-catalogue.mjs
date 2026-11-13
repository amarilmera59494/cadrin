import {readFile,writeFile} from 'node:fs/promises';
import {traits,plain,norm,colourFamily,matchesReference} from './import-tempus-specifications.mjs';
const data=JSON.parse(await readFile('src/data/tempus-catalogue.json','utf8'));
const raw=JSON.parse(await readFile('evidence/tempus-catalogue/raw.json','utf8'));
const spec=JSON.parse(await readFile('src/data/tempus-specifications.json','utf8'));
const best=JSON.parse(await readFile('src/data/tempus-bestsellers.json','utf8'));
const overrides=JSON.parse(await readFile('src/data/tempus-spec-overrides.json','utf8'));
const byId=new Map(raw.products.map(p=>[String(p.id),p])),ids=new Set(best.ids);
const bestMeta={source:best.source,checkedAt:best.checkedAt.slice(0,10),ids:[...ids]};
await writeFile('src/data/tempus-bestsellers.json',JSON.stringify(bestMeta));
for(const p of data.products){const r=byId.get(p.id),body=plain(r?.body_html||''),candidate=spec.records[p.id],record=candidate&&matchesReference(p,candidate)?candidate:null;const details=traits(record?.rows||[]);
 if(!details.dial){const match=body.match(/\bcadran\s+([^.,;:]{1,65})/i);if(match){const phrase=match[1].split(/\b(?:avec|et |aiguilles|index|boîtier|bracelet|sur |à |de |doté|rehaussé)\b/i)[0].trim();const colors=colourFamily(phrase);if(colors.length){details.dial=phrase;details.dialColors=colors;}}}
 if(!details.strap){const match=body.match(/\bbracelet\s+(?:en\s+)?(acier(?: inoxydable)?|cuir|titane|résine(?: biosourcée)?|silicone|caoutchouc|nylon|textile)\b/i);if(match)details.strap=match[1];}
 if(!details.strapFamily){const s=norm(details.strap);details.strapFamily=s.includes('acier')?'Acier':s.includes('cuir')?'Cuir':s.includes('titane')?'Titane':/resine|silicone|caoutchouc/.test(s)?'Résine / caoutchouc':/textile|nylon/.test(s)?'Textile':'';}
 if(!details.functions){details.functions=['GPS intégré','Bluetooth','Chronographe','Alarme','GMT'].filter(f=>norm(body).includes(norm(f))).join(', ');}
 const genre=record?.rows.find(r=>r.label==='Genre')?.value;if(['Homme','Femme','Enfant'].includes(genre))p.category=genre;
 const m=norm(details.specMovement);if(m.includes('eco-drive')||m.includes('solaire'))p.movement='Solaire';else if(m.includes('automatique'))p.movement='Automatique';else if(m.includes('quartz'))p.movement='Quartz';else if(m.includes('manuel'))p.movement='Manuel';else if(m.includes('connect')||r?.tags.some(t=>norm(t)==='connecte'))p.movement='Connectée';
 const override=overrides[p.id];if(override?.source===p.source&&override.reference===p.reference)Object.assign(details,override.values);
 Object.assign(p,details,{bestseller:ids.has(p.id),specCheckedAt:record?.checkedAt.slice(0,10)||raw.checkedAt.slice(0,10)});
}
data.bestSellers={source:bestMeta.source,checkedAt:bestMeta.checkedAt};
await writeFile('src/data/tempus-catalogue.json',JSON.stringify(data));await writeFile('public/catalogue.json',JSON.stringify({...data,products:data.products.map(({imageSource,...p})=>p)}));
const report={products:data.products.length,colors:data.products.filter(p=>p.dialColors.length).length,straps:data.products.filter(p=>p.strapFamily).length,sizes:data.products.filter(p=>p.caseSize).length,bestsellers:data.products.filter(p=>p.bestseller).length};await writeFile('evidence/selection-audit/enrichment.json',JSON.stringify(report,null,2));console.log(report);
