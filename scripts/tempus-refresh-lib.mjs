import {createHash} from 'node:crypto';
export const digest=value=>createHash('sha256').update(value).digest('hex');
export function prepareOffers(current,raw,checkedAt){
 if(!Array.isArray(raw)||raw.length<current.products.length*.9)throw Error('Incomplete catalogue: refusing to update.');
 const ids=new Set();for(const p of raw){if(ids.has(String(p.id)))throw Error('Duplicate remote ID');ids.add(String(p.id));}
 const byId=new Map(raw.map(p=>[String(p.id),p])),changes=[],blockers=[],products=[];
 for(const old of current.products){const p=byId.get(old.id);if(!p){blockers.push({id:old.id,reason:'missing-product'});products.push(old);continue;}
  const v=p.variants?.[0],sku=v?.sku?.trim();
  if(p.handle!==old.handle||p.variants?.length!==1||(sku&&sku!==old.reference)||p.images?.[0]?.src!==old.imageSource){blockers.push({id:old.id,reason:'identity-or-image-changed'});products.push(old);continue;}
  const price=Number(v.price),tags=(p.tags||[]).map(t=>t.toLowerCase());
  if(!Number.isFinite(price)||price<=0||price/old.price<.5||price/old.price>2||typeof v.available!=='boolean'){blockers.push({id:old.id,reason:'invalid-or-large-price-change'});products.push(old);continue;}
  const next={...old,price,orderable:v.available,order:tags.includes('precommande')?'preorder':tags.some(t=>['en commande','sur commande'].includes(t))?'order':'check'};
  const fields=['price','orderable','order'].filter(k=>old[k]!==next[k]);if(fields.length)changes.push({id:old.id,reference:old.reference,fields,before:Object.fromEntries(fields.map(k=>[k,old[k]])),after:Object.fromEntries(fields.map(k=>[k,next[k]]))});
  products.push(next);
 }
 return {catalogue:{...current,offersCheckedAt:checkedAt,products},changes,blockers,newProducts:raw.filter(p=>!current.products.some(c=>c.id===String(p.id))).map(p=>({id:String(p.id),title:p.title,productType:p.product_type}))};
}
