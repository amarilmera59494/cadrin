// Familles de coloris : une seule fiche par modèle, les autres coloris y sont listés.
// Même marque, même nom de modèle (référence retirée), même mouvement, même boîtier, même racine de référence.
// La fiche principale reste stable d'un jour à l'autre : analyse publiée, puis best-seller, puis prix le plus bas, puis plus petite référence.
// Écrit src/data/fiche-families.json (variante → fiche principale), lu par lib/fiches.ts et par finalize-build (redirections 301).
import {readFile,writeFile} from 'node:fs/promises';
import {ficheEligible,ficheSlugRaw} from '../src/lib/fiches.ts';
import {normalise} from '../src/lib/tempus-catalogue.ts';

const data=JSON.parse(await readFile('src/data/tempus-catalogue.json','utf8'));
const editorial=await readFile('src/data/editorial-links.ts','utf8');
const analysed=p=>editorial.includes(`'${p.reference}'`)||editorial.includes(`"${p.reference}"`);
const clean=s=>normalise(s||'').replace(/\s+/g,' ').trim();
const modelName=p=>clean(clean(p.title).replace(clean(p.reference),' ')).replace(/^[\s\-–—|,]+|[\s\-–—|,]+$/g,'').trim();
// Racine de référence : on retire le suffixe de coloris (« EFK-110D-2A » → « EFK-110D », « SM34012.04 » → « SM34012 »).
// Une référence sans séparateur (« SSB453 ») n'est regroupée que si elle est purement numérique et que le nom du modèle suffit (Lip).
const refRoot=r=>/[-.]/.test(r)?r.split(/[-.]/).slice(0,-1).join('-'):/^\d+$/.test(r)?'':r;

const groups=new Map();
for(const p of data.products.filter(ficheEligible)){
 const name=modelName(p),brandWords=clean(p.brand).split(' ').length,root=refRoot(p.reference);
 // Un nom réduit à la marque (« Casio ») ne suffit pas à dire que deux montres sont le même modèle.
 if(name.split(' ').length<=brandWords&&!/[-.]/.test(p.reference))continue;
 const key=[p.brand,name,p.movement,clean(p.caseSize),root].join('|');
 (groups.get(key)||groups.set(key,[]).get(key)).push(p);
}
const variants={},redirects=[];let families=0;
for(const list of groups.values()){
 if(list.length<2)continue;
 list.sort((a,b)=>Number(analysed(b))-Number(analysed(a))||Number(!!b.bestseller)-Number(!!a.bestseller)||a.price-b.price||a.reference.localeCompare(b.reference));
 const [main,...rest]=list,mainSlug=ficheSlugRaw(main);let used=false;
 for(const v of rest){const s=ficheSlugRaw(v);if(s===mainSlug)continue;variants[v.id]={primary:main.id,slug:mainSlug};redirects.push([s,mainSlug]);used=true;}
 if(used)families++;
}
redirects.sort((a,b)=>a[0].localeCompare(b[0]));
await writeFile('src/data/fiche-families.json',JSON.stringify({variants,redirects},null,1)+'\n');
console.log(`Familles de coloris : ${families} modèles, ${redirects.length} fiches regroupées.`);
