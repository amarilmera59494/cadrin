import assert from 'node:assert/strict';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
import {emptyFilters,filterCatalogue,filterRecovery,purchaseLabel,merchantLinkAvailable} from '../src/lib/tempus-catalogue.ts';

const filters={...emptyFilters,brand:'Casio',q:'GA-2100'};
assert.equal(filterCatalogue(data.products,filters).length,0);
const before=JSON.stringify(filters),recovery=filterRecovery(data.products,filters);
assert.ok(recovery.some(option=>option.key==='brand'&&option.count>0));
assert.equal(JSON.stringify(filters),before,'Suggestions must not mutate the requested filters');
for(const option of recovery)assert.equal(option.count,filterCatalogue(data.products,{...filters,[option.key]:''}).length);
assert.equal(filterRecovery(data.products,{...emptyFilters,q:'unknown-reference-no-match',budget:'50'}).find(r=>r.key==='q')?.count,filterCatalogue(data.products,{...emptyFilters,budget:'50'}).length);
assert.equal(filterRecovery(data.products,{...emptyFilters}).length,0);
assert.equal(purchaseLabel({orderable:false,order:'preorder'}),'Vérifier chez Tempus');
assert.equal(purchaseLabel({orderable:true,order:'preorder'}),'Précommander chez Tempus');
assert.equal(purchaseLabel({orderable:true,order:'order'},true),'Order at Tempus');
assert.equal(purchaseLabel({orderable:true,order:'check'},true),'Buy at Tempus');
assert.equal(merchantLinkAvailable({brand:'Longines'}),false);
console.log('PASS: exact filter recovery counts, unchanged criteria, purchase labels by ordering status, Longines suspension');
