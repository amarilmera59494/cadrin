import {filterCatalogue,filterKeys,orderLabel,type CatalogueFilters,type CatalogueProduct} from '../lib/tempus-catalogue';
import {affiliateUrl} from '../data/affiliation';
const host=document.querySelector<HTMLElement>('[data-catalogue]');
if(host) initialise(host);
async function initialise(host:HTMLElement){
 const en=document.documentElement.lang==='en',t=(fr:string,english:string)=>en?english:fr;
 const form=document.querySelector<HTMLFormElement>('#catalogue-filters')!;
 const cards=document.querySelector<HTMLElement>('#catalogue-cards')!;
 const pager=document.querySelector<HTMLElement>('#catalogue-pagination')!;
 const count=document.querySelector<HTMLElement>('#catalogue-count')!;
 const comparison=document.querySelector<HTMLElement>('#catalogue-comparison')!;
 const table=document.querySelector<HTMLTableElement>('#catalogue-comparison-table')!;
 const jump=document.querySelector<HTMLAnchorElement>('#catalogue-compare-jump')!;
 const error=document.querySelector<HTMLElement>('#catalogue-error')!;
 const root=host.dataset.root!,money=(n:number)=>new Intl.NumberFormat(en?'en-GB':'fr-FR',{style:'currency',currency:'EUR'}).format(n);
 const movement=(s:string)=>en?({Automatique:'Automatic',Quartz:'Quartz',Solaire:'Solar',Manuel:'Hand-wound'} as Record<string,string>)[s]||'Unspecified':s||'Non renseigné';
 let products:CatalogueProduct[],size:number;
 try{const response=await fetch('/catalogue.json');if(!response.ok)throw Error();const data=await response.json();products=data.products;size=data.pageSize;if(!Array.isArray(products)||!(size>0))throw Error();}
 catch{error.hidden=false;error.textContent=t('La recherche n’a pas pu charger ses données. Les pages du catalogue restent accessibles ci-dessous. Rechargez pour réessayer.','Search data could not be loaded. You can still browse the catalogue pages below. Reload to try again.');return;}
 const byId=new Map(products.map(p=>[p.id,p]));let selected:string[]=[],page=1;
 const field=(key:string)=>form.elements.namedItem(key) as HTMLInputElement|HTMLSelectElement;
 function restore(){const query=new URLSearchParams(location.search);for(const key of filterKeys)field(key).value=query.get(key)||'';
  const routePage=location.pathname.slice(root.length).split('/')[0];const n=Number(query.get('page')||routePage||1);page=Number.isSafeInteger(n)&&n>0?n:1;
  selected=[...new Set((query.get('compare')||'').split(','))].filter(id=>byId.has(id)).slice(0,3);
 }
 function queryFor(n:number){const q=new URLSearchParams();for(const key of filterKeys){const value=field(key).value.trim();if(value)q.set(key,value)}if(n>1)q.set('page',String(n));if(selected.length)q.set('compare',selected.join(','));return root+(q.size?'?'+q:'');}
 function el<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
 function link(text:string,url:string,cls?:string){const a=el('a',text,cls);a.href=url;return a;}
 function retailer(p:CatalogueProduct,cls?:string){const a=link(t('Voir chez Tempus ↗','View at Tempus ↗'),affiliateUrl(p.source),cls);a.rel='sponsored';return a;}
 function syncPicks(){cards.querySelectorAll<HTMLInputElement>('.catalogue-pick input').forEach(input=>{input.checked=selected.includes(input.value);input.disabled=selected.length>=3&&!input.checked;});}
 function drawComparison(){comparison.hidden=jump.hidden=!selected.length;table.replaceChildren();if(!selected.length)return;
  const watches=selected.map(id=>byId.get(id)!);const caption=el('caption',t('Comparaison des données Tempus','Comparison of Tempus data'));table.append(caption);
  const head=el('thead'),tr=el('tr'),first=el('th',t('Repère','Detail'));first.scope='col';tr.append(first);
  for(const p of watches){const th=el('th',p.title);th.scope='col';const remove=el('button',t('Retirer','Remove'));remove.type='button';remove.setAttribute('aria-label',t('Retirer ','Remove ')+p.reference);remove.addEventListener('click',()=>{selected=selected.filter(id=>id!==p.id);syncPicks();drawComparison();history.replaceState(null,'',queryFor(page));document.dispatchEvent(new Event('cadrin:urlchange'));const remaining=table.querySelector('button');if(remaining)remaining.focus();else count.focus();});th.append(remove);tr.append(th);}head.append(tr);table.append(head);
  const body=el('tbody');const rows:[string,(p:CatalogueProduct)=>string][]=[[t('Référence','Reference'),p=>p.reference],[t('Prix au relevé, hors livraison','Recorded price, excluding delivery'),p=>money(p.price)],[t('Mouvement indiqué','Listed movement'),p=>movement(p.movement)],[t('Commande au relevé','Ordering at the last check'),p=>orderLabel(p,en)]];
  for(const [label,read] of rows){const row=el('tr'),th=el('th',label);th.scope='row';row.append(th);for(const p of watches)row.append(el('td',read(p)));body.append(row);}const row=el('tr'),th=el('th',t('Lien affilié','Affiliate link'));th.scope='row';row.append(th);for(const p of watches){const td=el('td');td.append(retailer(p));row.append(td);}body.append(row);table.append(body);
 }
 function card(p:CatalogueProduct){const article=el('article',undefined,'catalogue-card');article.dataset.id=p.id;
  const imageLink=link('',affiliateUrl(p.source),'catalogue-image');imageLink.rel='sponsored';imageLink.setAttribute('aria-label',p.title+' — '+t('voir chez Tempus, lien affilié','view at Tempus, affiliate link'));
  const image=el('img');image.src=p.image;image.alt=p.title+' — '+t('visuel Tempus','Tempus listing image');image.width=p.width;image.height=p.height;image.loading='lazy';image.decoding='async';imageLink.append(image);article.append(imageLink);
  const copy=el('div',undefined,'catalogue-copy');copy.append(el('p',p.brand,'eyebrow'),el('h2',p.title),el('p',t('Réf. marchand : ','Retailer ref: ')+p.reference,'catalogue-reference'),el('p',movement(p.movement),'catalogue-spec'),el('p',money(p.price),'catalogue-price'),el('p',orderLabel(p,en),'catalogue-status'),retailer(p,'text-link catalogue-cta'),el('small',t('Lien affilié · photo Tempus','Affiliate link · photo: Tempus')));
  const label=el('label',undefined,'catalogue-pick'),input=el('input');input.type='checkbox';input.value=p.id;input.setAttribute('aria-label',t('Comparer ','Compare ')+p.reference);label.append(input,document.createTextNode(t('Comparer','Compare')));copy.append(label);article.append(copy);return article;
 }
 function render(update=false,focus=false){const filters=Object.fromEntries(filterKeys.map(k=>[k,field(k).value])) as CatalogueFilters;
  const matches=filterCatalogue(products,filters),pages=Math.max(1,Math.ceil(matches.length/size));page=Math.min(page,pages);
  cards.replaceChildren(...matches.slice((page-1)*size,page*size).map(card));document.querySelector<HTMLElement>('#catalogue-empty')!.hidden=matches.length!==0;
  count.textContent=`${matches.length.toLocaleString(en?'en-GB':'fr-FR')} ${t('fiches · page','listings · page')} ${page}/${pages}`;
  pager.replaceChildren();function pageLink(n:number,label:string){const a=link(label,queryFor(n));if(n===page)a.setAttribute('aria-current','page');a.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();page=n;render(true,true)});pager.append(a);}
  if(page>1)pageLink(page-1,t('← Précédente','← Previous'));for(let n=1;n<=pages;n++)if(n===1||n===pages||Math.abs(n-page)<=2)pageLink(n,String(n));if(page<pages)pageLink(page+1,t('Suivante →','Next →'));
  syncPicks();drawComparison();if(update){history.pushState(null,'',queryFor(page));document.dispatchEvent(new Event('cadrin:urlchange'));}if(focus){count.focus();count.scrollIntoView({block:'start',behavior:'instant'});}
 }
 cards.addEventListener('change',event=>{const input=event.target;if(!(input instanceof HTMLInputElement)||input.type!=='checkbox')return;if(input.checked&&selected.length<3)selected.push(input.value);else selected=selected.filter(id=>id!==input.value);syncPicks();drawComparison();history.replaceState(null,'',queryFor(page));document.dispatchEvent(new Event('cadrin:urlchange'));});
 let timer:ReturnType<typeof setTimeout>;
 form.addEventListener('input',event=>{if(!(event.target instanceof HTMLInputElement))return;clearTimeout(timer);timer=setTimeout(()=>{page=1;render(true)},220)});
 form.addEventListener('change',event=>{if(event.target instanceof HTMLSelectElement){clearTimeout(timer);page=1;render(true)}});
 form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);page=1;render(true,true)});
 form.addEventListener('reset',()=>{clearTimeout(timer);requestAnimationFrame(()=>{page=1;render(true)})});
 window.addEventListener('popstate',()=>{clearTimeout(timer);restore();render()});count.tabIndex=-1;restore();render();
 form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLButtonElement>('input,select,button').forEach(control=>control.disabled=false);
 form.removeAttribute('aria-disabled');
}
