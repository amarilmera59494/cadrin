import {readFile,readdir,mkdir,writeFile,access} from 'node:fs/promises';
import {publishable} from '../src/data/publication.ts';
import {destinations,validDestination} from '../src/data/destinations.ts';
import {imageRegistry} from '../src/data/image-registry.ts';
import {clearedPhoto} from '../src/data/product-photos.ts';
import {launch} from '../src/data/launch.ts';
const items=[];const errors=[];
for(const collection of ['watches','guides','selections'])for(const name of await readdir(`src/content/${collection}`)){
 const text=await readFile(`src/content/${collection}/${name}`,'utf8');const front=text.split('---')[1];const data=Object.fromEntries(front.trim().split('\n').map(line=>{const i=line.indexOf(':');return[line.slice(0,i),JSON.parse(line.slice(i+1).trim())]}));
 const blockers=[];if(data.status!=='published')blockers.push('brouillon');if(!data.reviewer)blockers.push('relecture humaine absente');if(!data.sources.length)blockers.push('sources absentes');if(!data.verifiedAt)blockers.push('date de vérification absente');if(data.rights!=='approved')blockers.push('droits non validés');if(collection==='watches'&&!data.image)blockers.push('photo de la référence exacte absente');
 if(data.image&&collection==='watches'){const photo=clearedPhoto(data.image,data.reference);if(!photo)errors.push(`${name}: image sans correspondance ou autorisation documentée`);else {try{await access('public'+photo.src);await access(photo.permissionFile)}catch{errors.push(`${name}: image ou preuve de droits absente`)}}}
 if(collection==='watches' && data.price!==null && (!data.priceCheckedAt || !validDestination(destinations[name.slice(0,-3)]))) errors.push(name+': prix sans relevé daté ou destination marchande');
 items.push({collection,id:name.replace('.md',''),publishable:publishable(data),blockers,data});
}
for(const item of items.filter(i=>i.collection==='selections'))for(const id of item.data.watches){const w=items.find(i=>i.collection==='watches'&&i.id===id);if(!w)errors.push(`${item.id}: référence orpheline ${id}`);else if(!w.publishable)item.blockers.push(`montre non publiable: ${id}`)}
for(const [id,d]of Object.entries(destinations)){if(!validDestination(d))errors.push(`${id}: URL marchand invalide`);const watch=items.find(i=>i.id===id);if(!watch||watch.data.reference!==d.reference)errors.push(`${id}: référence marchande différente`)}
for(const image of Object.values(imageRegistry))for(const path of image.files){try{await access('public'+path)}catch{errors.push(`Asset absent: ${path}`)}}
const launchBlockers=[];
if(!launch.legalIdentity||!launch.legalPagesApproved||!launch.contactVerified)launchBlockers.push('Identité juridique, mentions légales, contact et confidentialité à compléter');
if(!launch.editorialApproved)launchBlockers.push('Validation éditoriale globale manquante');
const ready=!errors.length&&!launchBlockers.length&&items.every(i=>!i.blockers.length);
const report={checkedAt:'2026-11-13',items:items.map(({data,...r})=>r),errors,launchBlockers,affiliationPending:'Admission Tempus et véritables liens affiliés non fournis ; liens actuels ordinaires',ready};
await mkdir('evidence/cadrin',{recursive:true});await writeFile('evidence/cadrin/content-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(errors.length||(process.argv.includes('--strict')&&!ready))process.exitCode=1;
