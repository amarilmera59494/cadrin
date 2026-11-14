import assert from 'node:assert/strict';
import {affiliateUrl,tempusAffiliate} from '../src/data/affiliation.ts';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
import pauses from '../src/data/paused-tempus-destinations.json' with {type:'json'};
import {destinationPaused,merchantLinkAvailable,merchantInfoHref,orderLabel,emptyFilters,filterCatalogue} from '../src/lib/tempus-catalogue.ts';
assert.equal(pauses.length,11);assert.equal(new Set(pauses.map(p=>p.source)).size,pauses.length);
for(const pause of pauses){
 const p=data.products.find(p=>p.source===pause.source);assert(p);assert.equal(p.reference,pause.reference);assert.match(pause.checkedAt,/^\d{4}-\d{2}-\d{2}$/);assert.equal(pause.reason,'redirect-to-home');
 for(const url of [p.source,p.source+'?bg_ref=bDlTL8AyKb',p.source.replace('/products/','/en/products/'),p.source.replace('/products/','/en-de/products/')+'/'])assert(destinationPaused(url));
 assert.equal(merchantLinkAvailable(p),false);assert.match(orderLabel(p),/suspendu/);assert.match(orderLabel(p,true),/paused/);assert.equal(merchantInfoHref(p),'/catalogue/#liens-marchands');
 for(const order of ['open','preorder','order','unflagged'])assert(!filterCatalogue(data.products,{...emptyFilters,order}).some(v=>v.id===p.id));
 assert(filterCatalogue(data.products,emptyFilters).some(v=>v.id===p.id),'Keep the listing available for comparison');
}
for(const brand of ['Tissot','Hamilton','Mido']){const unlisted=data.products.find(p=>p.brand===brand&&!pauses.some(v=>v.source===p.source));assert(unlisted);assert(merchantLinkAvailable(unlisted),'Do not infer a brand-wide pause from samples');}
assert(!destinationPaused('https://example.com/products/tissot-prx-noir'));assert(!destinationPaused('invalid'));
for(const suffix of ['', '?variant=123', '?bg_ref=old&variant=123', '?bg_ref=old&bg_ref=duplicate#details']){
 const source='https://tempusshop.com/products/longines-flagship-heritage-moonphase-38-5mm-l4-815-4-02-3'+suffix;
 const result=new URL(affiliateUrl(source)),original=new URL(source);
 assert.equal(result.pathname,original.pathname);assert.equal(result.hash,original.hash);
 assert.deepEqual(result.searchParams.getAll('bg_ref'),[tempusAffiliate.code]);
 assert.equal(result.searchParams.get('variant'),original.searchParams.get('variant'));
 assert.equal(affiliateUrl(result.href),result.href);
}
for(const source of ['http://tempusshop.com/products/watch','https://example.com/products/watch','https://tempusshop.com.example.com/products/watch','https://user:pass@tempusshop.com/products/watch'])assert.throws(()=>affiliateUrl(source));
assert(!merchantLinkAvailable({brand:'Longines'}));assert.equal(merchantInfoHref({brand:'Longines'},true),'/en/brands/longines/');
console.log('PASS: 11 exact destination pauses, locale/query variants, ordering filters, preserved records, no inferred brand-wide pause');
