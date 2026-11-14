import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {dialFromDescription,functionsFromTitle} from './tempus-description-facts.mjs';
import {sourceLabel,hasSourceLabel} from '../src/lib/source-labels.ts';
import {emptyFilters,filterCatalogue} from '../src/lib/tempus-catalogue.ts';
import data from '../src/data/tempus-catalogue.json' with {type:'json'};
import {features} from '../src/data/features.ts';

for(const [text,expected]of [
 ['Un cadran bleu avec des aiguilles rouges et un bracelet vert.',['Bleu']],
 ['Cadran numérique gris soleillé.',['Gris']],
 ['Cadran bleu et argenté, bracelet noir.',['Bleu','Argenté']],
 ['Cadran ivoire.',['Beige']],
 ['Cadran bleuâtre.',[]],['Bracelet bleu et aiguilles vertes.',[]],
 ['Sans cadran noir.',[]],['Contrairement au modèle à cadran bleu, celui-ci change de style.',[]],
 ['<p>Cadran <strong>violet</strong> ajoute une touche de couleur.</p>',['Violet']],
 ['Un cadran orange transparent accueille à 3h un affichage jour/date.',['Orange']]
])assert.deepEqual(dialFromDescription(text).dialColors,expected,text);
assert.equal(dialFromDescription('Cadran rouge ajoute une touche de couleur.').dial,'Rouge');
for(const text of ['Type 26 Aéronavale DLC','Montre sans Bluetooth','Chronograph-inspired watch','Hommage aux chronographes militaires','Sans GMT'])assert.equal(functionsFromTitle(text),'',text);
assert.equal(functionsFromTitle('Montre Chronographe GMT bleu'),'Chronographe, GMT');
assert.equal(data.products.find(p=>p.reference==='T26DLC').functions,'');
assert.equal(data.products.find(p=>p.reference==='F-91W-1YEG').functions,'Chronomètre, Alarme');
assert.ok(data.products.find(p=>p.reference==='025115').functions.includes('GPS'));
const paused={...data.products[0],id:'paused',brand:'Longines',orderable:true};
for(const order of ['open','unflagged','preorder','order'])assert.equal(filterCatalogue([{...paused,order:order==='unflagged'?'check':order}],{...emptyFilters,order}).length,0);
assert.equal(filterCatalogue([paused],emptyFilters).length,1);
assert.equal(filterCatalogue(data.products,{...emptyFilters,brand:'Longines',order:'open'}).length,0);
assert.ok(filterCatalogue(data.products,{...emptyFilters,order:'open'}).length>0);
let citations=0;
for(const dir of ['guides','watches'])for(const file of await readdir('src/content/'+dir)){
 if(!file.endsWith('.md'))continue;
 const text=await readFile('src/content/'+dir+'/'+file,'utf8');if(!/^status: "published"/m.test(text))continue;
 for(const source of JSON.parse(text.match(/^sources: (.+)$/m)?.[1]||'[]')){assert.ok(hasSourceLabel(source.url),source.url);citations++;}
}
for(const source of features.flatMap(f=>f.sources)){assert.ok(hasSourceLabel(source.url),source.url);citations++;}
const p=data.products.find(p=>p.reference==='GA-2100-1A1ER');assert.equal(sourceLabel(p.source.replace('/products/','/en/products/')+'?bg_ref=example'),`Tempus — ${p.brand} ${p.reference}`);
assert.equal(sourceLabel('https://example.org/doc'), 'example.org — source document');
console.log(JSON.stringify({descriptionParsing:'PASS',negationAndHistoricalMentions:'PASS',pausedOrderingFilters:'PASS',labelledCitations:citations}));
