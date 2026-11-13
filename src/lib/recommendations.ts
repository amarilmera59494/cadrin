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
 const picks=matches.slice(0,3);
 // A cheaper alternative must satisfy exactly the same criteria. Never silently relax a preference.
 const cheapest=matches.slice().sort((a,b)=>a.price-b.price||a.id.localeCompare(b.id))[0];
 const cheaper=cheapest&&picks.length&&cheapest.price<picks[0].price?cheapest:null;
 return {picks,matches,cheaper};
}
