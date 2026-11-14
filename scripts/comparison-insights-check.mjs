import assert from 'node:assert/strict';
import {comparisonInsights} from '../src/lib/comparison-insights.ts';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
const find=ref=>data.products.find(p=>p.reference===ref);
const pink=find('NJ0200-50Z'),black=find('NJ0150-81E'),solar=find('AW0102-13AE'),rect=find('A158WEA-1EF');
assert.deepEqual(comparisonInsights([]),[]);assert.deepEqual(comparisonInsights([pink]),[]);
const pair=comparisonInsights([pink,black]);assert.match(pair[0].title,/Même prix/);assert.equal(pair[1].title,'De 37 à 40 mm');assert.equal(pair[2].rows.length,1);assert(pair[2].rows[0].label.includes(black.reference));
const mixed=comparisonInsights([pink,solar],true);assert.equal(mixed[0].title,'A difference of €179.80');assert.equal(mixed[2].rows.length,2);assert(mixed[2].rows.some(r=>r.value.includes('light')));assert(mixed.every(r=>r.guide.url.startsWith('/en/')));
const uncertain=comparisonInsights([pink,rect]);assert.match(uncertain[1].title,/cas par cas/);assert(uncertain[1].rows.some(r=>r.value.includes('36,8 mm x 33,2 mm')));assert(uncertain[2].rows.some(r=>r.value.includes('non renseigné')));
const missing=comparisonInsights([{...pink,price:NaN,caseSize:'',movement:'unknown'},solar]);assert.equal(missing[0].title,'Prix à compléter');assert.match(missing[0].rows[0].value,/Non renseigné/);assert.match(missing[1].rows[0].value,/non renseignée/);
const paused=comparisonInsights([find('T137.410.11.051.00'),pink]);assert.match(paused[0].note,/suspendu/);
assert.equal(comparisonInsights([{...pink,price:0.1,caseSize:'37,0 mm'},{...pink,id:'other',price:0.3,caseSize:'37mm'}],true)[0].title,'A difference of €0.20');
assert.equal(comparisonInsights([{...pink,caseSize:'37,0 mm'},pink])[1].title,'Même dimension annoncée');
assert.equal(comparisonInsights([{...pink,caseSize:'0 mm'},black])[1].title,'Des mesures à lire au cas par cas');
for(const en of [false,true])for(let i=0;i<data.products.length;i+=3){const result=comparisonInsights(data.products.slice(i,i+3),en);assert(!JSON.stringify(result).match(/NaN|Infinity|undefined/));}
console.log('PASS: comparison insights; same prices, decimal arithmetic, mixed/unknown movements, missing or rectangular sizes, paused links and full catalogue batches');
