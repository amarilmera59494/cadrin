import assert from 'node:assert/strict';
import {readFile,access,stat,writeFile,mkdir} from 'node:fs/promises';
import {filterCatalogue,orderLabel} from '../src/lib/tempus-catalogue.ts';
import {affiliateUrl,tempusAffiliate} from '../src/data/affiliation.ts';
const data=JSON.parse(await readFile('src/data/tempus-catalogue.json','utf8'));
const client=JSON.parse(await readFile('public/catalogue.json','utf8'));
assert.match(data.checkedAt,/^\d{4}-\d{2}-\d{2}$/);assert.ok(data.products.length>0);assert.equal(data.currency,'EUR');
await access(data.permissionFile);assert.equal(data.products.length,client.products.length);
const ids=new Set(),images=new Set();let bytes=0;
for(let i=0;i<data.products.length;i++){
 const p=data.products[i],{imageSource,...publicProduct}=p;assert.deepEqual(publicProduct,client.products[i]);
 assert.ok(!ids.has(p.id));ids.add(p.id);assert.match(p.id,/^\d+$/);assert.ok(p.reference.trim()&&p.title.trim()&&p.brand.trim());
 assert.ok(Number.isFinite(p.price)&&p.price>0);assert.ok(p.width>0&&p.height>0);
 assert.equal(p.source,`https://tempusshop.com/products/${p.handle}`);assert.ok(p.handle&&!/[/?#\\\s]/.test(p.handle)&&!p.handle.includes('..'));
 assert.equal(new URL(imageSource).hostname,'cdn.shopify.com');assert.equal(p.image,`/images/catalogue/${p.id}.webp`);
 images.add(p.image);bytes+=(await stat('public'+p.image)).size;
 const url=new URL(affiliateUrl(p.source));assert.equal(url.searchParams.get('bg_ref'),tempusAffiliate.code);assert.equal(decodeURIComponent(url.pathname),`/products/${p.handle}`);
 assert.ok(['','Automatique','Quartz','Solaire','Manuel','Connectée'].includes(p.movement));assert.ok(['','Femme','Homme','Enfant'].includes(p.category));assert.ok(['preorder','order','check'].includes(p.order));
}
const base={q:'',brand:'',budget:'',movement:'',category:'',order:'',sort:''};
const fixture=(id,extra={})=>({id,title:'Montre École',brand:'Test',reference:'ABC-'+id,price:100,movement:'',category:'',order:'check',orderable:true,...extra});
const sample=[fixture('1'),fixture('2',{movement:'Automatique',price:300,category:'Femme',order:'preorder'}),fixture('3',{movement:'Solaire',price:150,order:'order'}),fixture('4',{orderable:false})];
assert.equal(filterCatalogue(sample,{...base,q:'ecole abc-2'})[0].id,'2');
assert.deepEqual(filterCatalogue(sample,{...base,budget:'150'}).map(p=>p.id),['1','3','4']);
assert.equal(filterCatalogue(sample,{...base,movement:'Quartz'}).length,0); // Unknown is never guessed as quartz.
assert.equal(filterCatalogue(sample,{...base,category:'Homme'}).length,0); // Unknown is never guessed as men's.
assert.deepEqual(filterCatalogue(sample,{...base,order:'unflagged'}).map(p=>p.id),['1']); // Not preorder, to order, or unavailable.
assert.equal(filterCatalogue(sample,{...base,sort:'price-desc'})[0].id,'2');
assert.match(orderLabel(sample[1]),/précommande/);assert.doesNotMatch(orderLabel(sample[0]),/en stock/i);
assert.throws(()=>affiliateUrl('https://evil.example/products/test'));
// Exact examples supplied by the owner, not synthetic tracking identifiers.
for(const slug of ['casio-g-shock-gac-2500-9a','casio-g-shock-gac-2500-7a']){
 assert.equal(affiliateUrl(`https://tempusshop.com/products/${slug}`),`https://tempusshop.com/products/${slug}?bg_ref=bDlTL8AyKb`);
 assert.ok(data.products.some(p=>p.handle===slug));
}
const existing=new URL(affiliateUrl('https://tempusshop.com/en/products/test?variant=123&utm_source=cadrin&bg_ref=old#details'));
assert.deepEqual(existing.searchParams.getAll('bg_ref'),['bDlTL8AyKb']);assert.equal(existing.searchParams.get('variant'),'123');assert.equal(existing.searchParams.get('utm_source'),'cadrin');assert.equal(existing.hash,'#details');
const report={checkedAt:new Date().toISOString(),products:ids.size,photos:images.size,totalPhotoBytes:bytes,filterCases:7,errors:[]};
await mkdir('evidence/tempus-catalogue',{recursive:true});
await writeFile('evidence/tempus-catalogue/data-check.json',JSON.stringify(report,null,2));console.log(report);
