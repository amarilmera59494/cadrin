import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {filterCatalogue,emptyFilters,sizeNumber,waterMark} from '../src/lib/tempus-catalogue.ts';import {parseSpecs,colourFamily,matchesReference} from './import-tempus-specifications.mjs';
import {guideExamples} from './remark-guide-examples.mjs';
const d=JSON.parse(await readFile('src/data/tempus-catalogue.json','utf8')),best=JSON.parse(await readFile('src/data/tempus-bestsellers.json','utf8')),groups=JSON.parse(await readFile('src/data/guide-examples.json','utf8'));
for(const [key,group]of Object.entries(groups))for(const [ref]of group){const p=d.products.find(p=>p.reference===ref);assert.ok(p,key+': '+ref);if(key.startsWith('budget-'))assert.ok(p.price<=Number(key.split('-')[1]),key+': '+ref+' over budget');}
// A comparison must contain exactly the watches shown immediately above it.
for(const [key,group] of Object.entries(groups))for(const en of [false,true]){
 const html=guideExamples(key,en),link=html.match(/data-compare-group="[^"]+" href="([^"]+)"/);
 const eligible=group.length>=2&&group.length<=3&&key!=='home'&&!key.startsWith('watch-');
 assert.equal(!!link,eligible,key);
 if(link){const url=new URL(link[1],'https://cadrin.fr');assert.equal(url.pathname,en?'/en/catalogue/':'/catalogue/');assert.equal(url.hash,'#catalogue-comparison');assert.deepEqual(url.searchParams.get('compare').split(','),group.map(([ref])=>d.products.find(p=>p.reference===ref).id));}
}
for(const p of d.products){assert.equal(p.bestseller,best.ids.includes(p.id));assert.ok(Array.isArray(p.dialColors));}
for(const colour of ['Bleu','Vert','Noir']){const matches=filterCatalogue(d.products,{...emptyFilters,dial:colour});assert.ok(matches.length>0);assert.ok(matches.every(p=>p.dialColors.includes(colour)));}
assert.ok(filterCatalogue(d.products,{...emptyFilters,collection:'best'}).every(p=>p.bestseller));assert.equal(filterCatalogue(d.products,{...emptyFilters,q:'F91W1YEG'})[0].reference,'F-91W-1YEG');
assert.equal(sizeNumber('38,20 mm x 33,20 mm x 8,50 mm'),null);assert.equal(sizeNumber('38,5 mm'),38.5);
const rows=parseSpecs('<div class="table"><h3>Cadran</h3><div class="ligne"><span class="description">Couleur</span><span class="contenu">Bleu nuit</span></div></div><div class="table"><h3>Autres détails</h3><div class="ligne"><span class="description">Résistance à l&#39;eau</span><a class="contenu" href="/terms">5 ATM</a></div></div>');assert.equal(rows[0].value,'Bleu nuit');assert.equal(rows[1].value,'5 ATM');assert.deepEqual(colourFamily('Bleu nuit'),['Bleu']);assert.deepEqual(colourFamily('Non renseigné'),[]);
const unknown={...d.products[0],id:'fixture',dialColors:[],strapFamily:'',caseSize:'',functions:'',bestseller:false};for(const f of [{dial:'Bleu'},{strap:'Acier'},{size:'40'},{feature:'GPS'},{collection:'best'}])assert.equal(filterCatalogue([unknown],{...emptyFilters,...f}).length,0);
const gps=filterCatalogue(d.products,{...emptyFilters,feature:'GPS'});assert.ok(gps.some(p=>p.reference==='025115'));assert.ok(!gps.some(p=>p.reference==='GBD-200-2ER'));
console.log(JSON.stringify({products:d.products.length,groups:Object.keys(groups).length,coloursAndMissingData:true,caseSize:true,bestsellerSource:true,gpsDistinction:true}));

const specs=JSON.parse(await readFile('src/data/tempus-specifications.json','utf8'));for(const [id,r]of Object.entries(specs.records)){const p=d.products.find(p=>p.id===id);assert.ok(p&&matchesReference(p,r),'Technical table reference mismatch: '+id);}assert.equal(matchesReference({id:'test',source:'https://example.org',reference:'BLUE-1'},{source:'https://example.org',rows:[{label:'Référence',value:'GREEN-1'}]}),false);

assert.deepEqual(d.products.find(p=>p.reference==='NJ0200-50Z').dialColors,['Rose']);

const homeOrderable=groups.home.filter(([ref])=>d.products.find(p=>p.reference===ref)?.orderable).map(([ref])=>ref);assert.ok(homeOrderable.length>=3,'Home selection needs at least 3 orderable listings: '+homeOrderable.join(', '));
assert.equal(d.market.country,'FR');assert.equal(d.market.currency,'EUR');

// Explicit markings, not guessed activities or depth conversions.
for(const [label,value] of [['20 Bar (ISO 22810)',20],['5 ATM (50 mètres)',5],['100 m (10 bar)',10],['20 ATM',20],['3,5 bar',3.5],['100 m',null],['Non étanche',null],['',null],['20 ATM sauf immersion',null],['5 ATM / 10 ATM',null]])assert.equal(waterMark(label),value,label);
const waterFixtures=['3 ATM','5 ATM','10 ATM','20 ATM','100 m','','10 ATM (100m)'].map((water,i)=>({...d.products[0],id:String(i),water}));
for(const [water,count] of [['5',4],['10',3],['20',1],['NaN',0],['-1',0],['0',0],['100',0]])assert.equal(filterCatalogue(waterFixtures,{...emptyFilters,water}).length,count,water);
const aquatic=filterCatalogue(d.products,{...emptyFilters,water:'20',brand:'G-Shock',budget:'150'});
assert.ok(aquatic.some(p=>p.reference==='GA-2100-1A1ER'));assert.ok(aquatic.every(p=>waterMark(p.water)>=20&&p.price<=150));
console.log(JSON.stringify({waterMarking:'PASS',waterCombinedFilter:aquatic.length,missingWaterExcluded:true}));
