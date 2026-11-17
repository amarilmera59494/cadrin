import {sizeNumber,type CatalogueProduct} from './tempus-catalogue';
// `origin`: "editorial" for the commented shortlist, "catalogue" for a documented catalogue listing whose
// reason and limit are derived from its own specifications (never a guess).
export type Recommendation=CatalogueProduct&{styles:string[];reason:string;reasonEn:string;limit:string;limitEn:string;origin?:'editorial'|'catalogue'};
export type Choice={who:string;budget:string;style:string;habit:string;size:string;dial:string};
export const blankChoice:Choice={who:'',budget:'',style:'',habit:'',size:'',dial:''};
// Casio and G-Shock are one maker for the visitor: variety means a different maker, not a different label.
const family=(p:CatalogueProduct)=>p.brand==='G-Shock'?'Casio':p.brand;
// A budget is the amount the visitor plans to spend. Picks come from the band that uses it
// (60 % to 100 % of the ceiling); cheaper watches only fill the gaps, and stay visible as "spend less".
export const budgetFloor=(budget:number)=>budget*.6;
export function recommendWatches(products:Recommendation[],choice:Choice){
 const budget=Number(choice.budget)||0;
 const matches=products.filter(p=>p.orderable&&Number.isFinite(p.price)&&p.price>0&&
  (!choice.who||(choice.who==='him'?p.category!=='Femme':choice.who==='her'?p.category!=='Homme':true))&&
  (!choice.budget||(budget>0&&p.price<=budget))&&
  (!choice.style||p.styles.includes(choice.style))&&
  (!choice.habit||(choice.habit==='simple'?['Quartz','Solaire'].includes(p.movement):p.movement==='Automatique'))&&
  (!choice.size||(sizeNumber(p.caseSize)!==null&&sizeNumber(p.caseSize)!<=Number(choice.size)))&&
  (!choice.dial||p.dialColors?.includes(choice.dial)));
 const editorial=new Map(products.map((p,i)=>[p.id,i]));
 const inBand=(p:Recommendation)=>!budget||p.price>=budgetFloor(budget);
 // For a man, a pink dial is never removed, only shown after the other matches.
 const late=(p:Recommendation)=>Number(p.order==='preorder')*2+Number(choice.who==='him'&&!!p.dialColors?.includes('Rose'));
 const ranked=matches.slice().sort((a,b)=>late(a)-late(b)||Number(inBand(b))-Number(inBand(a))||
  Number(b.origin!=='catalogue')-Number(a.origin!=='catalogue')||(budget?b.price-a.price:0)||editorial.get(a.id)!-editorial.get(b.id)!);
 // Three makers inside the band when possible, then the next best matches in ranked order.
 const chosen=new Set<Recommendation>();
 for(const p of ranked)if(chosen.size<3&&inBand(p)&&late(p)===0&&![...chosen].some(x=>family(x)===family(p)))chosen.add(p);
 for(const p of ranked)if(chosen.size<3)chosen.add(p);
 const picks=ranked.filter(p=>chosen.has(p));
 // A cheaper alternative must satisfy exactly the same criteria. Never silently relax a preference.
 const cheapest=matches.filter(p=>p.order!=='preorder').sort((a,b)=>a.price-b.price||a.id.localeCompare(b.id))[0];
 const lowest=Math.min(...picks.map(p=>p.price));
 const cheaper=cheapest&&picks.length&&!picks.includes(cheapest)&&cheapest.price<lowest?cheapest:null;
 return {picks,matches:ranked,cheaper};
}
