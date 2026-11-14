import {filterCatalogue,filterKeys,filterRecovery,purchaseLabel,orderLabel,detailRows,normalise,type CatalogueFilters,type CatalogueProduct} from '../lib/tempus-catalogue';
import {merchantLinkAvailable} from '../lib/tempus-catalogue';
import {term} from '../lib/i18n';
import {affiliateUrl} from '../data/affiliation';
import {editorialLinks} from '../data/editorial-links';
const host=document.querySelector<HTMLElement>('[data-catalogue]');
if(host) initialise(host);
async function initialise(host:HTMLElement){
 const en=document.documentElement.lang==='en',t=(fr:string,english:string)=>en?english:fr;
 const form=document.querySelector<HTMLFormElement>('#catalogue-filters')!;
 const cards=document.querySelector<HTMLElement>('#catalogue-cards')!;
 const pager=document.querySelector<HTMLElement>('#catalogue-pagination')!;
 const topPager=document.querySelector<HTMLElement>('#catalogue-pagination-top')!;
 const count=document.querySelector<HTMLElement>('#catalogue-count')!;
 const comparison=document.querySelector<HTMLElement>('#catalogue-comparison')!;
 const table=document.querySelector<HTMLTableElement>('#catalogue-comparison-table')!;
 const jump=document.querySelector<HTMLAnchorElement>('#catalogue-compare-jump')!;
 const error=document.querySelector<HTMLElement>('#catalogue-error')!;
 const root=host.dataset.root!,money=(n:number)=>new Intl.NumberFormat(en?'en-GB':'fr-FR',{style:'currency',currency:'EUR'}).format(n);
 const movement=(s:string)=>en?({Automatique:'Automatic',Quartz:'Quartz',Solaire:'Solar',Manuel:'Hand-wound',Connectée:'Connected'} as Record<string,string>)[s]||'Unspecified':s||'Non renseigné';
 let products:CatalogueProduct[],size:number,checkedAt:string;
 try{const response=await fetch('/catalogue.json');if(!response.ok)throw Error();const data=await response.json();products=data.products;size=data.pageSize;checkedAt=data.offersCheckedAt||data.checkedAt;if(!Array.isArray(products)||!(size>0))throw Error();}
 catch{error.hidden=false;error.textContent=t('La recherche n’a pas pu charger ses données. Les pages du catalogue restent accessibles ci-dessous. Rechargez pour réessayer.','Search data could not be loaded. You can still browse the catalogue pages below. Reload to try again.');return;}
 const share=document.querySelector<HTMLButtonElement>('#catalogue-share')!;share.hidden=false;share.addEventListener('click',async()=>{const status=document.querySelector('#catalogue-share-status')!;try{await navigator.clipboard.writeText(location.href);status.textContent=t('Lien copié, avec vos critères et votre comparaison.','Link copied, including your filters and comparison.');}catch{status.textContent=t('Copiez l’adresse de cette page pour partager votre recherche.','Copy this page’s address to share your search.');}});
 const legacyCompare:Record<string,string>=JSON.parse(host.dataset.legacy||'{}');const byId=new Map(products.map(p=>[p.id,p]));let selected:string[]=[],page=1;
 const field=(key:string)=>form.elements.namedItem(key) as HTMLInputElement|HTMLSelectElement;
 function restore(){const query=new URLSearchParams(location.search);const legacy:Record<string,string>={couleur:'dial',mouvement:'movement',bracelet:'strap',categorie:'category',largeur:'size',tri:'sort'};for(const [old,key] of Object.entries(legacy)){if(query.has(old)&&!query.has(key)){let value=query.get(old)!;if(value==='Résine')value='Résine / caoutchouc';if(value==='prix')value='price';if(value==='largeur')value='size';query.set(key,value);}}for(const key of filterKeys){const v=query.get(key);const f=field(key);if(v&&f instanceof HTMLSelectElement&&!Array.from(f.options).some(o=>o.value===v)&&['budget','size'].includes(key)&&/^\d{1,5}$/.test(v)){f.add(new Option(v+(key==='size'?' mm':' €'),v));}}for(const key of filterKeys)field(key).value=query.get(key)||'';
  const advanced=form.querySelector<HTMLDetailsElement>('.catalogue-advanced');if(advanced&&Array.from(advanced.querySelectorAll('select')).some(select=>!!select.value))advanced.open=true;
  const routePage=location.pathname.slice(root.length).split('/')[0];const n=Number(query.get('page')||routePage||1);page=Number.isSafeInteger(n)&&n>0?n:1;
  selected=[...new Set((query.get('compare')||query.get('comparer')?.split(',').map(id=>legacyCompare[id]).filter(Boolean).join(',')||'').split(','))].filter(id=>byId.has(id)).slice(0,3);
 }
 function queryFor(n:number){const q=new URLSearchParams(location.search);for(const key of [...filterKeys,"page","compare","comparer","couleur","mouvement","bracelet","categorie","largeur","tri"])q.delete(key);for(const key of filterKeys){const value=field(key).value.trim();if(value)q.set(key,value)}if(n>1)q.set('page',String(n));if(selected.length)q.set('compare',selected.join(','));return root+(q.size?'?'+q:'');}
 function el<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
 function link(text:string,url:string,cls?:string){const a=el('a',text,cls);a.href=url;return a;}
 function retailer(p:CatalogueProduct,cls='button merchant-button'){if(!merchantLinkAvailable(p))return link(t('Comprendre Longines →','Read about Longines →'),en?'/en/brands/longines/':'/marques/longines/','text-link');const a=link('',affiliateUrl(p.source),cls);a.rel='sponsored';a.dataset.reference=p.reference;a.dataset.placement=cls.includes('catalogue-cta')?'catalogue':'comparison';const arrow=el('span','↗');arrow.setAttribute('aria-hidden','true');a.append(el('span',purchaseLabel(p,en)),arrow);return a;}
 function syncPicks(){cards.querySelectorAll<HTMLInputElement>('.catalogue-pick input').forEach(input=>{input.checked=selected.includes(input.value);input.disabled=selected.length>=3&&!input.checked;});}

 const differences=document.querySelector<HTMLInputElement>('#comparison-differences')!;
 const differenceControl=document.querySelector<HTMLElement>('#comparison-differences-control')!;
 const comparisonSummary=document.querySelector<HTMLElement>('#comparison-summary')!;
 let comparisonInView=false;
 new IntersectionObserver(([entry])=>{comparisonInView=entry.isIntersecting;jump.hidden=!selected.length||comparisonInView;},{rootMargin:'0px 0px -80px 0px'}).observe(comparison);
 function focusResults(){count.focus();count.scrollIntoView({block:'start',behavior:'instant'});}
 function removePick(id:string){
  selected=selected.filter(value=>value!==id);syncPicks();drawComparison();history.replaceState(null,'',queryFor(page));
  document.dispatchEvent(new Event('cadrin:urlchange'));
  const remaining=table.querySelector<HTMLButtonElement>('button[data-remove]');
  if(remaining)remaining.focus();else focusResults();
 }
 function drawComparison(){
  for(const nav of [pager,topPager])for(const a of nav.querySelectorAll<HTMLAnchorElement>('a[data-page]'))a.href=queryFor(Number(a.dataset.page));
  comparison.hidden=!selected.length;jump.hidden=!selected.length||comparisonInView;
  jump.textContent=t('Comparer mes montres','Compare my watches')+' ('+selected.length+'/3)';
  table.replaceChildren();differenceControl.hidden=selected.length<2;
  if(!selected.length)return;
  const watches=selected.map(id=>byId.get(id)!);
  table.style.setProperty('--comparison-count',String(watches.length));
  const priceGap=Math.max(...watches.map(p=>p.price))-Math.min(...watches.map(p=>p.price));
  comparisonSummary.textContent=(selected.length<2?t('Ajoutez une deuxième montre pour voir les différences.','Add a second watch to see the differences.'):priceGap===0?t('Même prix au relevé. Regardez surtout le format, le mouvement et les matières.','Same recorded price. Focus on size, movement and materials.'):t('Écart entre les prix extrêmes : ','Difference between lowest and highest price: ')+money(priceGap)+'.')+' '+t('Prix France hors livraison, relevés le ','France prices exclude delivery, checked on ')+checkedAt.split('-').reverse().join('/')+'.';
  table.append(el('caption',t('Comparaison des données Tempus','Comparison of Tempus data')));
  const head=el('thead'),tr=el('tr'),first=el('th',t('Repère','Detail'));first.scope='col';tr.append(first);
  for(const p of watches){
   const th=el('th');th.scope='col';
   const photo=el('img');Object.assign(photo,{src:p.image,alt:p.title,width:p.width,height:p.height,loading:'lazy'});photo.className='comparison-photo';
   const remove=el('button',t('Retirer','Remove'));remove.type='button';remove.dataset.remove=p.id;remove.setAttribute('aria-label',t('Retirer ','Remove ')+p.reference);remove.addEventListener('click',()=>removePick(p.id));
   const save=el('button',t('Garder en favoris','Save watch'),'save-watch');save.type='button';save.dataset.saveId=p.id;save.dataset.saveLabel=p.reference;
   th.append(photo,el('span',p.title,'comparison-title'),el('small',p.reference,'comparison-reference'),save,remove);tr.append(th);
  }
  head.append(tr);table.append(head);
  const body=el('tbody');
  const value=(raw?:string)=>raw?term(raw,en?'en':'fr'):t('Non renseigné','Not specified');
  const rows:[string,(p:CatalogueProduct)=>string][]=[
   [t('Prix au relevé, hors livraison','Recorded price, excluding delivery'),p=>money(p.price)],
   [t('Mouvement indiqué','Listed movement'),p=>movement(p.movement)],
   [t('Cadran','Dial'),p=>value(p.dial)],
   [t('Dimension','Case size'),p=>value(p.caseSize)],
   [t('Épaisseur','Thickness'),p=>value(p.thickness)],
   [t('Bracelet','Strap / bracelet'),p=>value(p.strap)],
   [t('Boîtier','Case material'),p=>value(p.caseMaterial)],
   [t('Verre','Crystal'),p=>value(p.glass)],
   [t('Calibre','Calibre'),p=>value(p.calibre)],
   [t('Fonctions','Functions'),p=>value(p.functions)],
   [t('Étanchéité annoncée','Listed water resistance'),p=>value(p.water)],
   [t('Commande au relevé','Ordering at the last check'),p=>orderLabel(p,en)]
  ];
  let visible=0;
  for(const [label,read] of rows){
   const values=watches.map(read);
   // Formatting-only differences such as 40 mm / 40mm are not differences in specification.
   const differs=new Set(values.map(v=>normalise(v).replace(/(\d),(\d)/g,'$1.$2').replace(/\s+/g,''))).size>1;
   const row=el('tr');row.dataset.different=String(differs);row.hidden=selected.length>1&&differences.checked&&!differs;
   if(!row.hidden)visible++;
   const th=el('th',label);th.scope='row';row.append(th);
   for(const text of values)row.append(el('td',text));body.append(row);
  }
  if(!visible){const row=el('tr'),cell=el('td',t('Aucune différence dans les caractéristiques renseignées. Les photos et références restent distinctes ; les données absentes ne prouvent pas une équivalence.','No difference in the recorded specifications. Photos and references remain distinct; missing data does not establish equivalence.'));cell.colSpan=watches.length+1;row.append(cell);body.append(row);}
  const buyRow=el('tr'),th=el('th',t('Lien affilié','Affiliate link'));th.scope='row';buyRow.append(th);
  for(const p of watches){const td=el('td');td.append(retailer(p));buyRow.append(td);}
  body.append(buyRow);table.append(body);
 }
 differences.addEventListener('change',drawComparison);
 document.querySelector('#comparison-clear')!.addEventListener('click',()=>{selected=[];differences.checked=false;syncPicks();drawComparison();history.replaceState(null,'',queryFor(page));document.dispatchEvent(new Event('cadrin:urlchange'));focusResults();});
 jump.addEventListener('click',()=>{comparison.focus();});
 function card(p:CatalogueProduct){const article=el('article',undefined,'catalogue-card');article.dataset.id=p.id;article.dataset.reference=p.reference;
  const imageLink=link('',merchantLinkAvailable(p)?affiliateUrl(p.source):(en?'/en/brands/longines/':'/marques/longines/'),'catalogue-image');if(merchantLinkAvailable(p))imageLink.rel='sponsored';imageLink.setAttribute('aria-label',p.title+' — '+(merchantLinkAvailable(p)?t('voir chez Tempus, lien affilié','view at Tempus, affiliate link'):t('lire le dossier Longines','read the Longines guide')));
  const image=el('img');image.src=p.image;image.alt=p.title+' — '+t('visuel Tempus','Tempus listing image');image.width=p.width;image.height=p.height;image.loading='lazy';image.decoding='async';imageLink.append(image);article.append(imageLink);
  const copy=el('div',undefined,'catalogue-copy');if(p.bestseller)copy.append(el('span',t('Best-seller Tempus','Tempus bestseller'),'catalogue-badge'));copy.append(el('p',p.brand,'eyebrow'),el('h2',p.title),el('p',t('Réf. marchand : ','Retailer ref: ')+p.reference,'catalogue-reference'),el('p',movement(p.movement),'catalogue-spec'),el('p',money(p.price),'catalogue-price'),el('p',orderLabel(p,en),'catalogue-status'),retailer(p,'button merchant-button catalogue-cta'),el('small',t('Lien affilié · photo Tempus','Affiliate link · photo: Tempus')));
  const analysis=editorialLinks[p.reference];if(analysis)copy.append(link(t('Lire notre analyse documentaire','Read our documentary analysis')+' →',(en?'/en/watches/':'/montres/')+analysis+'/','catalogue-analysis'));const rows=detailRows(p,en);if(rows.length){const details=el('details',undefined,'catalogue-details');details.append(el('summary',t('Dimensions et détails','Size and details')));const dl=el('dl');for(const [label,value]of rows){const row=el('div');row.append(el('dt',label),el('dd',term(value,en?'en':'fr')));dl.append(row);}details.append(dl,el('small',t('Source : fiche Tempus','Source: Tempus listing')));copy.insertBefore(details,copy.querySelector('.catalogue-price'));}
  const save=el('button',t('Garder en favoris','Save watch'),'save-watch');save.type='button';save.dataset.saveId=p.id;save.dataset.saveLabel=p.reference;copy.append(save);const label=el('label',undefined,'catalogue-pick'),input=el('input');input.type='checkbox';input.value=p.id;input.setAttribute('aria-label',t('Comparer ','Compare ')+p.reference);label.append(input,document.createTextNode(t('Comparer','Compare')));copy.append(label);article.append(copy);return article;
 }

 function drawRecovery(filters:CatalogueFilters){
  const recovery=document.querySelector<HTMLElement>('#catalogue-recovery')!;recovery.replaceChildren();
  for(const option of filterRecovery(products,filters)){
   const control=field(option.key),name=control.labels?.[0]?.childNodes[0]?.textContent?.trim()||option.key;
   const selectedValue=control instanceof HTMLSelectElement?control.selectedOptions[0]?.textContent:control.value;
   const button=el('button',t('Sans le critère « ','Without “')+name+' : '+selectedValue+t(' » — ','” — ')+option.count.toLocaleString(en?'en-GB':'fr-FR')+t(' modèles',' watches'));
   button.type='button';button.dataset.recoveryKey=option.key;
   button.addEventListener('click',()=>{field(option.key).value='';page=1;render(true,true)});recovery.append(button);
  }
  const clear=el('button',t('Repartir de tout le catalogue','Start again with the full catalogue'),'recovery-reset');clear.type='button';
  clear.addEventListener('click',()=>{for(const key of filterKeys)field(key).value='';page=1;render(true,true)});recovery.append(clear);
 }
 function render(update=false,focus=false){const filters=Object.fromEntries(filterKeys.map(k=>[k,field(k).value])) as CatalogueFilters;
  const matches=filterCatalogue(products,filters);if(!matches.length)drawRecovery(filters);const pages=Math.max(1,Math.ceil(matches.length/size));page=Math.min(page,pages);
  cards.replaceChildren(...matches.slice((page-1)*size,page*size).map(card));document.querySelector<HTMLElement>('#catalogue-empty')!.hidden=matches.length!==0;
  count.textContent=`${matches.length.toLocaleString(en?'en-GB':'fr-FR')} ${t('fiches · page','listings · page')} ${page}/${pages}`;
  pager.hidden=matches.length===0;pager.replaceChildren();topPager.hidden=pages<=1;topPager.replaceChildren();function pageLink(n:number,label:string,target=pager){const a=link(label,queryFor(n));a.dataset.page=String(n);if(n===page)a.setAttribute('aria-current','page');a.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();page=n;render(true,true)});target.append(a);}
  if(page>1)pageLink(page-1,t('← Précédente','← Previous'));for(let n=1;n<=pages;n++)if(n===1||n===pages||Math.abs(n-page)<=2)pageLink(n,String(n));if(page<pages)pageLink(page+1,t('Suivante →','Next →'));
  if(page>1)pageLink(page-1,t('← Précédente','← Previous'),topPager);topPager.append(el('span',t('Page ','Page ')+page+' / '+pages));if(page<pages)pageLink(page+1,t('Suivante →','Next →'),topPager);
  const active=document.querySelector('#catalogue-active')!;active.replaceChildren();for(const key of filterKeys.filter(k=>k!=='sort')){const f=field(key);if(!f.value)continue;const text=f instanceof HTMLSelectElement?f.selectedOptions[0].textContent:f.value;const chip=el('button',text+' ×');chip.type='button';chip.setAttribute('aria-label',t('Retirer le critère : ','Remove filter: ')+text);chip.addEventListener('click',()=>{field(key).value='';page=1;render(true);field(key).focus();});active.append(chip);}
  syncPicks();drawComparison();jump.textContent=t('Comparer mes montres','Compare my watches')+' ('+selected.length+'/3)';if(update){document.dispatchEvent(new CustomEvent('cadrin:measure',{detail:{event:'filter_change',placement:'catalogue'}}));history.pushState(null,'',queryFor(page));document.dispatchEvent(new Event('cadrin:urlchange'));}if(focus){count.focus();count.scrollIntoView({block:'start',behavior:'instant'});}
 }
 cards.addEventListener('change',event=>{const input=event.target;if(!(input instanceof HTMLInputElement)||input.type!=='checkbox')return;if(input.checked&&selected.length<3)selected.push(input.value);else selected=selected.filter(id=>id!==input.value);syncPicks();drawComparison();history.replaceState(null,'',queryFor(page));document.dispatchEvent(new Event('cadrin:urlchange'));document.dispatchEvent(new CustomEvent('cadrin:measure',{detail:{event:'compare',placement:'comparison',count:selected.length}}));});
 let timer:ReturnType<typeof setTimeout>;
 field('sort').addEventListener('change',()=>{clearTimeout(timer);page=1;render(true)});
 document.querySelector('.catalogue-edit-filters')?.addEventListener('click',event=>{event.preventDefault();field('q').focus();form.scrollIntoView({block:'start',behavior:'instant'});});
 form.addEventListener('input',event=>{if(!(event.target instanceof HTMLInputElement))return;clearTimeout(timer);timer=setTimeout(()=>{page=1;render(true)},220)});
 form.addEventListener('change',event=>{if(event.target instanceof HTMLSelectElement){clearTimeout(timer);page=1;render(true)}});
 form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);page=1;render(true,true)});
 form.addEventListener('reset',()=>{clearTimeout(timer);requestAnimationFrame(()=>{page=1;render(true)})});
 window.addEventListener('popstate',()=>{clearTimeout(timer);restore();render()});count.tabIndex=-1;restore();render();
 form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLButtonElement>('input,select,button').forEach(control=>control.disabled=false);
 field('sort').disabled=false;document.querySelector<HTMLElement>('[data-catalogue-tools]')!.hidden=false;
 form.removeAttribute('aria-disabled');
 if(['#catalogue-comparison','#comparaison'].includes(location.hash)&&selected.length){comparison.focus();comparison.scrollIntoView({block:'start',behavior:'instant'});}
}
