import {readFile,writeFile,mkdir,access}from'node:fs/promises';import sharp from'sharp';
// Explicit maintenance command. Never runs during a normal build or deployment.
if(!process.argv.includes('--refresh'))throw Error('Use --refresh to retrieve the public Tempus catalogue.');
await mkdir('evidence/tempus-catalogue',{recursive:true});let products=[];const pages=[];const checkedAt=new Date().toISOString();
for(let page=1;page<=100;page++){const r=await fetch(`https://tempusshop.com/products.json?limit=250&page=${page}`,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);const batch=(await r.json()).products;pages.push({page,count:batch.length});products.push(...batch);if(batch.length<250)break;if(page===100)throw Error('Pagination limit reached; snapshot not complete');}
if(new Set(products.map(p=>p.id)).size!==products.length)throw Error('Duplicate IDs: catalogue changed during pagination; retry.');
const currency=await (await fetch('https://tempusshop.com/cart.js')).json();if(currency.currency!=='EUR')throw Error('Expected EUR');
await writeFile('evidence/tempus-catalogue/raw.json',JSON.stringify({checkedAt,pages,products},null,2));
let previous=[];try{previous=JSON.parse(await readFile('src/data/tempus-catalogue.json','utf8')).products}catch{}
const oldSources=new Map(previous.map(p=>[p.id,p.imageSource]));
await mkdir('public/images/catalogue',{recursive:true});const excluded=[],items=[];
for(const p of products){const v=p.variants[0],img=p.images[0];let reason='';
 if(!['Montre','Montres'].includes(p.product_type))reason='not-watch';else if(p.variants.length!==1)reason='multiple-variants';else if(!v?.sku?.trim())reason='missing-sku';else if(!img?.src||img.product_id!==p.id||new URL(img.src).hostname!=='cdn.shopify.com')reason='missing-approved-image';else if(!(Number(v.price)>0))reason='invalid-price';
 if(reason){excluded.push({id:p.id,title:p.title,reason});continue;}
 const tags=p.tags.map(t=>t.toLowerCase());const movement=tags.some(t=>['eco-drive','solar'].includes(t))?'Solaire':tags.includes('automatique')?'Automatique':tags.includes('quartz')?'Quartz':tags.includes('manuel')?'Manuel':'';
 const category=tags.some(t=>['femme','woman'].includes(t))?'Femme':tags.includes('homme')?'Homme':tags.includes('enfant')?'Enfant':'';
 const order=tags.includes('precommande')?'preorder':tags.some(t=>['en commande','sur commande'].includes(t))?'order':'check';
 items.push({id:String(p.id),handle:p.handle,title:p.title,brand:p.vendor,reference:v.sku.trim(),price:Number(v.price),movement,category,order,orderable:v.available===true,image:`/images/catalogue/${p.id}.webp`,imageSource:img.src,width:400,height:500,source:`https://tempusshop.com/products/${p.handle}`});
}
let done=0;const errors=[];let index=0;
async function worker(){while(index<items.length){const p=items[index++];try{const path='public'+p.image;try{await access(path);if(oldSources.get(p.id)!==p.imageSource)throw Error('Image changed')}catch{const u=new URL(p.imageSource);u.searchParams.set('width','400');const r=await fetch(u,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);const b=await sharp(Buffer.from(await r.arrayBuffer())).resize(400,500,{fit:'contain',background:'#ffffff',withoutEnlargement:true}).webp({quality:78}).toBuffer();await writeFile(path,b);}const meta=await sharp(path).metadata();p.width=meta.width;p.height=meta.height;}catch(e){errors.push({id:p.id,error:String(e)});}done++;if(done%300===0)console.log(done+'/'+items.length);}}
await Promise.all(Array.from({length:6},worker));
if(errors.length){await writeFile('evidence/tempus-catalogue/import-errors.json',JSON.stringify(errors,null,2));throw Error('Asset download failed; existing catalogue preserved.');}
const valid=items.filter(p=>!errors.some(e=>e.id===p.id)).sort((a,b)=>a.brand.localeCompare(b.brand,'fr')||a.title.localeCompare(b.title,'fr'));
const out={checkedAt:checkedAt.slice(0,10),currency:'EUR',pageSize:48,sourceCount:products.length,permissionFile:'licenses/tempus-media.md',products:valid};
await writeFile('src/data/catalogue-meta.ts',`export const cataloguePages = ${Math.ceil(valid.length/out.pageSize)};\n`);
await writeFile('src/data/tempus-catalogue.json',JSON.stringify(out));
await writeFile('public/catalogue.json',JSON.stringify({...out,products:valid.map(({imageSource,...p})=>p)}));
await writeFile('evidence/tempus-catalogue/import-report.json',JSON.stringify({pages,imported:valid.length,excluded,errors},null,2));
console.log(JSON.stringify({imported:valid.length,excluded:excluded.length,errors}));if(errors.length)process.exitCode=1;
