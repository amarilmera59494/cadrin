import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {featureRoutes} from '../src/data/feature-routes.ts';
import {features,featurePath} from '../src/data/features.ts';
import {cleanIds,readSaved,sharedIds,sharePath} from '../src/lib/saved-watches.ts';
import {merchantLinkAvailable,orderLabel} from '../src/lib/tempus-catalogue.ts';
import {prepareOffers,digest} from './tempus-refresh-lib.mjs';
const data=JSON.parse(await fs.readFile('src/data/tempus-catalogue.json','utf8'));
await fs.access(data.permissionFile);
assert.deepEqual(featureRoutes,Object.fromEntries(features.map(f=>[featurePath(f),featurePath(f,true)])));
const paths=new Set();
for(const f of features){
 assert.equal(f.rights,'approved');assert.match(f.verifiedAt,/^\d{4}-\d{2}-\d{2}$/);assert.ok(f.sections.length>=3);assert.ok(f.choices.length>=2&&f.choices.length<=3);
 for(const p of [featurePath(f),featurePath(f,true)]){assert.ok(!paths.has(p));paths.add(p);}
 for(const copy of [f.title,f.intro,f.verdict,...f.sections.flatMap(s=>[s.title,...s.paragraphs]),...f.choices.flatMap(c=>[c.label,c.why,c.limit])]){assert.equal(copy.length,2);assert.ok(copy.every(s=>s.trim().length>10));}
 if(f.kind==='brand')assert.ok(f.sources.length>=1);
 for(const source of f.sources){assert.equal(new URL(source.url).protocol,'https:');assert.ok(source.label);}
 for(const choice of f.choices){const p=data.products.find(p=>p.reference===choice.reference);assert.ok(p,choice.reference);await fs.access('public'+p.image);assert.equal(new URL(p.imageSource).hostname,'cdn.shopify.com');assert.ok(p.source.endsWith('/'+p.handle));assert.ok(p.specCheckedAt);}
}
assert.equal(features.filter(f=>f.kind==='brand').length,5);assert.equal(features.filter(f=>f.kind==='comparison').length,5);
assert.deepEqual(cleanIds(['1','2','1','<script>','',2]),['1','2']);assert.equal(cleanIds(Array.from({length:20},(_,i)=>String(i))).length,12);
assert.deepEqual(readSaved('{broken'),[]);assert.deepEqual(readSaved('{"version":2,"ids":["1"]}'),[]);assert.deepEqual(readSaved('{"version":1,"ids":["1","2"]}'),['1','2']);
for(const hash of ['#liste=','#liste=<script>','#liste=1,2,no','#liste='+Array.from({length:13},(_,i)=>i).join(',')])assert.equal(sharedIds(hash).invalid,true);
assert.deepEqual(sharedIds('#liste=1,2,1'),{shared:true,ids:['1','2'],invalid:false});assert.equal(sharedIds('#other=1').shared,false);assert.equal(sharePath(['1','2'],true),'/en/saved-watches/#liste=1,2');
const old={id:'1',handle:'watch',reference:'REF',imageSource:'https://cdn.shopify.com/exact.jpg',price:100,orderable:true,order:'check',dial:'Rose',image:'/local.webp',specCheckedAt:'2026-11-13'};
const raw={id:1,handle:'watch',images:[{src:old.imageSource}],variants:[{sku:'REF',price:'95',available:false}],tags:['precommande']};
const current={checkedAt:'2026-11-13',products:[old]};
const r=prepareOffers(current,[raw],'2026-11-14');assert.equal(r.blockers.length,0);assert.deepEqual(r.catalogue.products[0],{...old,price:95,orderable:false,order:'preorder'});assert.equal(r.catalogue.checkedAt,'2026-11-13');assert.equal(r.catalogue.offersCheckedAt,'2026-11-14');
assert.throws(()=>prepareOffers(current,[],'2026-11-14'),/Incomplete/);assert.throws(()=>prepareOffers(current,[raw,raw],'2026-11-14'),/Duplicate/);
for(const edit of [{handle:'other'},{images:[{src:'https://cdn.shopify.com/other.jpg'}]},{variants:[{sku:'WRONG',price:'95',available:true}]},{variants:[{sku:'REF',price:'0',available:true}]},{variants:[{sku:'REF',price:'1000',available:true}]},{variants:[{sku:'REF',price:'100',available:'yes'}]}]){const candidate=prepareOffers(current,[{...raw,...edit}],'2026-11-14');assert.equal(candidate.blockers.length,1);assert.deepEqual(candidate.catalogue.products[0],old);}
assert.equal(prepareOffers(current,[{...raw,id:2}],'2026-11-14').blockers[0].reason,'missing-product');assert.notEqual(digest('a'),digest('b'));
assert.equal(merchantLinkAvailable({brand:'Longines'}),false);assert.match(orderLabel({brand:'Longines'}),/indisponibles/);assert.equal(merchantLinkAvailable({brand:'Citizen'}),true);
const report={checkedAt:new Date().toISOString(),features:features.length,bilingualRoutes:paths.size,photoReferences:[...new Set(features.flatMap(f=>f.choices.map(c=>c.reference)))].length,savedLists:'PASS',controlledRefresh:'PASS',pausedLonginesLinks:'PASS'};
await fs.mkdir('evidence/retention',{recursive:true});await fs.writeFile('evidence/retention/data-check.json',JSON.stringify(report,null,2));console.log(report);
