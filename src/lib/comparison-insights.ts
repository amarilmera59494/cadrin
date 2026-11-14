import {sizeNumber,merchantLinkAvailable,type CatalogueProduct} from './tempus-catalogue.ts';

export type ComparisonInsight={id:string;kicker:string;title:string;rows:{label:string;value:string}[];note:string;guide:{label:string;url:string}};
/** Documentary reading aids only: no fit prediction, sales ranking or inferred specifications. */
export function comparisonInsights(watches:CatalogueProduct[],en=false):ComparisonInsight[]{
 if(watches.length<2)return [];
 const t=(fr:string,english:string)=>en?english:fr;
 const number=(n:number)=>new Intl.NumberFormat(en?'en-GB':'fr-FR',{maximumFractionDigits:2}).format(n);
 const money=(n:number)=>new Intl.NumberFormat(en?'en-GB':'fr-FR',{style:'currency',currency:'EUR'}).format(n);
 const label=(p:CatalogueProduct)=>`${p.brand} · ${p.reference}`;
 const prices=watches.map(p=>p.price),priced=prices.every(n=>Number.isFinite(n)&&n>=0);
 const gap=priced?Math.round((Math.max(...prices)-Math.min(...prices))*100)/100:null;
 const sizes=watches.map(p=>sizeNumber(p.caseSize)),measured=sizes.every((n):n is number=>n!==null&&n>0);
 const min=measured?Math.min(...sizes):null,max=measured?Math.max(...sizes):null;
 const routines:Record<string,[string,string]>={
  Automatique:[t('Automatique','Automatic'),t('Le poignet remonte le mécanisme. Après un arrêt, il faut remettre la montre à l’heure.','Wrist movement winds the mechanism. Reset the time after the watch stops.')],
  Quartz:[t('Quartz','Quartz'),t('Prévoyez le remplacement de la pile selon la notice du modèle.','Plan for battery replacement according to the model’s manual.')],
  Solaire:[t('Solaire','Solar'),t('Laissez régulièrement le cadran recevoir de la lumière pour entretenir la charge.','Regularly expose the dial to light to maintain its charge.')],
  Manuel:[t('Remontage manuel','Hand-wound'),t('Le remontage fait partie du quotidien, au rythme indiqué dans la notice.','Winding is part of the routine; follow the interval in the manual.')],
  Connectée:[t('Connectée','Connected'),t('Vérifiez l’autonomie, la recharge et la compatibilité avec votre téléphone pour ce modèle précis.','Check battery life, charging and phone compatibility for this exact model.')],
 };
 const movementGroups=new Map<string,CatalogueProduct[]>();
 for(const p of watches){const key=routines[p.movement]?p.movement:'';movementGroups.set(key,[...(movementGroups.get(key)||[]),p]);}
 return [
  {id:'budget',kicker:t('Le budget','The budget'),title:gap===null?t('Prix à compléter','Prices to confirm'):gap===0?t('Même prix au relevé','Same recorded price'):t('Un écart de ','A difference of ')+money(gap),
   rows:watches.map(p=>({label:label(p),value:Number.isFinite(p.price)&&p.price>=0?money(p.price):t('Non renseigné','Not specified')})),
   note:watches.some(p=>!merchantLinkAvailable(p))?t('Un lien d’achat est suspendu : le prix conservé ne constitue pas une offre disponible.','A purchase link is paused: its recorded price is not an available offer.'):gap===0?t('À prix égal, le format et vos habitudes de port peuvent faire la différence.','At the same price, size and your wearing habits may decide it.'):gap===null?t('Complétez les prix manquants avant de comparer le budget total.','Confirm the missing prices before comparing the total budget.'):t('Le prix ne tranche pas à votre place. Regardez ce que le supplément change vraiment dans votre sélection.','Price alone will not decide it. Look at what spending more actually changes in your selection.'),
   guide:{label:t('Choisir selon son budget','Choosing within your budget'),url:en?'/en/guides/watches-by-budget/':'/guides/montres-par-budget/'}},
  {id:'size',kicker:t('Le format','The size'),title:!measured?t('Des mesures à lire au cas par cas','Read each set of dimensions'):min===max?t('Même dimension annoncée','Same listed case size'):t('De ','From ')+number(min!)+t(' à ',' to ')+number(max!)+' mm',
   rows:watches.map(p=>({label:label(p),value:(p.caseSize||t('Dimension non renseignée','Case size not specified'))+(p.thickness?t(' · épaisseur ',' · thickness ')+p.thickness:'')})),
   note:measured?t('La forme et la longueur du boîtier comptent aussi. Prenez comme repère une montre que vous portez déjà.','Case shape and length matter too. Use a watch you already wear as a reference.'):t('Une largeur, un diamètre et un format rectangulaire ne se comparent pas comme une seule mesure. Les dimensions absentes restent inconnues.','A width, a diameter and rectangular dimensions cannot be compared as one measurement. Missing dimensions remain unknown.'),
   guide:{label:t('Trouver le bon format','Finding the right fit'),url:en?'/en/guides/watch-size-and-fit/':'/guides/choisir-taille-montre/'}},
  {id:'routine',kicker:t('Au quotidien','The daily routine'),title:movementGroups.size===1&& !movementGroups.has('')?t('Un même type de mouvement','The same movement type'):t('Quel rythme vous convient ?','Which routine suits you?'),
   rows:[...movementGroups].map(([key,group])=>({label:group.map(label).join(' / '),value:key?routines[key].join(' — '):t('Mouvement non renseigné. Consultez la fiche exacte avant de choisir.','Movement not specified. Check the exact listing before choosing.')})),
   note:t('Un même type de mouvement ne signifie pas la même autonomie ou la même précision. La notice de chaque référence fait foi.','The same movement type does not mean the same running time or accuracy. Check each reference’s manual.'),
   guide:{label:t('Comprendre les mouvements','Understanding movements'),url:en?'/en/guides/automatic-quartz-or-solar/':'/guides/automatique-quartz-solaire/'}}
 ];
}
