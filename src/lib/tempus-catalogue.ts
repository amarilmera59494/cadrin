import pausedDestinations from '../data/paused-tempus-destinations.json' with {type:'json'};
export interface CatalogueProduct {
 id:string; handle:string; title:string; brand:string; reference:string; price:number;
 movement:string; category:string; order:string; orderable:boolean; image:string;
 width:number; height:number; source:string;
 dial?:string;dialColors?:string[];strap?:string;strapFamily?:string;caseSize?:string;thickness?:string;
 caseMaterial?:string;glass?:string;water?:string;calibre?:string;functions?:string;bestseller?:boolean;specCheckedAt?:string;
}
export type CatalogueFilters={q:string;brand:string;budget:string;movement:string;category:string;order:string;sort:string;dial?:string;strap?:string;size?:string;water?:string;collection?:string;feature?:string};
export const filterKeys=['q','brand','budget','dial','strap','movement','category','size','water','collection','feature','order','sort'] as const;
export const dialColours=['Noir','Bleu','Vert','Blanc','Argenté','Gris','Beige','Rose','Rouge','Marron','Jaune','Doré','Orange','Violet'];
export const normalise=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
/** One French typographic form for millimetre values: '45.4 mm' and '40mm' become '45,4 mm' and '40 mm'. */
export function sizeLabel(s='',en=false){const n=sizeNumber(s);return n===null?s:n.toLocaleString(en?'en-GB':'fr-FR',{maximumFractionDigits:2})+' mm';}
export function sizeNumber(s=''){const m=s.trim().match(/^(\d+(?:[.,]\d+)?)\s*mm$/i);return m?Number(m[1].replace(',','.')):null;}
// Read an explicit bar/ATM marking only. Metre-only values and prose stay unknown.
// This is a catalogue threshold, never a certification of suitability for an activity.
export function waterMark(s=''){
 const match=s.trim().match(/^(\d+(?:[.,]\d+)?)\s*(?:bar|atm)(?:\s*\([^()]*\))?$/i)
  ||s.trim().match(/^\d+(?:[.,]\d+)?\s*(?:m|mètres|metres)\s*\((\d+(?:[.,]\d+)?)\s*(?:bar|atm)\)$/i);
 return match?Number(match[1].replace(',','.')):null;
}
export const emptyFilters:CatalogueFilters={q:'',brand:'',budget:'',movement:'',category:'',order:'',sort:'',dial:'',strap:'',size:'',water:'',collection:'',feature:''};
export function filterCatalogue(products:CatalogueProduct[],f:CatalogueFilters){
 const terms=normalise(f.q.slice(0,100)).split(/\s+/).filter(Boolean);
 const rows=products.filter(p=>{
  const haystack=normalise(`${p.brand} ${p.title} ${p.reference}`),compact=haystack.replace(/[^a-z0-9]/g,'');
  const size=sizeNumber(p.caseSize),water=waterMark(p.water);
  return terms.every(t=>haystack.includes(t)||compact.includes(t.replace(/[^a-z0-9]/g,'')))&&(!f.brand||p.brand===f.brand)&&
   (!f.budget||(Number(f.budget)>0&&p.price<=Number(f.budget)))&&(!f.dial||p.dialColors?.includes(f.dial))&&
   (!f.strap||p.strapFamily===f.strap)&&(!f.size||(size!==null&&size<=Number(f.size)))&&
   (!f.water||(['5','10','20'].includes(f.water)&&water!==null&&water>=Number(f.water)))&&
   (!f.collection||(f.collection==='best'&&p.bestseller===true))&&(!f.feature||normalise(p.functions||'').includes(normalise(f.feature)))&&
   (!f.movement||p.movement===f.movement)&&(!f.category||p.category===f.category)&&
   (!f.order||(merchantLinkAvailable(p)&&(f.order==='unflagged'?p.order==='check'&&p.orderable:f.order==='open'?p.orderable:p.order===f.order)));
 });
 if(!f.sort)return defaultOrder(rows);
 return rows.sort((a,b)=>(f.sort==='price'?a.price-b.price:f.sort==='price-desc'?b.price-a.price:f.sort==='size'?(sizeNumber(a.caseSize)??Infinity)-(sizeNumber(b.caseSize)??Infinity):0)||a.brand.localeCompare(b.brand,'fr')||a.title.localeCompare(b.title,'fr')||a.id.localeCompare(b.id));
}
/** Ready to order now (not preorder, link active). Availability, never commission, drives the default order. */
export const readyToOrder=(p:CatalogueProduct)=>p.orderable&&p.order!=='preorder'&&merchantLinkAvailable(p);
// Default order: watches that can be ordered now first, then Tempus bestsellers, then brands in turn
// (the most accessible watch of each brand, then the next one) so a first page never shows one brand only.
function defaultOrder(rows:CatalogueProduct[]){
 const tier=(p:CatalogueProduct)=>Number(readyToOrder(p))*2+Number(!!p.bestseller);
 const byTier=(a:CatalogueProduct,b:CatalogueProduct)=>tier(b)-tier(a)||a.price-b.price||a.id.localeCompare(b.id);
 const rank=new Map<CatalogueProduct,number>(),seen=new Map<string,number>();
 for(const p of rows.slice().sort(byTier)){const key=tier(p)+'|'+p.brand,n=seen.get(key)??0;rank.set(p,n);seen.set(key,n+1);}
 return rows.sort((a,b)=>tier(b)-tier(a)||rank.get(a)!-rank.get(b)!||a.price-b.price||a.brand.localeCompare(b.brand,'fr')||a.id.localeCompare(b.id));
}
export function detailRows(p:CatalogueProduct,en=false):[string,string][]{return [[en?'Dial':'Cadran',p.dial],[en?'Case size':'Dimension du boîtier',p.caseSize&&sizeLabel(p.caseSize,en)],[en?'Thickness':'Épaisseur',p.thickness&&sizeLabel(p.thickness,en)],[en?'Case material':'Boîtier',p.caseMaterial],[en?'Strap / bracelet':'Bracelet',p.strap],[en?'Crystal':'Verre',p.glass],[en?'Calibre':'Calibre',p.calibre],[en?'Functions':'Fonctions',p.functions],[en?'Water resistance':'Étanchéité',p.water]].filter((r):r is [string,string]=>!!r[1]);}
// Nine tested Longines destinations redirect to the shop homepage (14 November 2026).
// Pause this brand's purchase links pending a verified repair; catalogue data is retained.
const pausedPaths=new Set(pausedDestinations.map(p=>new URL(p.source).pathname));
export function destinationPaused(source:string){
 try{const url=new URL(source);return url.hostname==='tempusshop.com'&&pausedPaths.has(url.pathname.replace(/^\/[a-z]{2}(?:-[a-z]{2})?\/products\//i,'/products/').replace(/\/$/,''));}catch{return false;}
}
type MerchantIdentity=Pick<CatalogueProduct,'brand'>&Partial<Pick<CatalogueProduct,'source'>>;
export const merchantLinkAvailable=(p:MerchantIdentity)=>p.brand!=='Longines'&&(!p.source||!destinationPaused(p.source));
export const merchantInfoHref=(p:MerchantIdentity,en=false)=>p.brand==='Longines'?(en?'/en/brands/longines/':'/marques/longines/'):(en?'/en/catalogue/#liens-marchands':'/catalogue/#liens-marchands');
export const merchantInfoLabel=(p:MerchantIdentity,en=false)=>p.brand==='Longines'?(en?'Read the Longines guide':'Lire le dossier Longines'):(en?'Why this link is paused':'Pourquoi ce lien est suspendu');
export function purchaseLabel(p:Pick<CatalogueProduct,'orderable'|'order'>,en=false){
 if(!p.orderable)return en?'Check at Tempus':'Vérifier chez Tempus';
 if(p.order==='preorder')return en?'Preorder at Tempus':'Précommander chez Tempus';
 if(p.order==='order')return en?'Order at Tempus':'Commander chez Tempus';
 return en?'Buy at Tempus':'Acheter chez Tempus';
}
/** Suggest explicit, single-filter changes. Never silently widen a budget or selection. */
export function filterRecovery(products:CatalogueProduct[],filters:CatalogueFilters){
 return filterKeys.filter(key=>key!=='sort'&&!!filters[key]).map(key=>({
  key,count:filterCatalogue(products,{...filters,[key]:''}).length
 })).filter(option=>option.count>0).sort((a,b)=>a.count-b.count).slice(0,3);
}
export function orderLabel(p:CatalogueProduct,en=false){
 if(!merchantLinkAvailable(p))return p.brand==='Longines'?(en?'Longines purchase links temporarily unavailable':'Liens d’achat Longines temporairement indisponibles'):(en?'Purchase link temporarily paused':'Lien d’achat temporairement suspendu');
 if(!p.orderable)return en?'Ordering unavailable at the last check':'Commande indisponible au relevé';
 if(p.order==='preorder')return en?'Listed as a preorder':'En précommande chez Tempus';
 if(p.order==='order')return en?'Listed as available to order':'Sur commande chez Tempus';
 return en?'Stock and lead time: check with Tempus':'Stock et délai à confirmer chez Tempus';
}
