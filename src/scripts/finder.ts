const en=document.documentElement.lang==='en';
const form = document.querySelector<HTMLFormElement>('#criteria')!;
const models = [...document.querySelectorAll<HTMLElement>('#models .model')];
const inputs = [...form.querySelectorAll<HTMLInputElement|HTMLSelectElement>('[name]')];
const choices = [...document.querySelectorAll<HTMLInputElement>('.pick input')];
const selected = new Set<string>();
const comparison = document.querySelector<HTMLElement>('#comparaison')!;
const info = document.querySelector<HTMLElement>('#compare-info')!;
const jump = document.querySelector<HTMLAnchorElement>('#to-compare')!;
const empty = document.querySelector<HTMLElement>('#no-matches')!;
const known = new Set(models.map(model=>model.dataset.id));
const sortOrder=document.querySelector<HTMLSelectElement>('#sort-order')!;
const shareStatus=document.querySelector<HTMLElement>('#share-status')!;
const fallback=document.querySelector<HTMLElement>('#share-fallback')!;
document.querySelector<HTMLElement>('.finder-tools')!.hidden=false;
sortOrder.addEventListener('change',()=>render());
document.querySelector('#share-finder')!.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(location.href);shareStatus.textContent=en?'Link copied, including filters and comparison.':'Lien copié, avec les filtres et la comparaison.';fallback.hidden=true}
  catch{fallback.hidden=false;const input=fallback.querySelector('input')!;input.value=location.href;input.focus();input.select();shareStatus.textContent=en?'Copy the selected link.':'Copiez le lien sélectionné.'}
});
const normalize = (v: string) => v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');

const filterToggle=document.querySelector<HTMLButtonElement>('#filter-toggle')!;
const options=document.querySelector<HTMLElement>('#filter-options')!;
const mobile=matchMedia('(max-width:740px)');
function filterLayout(){
  filterToggle.hidden=!mobile.matches;
  options.hidden=mobile.matches && filterToggle.getAttribute('aria-expanded')!=='true';
}
filterToggle.addEventListener('click',()=>{
  filterToggle.setAttribute('aria-expanded', String(options.hidden));
  filterLayout();
});
mobile.addEventListener('change',filterLayout);
filterLayout();

function readLocation() {
  const params = new URLSearchParams(location.search);
  sortOrder.value=['prix','largeur'].includes(params.get('tri')||'')?params.get('tri')!:'';
  for (const input of inputs) {
    const value = params.get(input.name) || '';
    input.value = input instanceof HTMLSelectElement && !Array.from(input.options).some(o=>o.value===value) ? '' : value.slice(0,80);
  }
  selected.clear();
  for (const id of (params.get('comparer') || '').split(',')) {
    if (known.has(id) && selected.size < 3) selected.add(id);
  }
}

function render(writeUrl = true) {
  const url = new URL(location.href);
  if(sortOrder.value)url.searchParams.set('tri',sortOrder.value);else url.searchParams.delete('tri');
  shareStatus.textContent='';fallback.hidden=true;
  for (const input of inputs) {
    if (input.value) url.searchParams.set(input.name,input.value);
    else url.searchParams.delete(input.name);
  }
  if (selected.size) url.searchParams.set('comparer',[...selected].join(','));
  else url.searchParams.delete('comparer');
  if (writeUrl && url.href!==location.href) history.replaceState(null,'',url);
  const active=inputs.filter(input=>input.value).length;
  filterToggle.textContent=active ? (en?'Edit filters (':'Modifier les critères (')+active+')' : (en?'Filter watches':'Filtrer les montres');
  let matches=0;
  for (const model of models) {
    model.hidden = !inputs.every(({name,value})=>{
      if (!value) return true;
      if (name==='recherche') return normalize(model.dataset.search || '').includes(normalize(value));
      if (name==='budget' || name==='largeur') return !!model.dataset[name] && Number(model.dataset[name])<=Number(value);
      return model.dataset[name]===value;
    });
    if (!model.hidden) matches++;
  }
  document.querySelector('#matches')!.textContent = en ? matches+' watch'+(matches===1?'':'es') : matches+' référence'+(matches>1?'s':'');
  empty.hidden=matches!==0;
  const key=sortOrder.value==='prix'?'budget':sortOrder.value==='largeur'?'largeur':null;
  const ordered=[...models].sort((a,b)=>key?(Number(a.dataset[key]||Infinity)-Number(b.dataset[key]||Infinity))||models.indexOf(a)-models.indexOf(b):models.indexOf(a)-models.indexOf(b));
  ordered.forEach(model=>model.parentElement!.append(model));
  for (const choice of choices) {
    choice.checked=selected.has(choice.value);
    choice.disabled=!choice.checked && selected.size===3;
  }
  comparison.querySelectorAll<HTMLElement>('[data-col]').forEach(cell=>{cell.hidden=!selected.has(cell.dataset.col!)});
  comparison.querySelector<HTMLElement>('.table-scroll')!.hidden=selected.size===0;
  info.textContent = en ? (selected.size ? selected.size+' of 3 watches. '+(selected.size===3?'Remove one to add another.':'Select another watch to compare.') : 'Select Compare on the watches you want to see side by side.') : selected.size ? selected.size+' montre'+(selected.size>1?'s':'')+' sur 3. '+(selected.size===3?'Retirez un modèle pour en ajouter un autre.':'Cochez un autre modèle pour le rapprocher de votre choix.') : 'Cochez « Comparer » sur les modèles que vous souhaitez rapprocher.';
  jump.hidden=!selected.size;
  jump.textContent=(en?'View my comparison (':'Voir ma comparaison (')+selected.size+'/3) ↓';
}

form.hidden=false;
document.querySelectorAll<HTMLElement>('.pick,.remove').forEach(el=>el.hidden=false);
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',()=>render());
form.addEventListener('reset',()=>requestAnimationFrame(()=>render()));
empty.querySelector('button')!.addEventListener('click',()=>{form.reset();(options.hidden?filterToggle:inputs[0]).focus()});
choices.forEach(choice=>choice.addEventListener('change',()=>{
  if(choice.checked && selected.size<3) selected.add(choice.value);
  else selected.delete(choice.value);
  render();
}));
comparison.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(button=>button.addEventListener('click',()=>{
  selected.delete(button.dataset.remove!);render();
  (comparison.querySelector<HTMLButtonElement>('[data-col]:not([hidden]) .remove') || comparison).focus();
}));
window.addEventListener('pageshow',()=>{readLocation();render(false)});
window.addEventListener('popstate',()=>{readLocation();render(false)});
readLocation();render(false);
