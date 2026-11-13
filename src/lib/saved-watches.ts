export const savedKey='cadrin-saved-watches-v1';
export const savedLimit=12;
export function cleanIds(value:unknown):string[]{
 if(!Array.isArray(value))return [];
 return [...new Set(value.filter((id):id is string=>typeof id==='string'&&/^\d{1,20}$/.test(id)))].slice(0,savedLimit);
}
export function readSaved(raw:string|null):string[]{try{const data=JSON.parse(raw||'null');return data?.version===1?cleanIds(data.ids):[];}catch{return [];}}
export function sharedIds(hash:string):{shared:boolean;ids:string[];invalid:boolean}{
 const q=new URLSearchParams(hash.replace(/^#/,''));if(!q.has('liste'))return {shared:false,ids:[],invalid:false};
 const raw=(q.get('liste')||'').split(',');const ids=cleanIds(raw);
 return {shared:true,ids,invalid:raw.length>savedLimit||raw.some(id=>!/^\d{1,20}$/.test(id))||!ids.length};
}
export function sharePath(ids:string[],en=false){return (en?'/en/saved-watches/':'/mes-favoris/')+'#liste='+cleanIds(ids).join(',');}
