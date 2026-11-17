import {sizeNumber,type CatalogueProduct} from './tempus-catalogue';
export type Recommendation=CatalogueProduct&{styles:string[];reason:string;reasonEn:string;limit:string;limitEn:string};
export type Choice={budget:string;style:string;habit:string;size:string;dial:string};
export const blankChoice:Choice={budget:'',style:'',habit:'',size:'',dial:''};
export function recommendWatches(products:Recommendation[],choice:Choice){
 const matches=products.filter(p=>p.orderable&&Number.isFinite(p.price)&&p.price>0&&
  (!choice.budget||(Number(choice.budget)>0&&p.price<=Number(choice.budget)))&&
  (!choice.style||p.styles.includes(choice.style))&&
  (!choice.habit||(choice.habit==='simple'?['Quartz','Solaire'].includes(p.movement):p.movement==='Automatique'))&&
  (!choice.size||(sizeNumber(p.caseSize)!==null&&sizeNumber(p.caseSize)!<=Number(choice.size)))&&
  (!choice.dial||p.dialColors?.includes(choice.dial)));
 // A budget is the amount the visitor plans to spend: show the references that use it best, closest
 // to the ceiling first. A preorder comes last because its delivery date is not known. Without a
 // budget, the editorial order of the shortlist applies.
 const budget=Number(choice.budget)||0,editorial=new Map(products.map((p,i)=>[p.id,i]));
 const ranked=matches.slice().sort((a,b)=>Number(a.order==='preorder')-Number(b.order==='preorder')||(budget?b.price-a.price:0)||editorial.get(a.id)!-editorial.get(b.id)!);
 // Three different brands when the shortlist allows it, then the next best matches; ranked order is kept.
 const chosen=new Set<Recommendation>();
 for(const p of ranked)if(chosen.size<3&&![...chosen].some(x=>x.brand===p.brand))chosen.add(p);
 for(const p of ranked)if(chosen.size<3)chosen.add(p);
 const picks=ranked.filter(p=>chosen.has(p));
 // A cheaper alternative must satisfy exactly the same criteria. Never silently relax a preference.
 const cheapest=matches.slice().sort((a,b)=>a.price-b.price||a.id.localeCompare(b.id))[0];
 const lowest=Math.min(...picks.map(p=>p.price));
 const cheaper=cheapest&&picks.length&&!picks.includes(cheapest)&&cheapest.price<lowest?cheapest:null;
 return {picks,matches:ranked,cheaper};
}
