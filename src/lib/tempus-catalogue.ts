export interface CatalogueProduct {
 id:string; handle:string; title:string; brand:string; reference:string; price:number;
 movement:string; category:string; order:string; orderable:boolean; image:string;
 width:number; height:number; source:string;
}
export type CatalogueFilters={q:string;brand:string;budget:string;movement:string;category:string;order:string;sort:string};
export const filterKeys=['q','brand','budget','movement','category','order','sort'] as const;
const normalise=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filterCatalogue(products:CatalogueProduct[],f:CatalogueFilters){
 const terms=normalise(f.q.slice(0,100)).split(/\s+/).filter(Boolean);
 const rows=products.filter(p=>{
  const haystack=normalise(`${p.brand} ${p.title} ${p.reference}`);
  return terms.every(t=>haystack.includes(t))&&(!f.brand||p.brand===f.brand)&&
   (!f.budget||(Number(f.budget)>0&&p.price<=Number(f.budget)))&&
   (!f.movement||p.movement===f.movement)&&(!f.category||p.category===f.category)&&
   (!f.order||(f.order==='unflagged'?p.order==='check'&&p.orderable:p.order===f.order));
 });
 return rows.sort((a,b)=>(f.sort==='price'?a.price-b.price:f.sort==='price-desc'?b.price-a.price:0)||a.brand.localeCompare(b.brand,'fr')||a.title.localeCompare(b.title,'fr')||a.id.localeCompare(b.id));
}
export function orderLabel(p:CatalogueProduct,en=false){
 if(!p.orderable)return en?'Ordering unavailable at the last check':'Commande indisponible au relevé';
 if(p.order==='preorder')return en?'Listed as a preorder':'Signalée en précommande';
 if(p.order==='order')return en?'Listed as made available to order':'Signalée sur commande';
 return en?'Stock and lead time: check with Tempus':'Stock et délai à confirmer chez Tempus';
}
