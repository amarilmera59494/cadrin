// Only aggregate-event fields are logged. Never log request objects, headers or raw payloads.
const events=new Set(['page_view','selector_complete','filter_change','compare','affiliate_click']);
const sources=new Set(['direct','tiktok','pinterest','facebook','instagram','google','bing','other']);
const placements=new Set(['page','deal','guided','catalogue','comparison','social','guide','product','recommendation','cheaper-alternative','other']);
const campaigns=new Set(['none','gshock-noire','tsuyosa-rose','casio-retro','tsuyosa-format','budget-50','budget-150','cadeau','solaire','gshock-guide','noel-lui','noel-elle','noel-budget','noel-luxe','noel-gshock','noel-auto','auto-trio','taille','mouvements','premiere-montre','ecodrive-tsuyosa','mako','page-bouton']);
export function validateMetric(value,{pages,products}){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.consent!==true||value.version!==1)return null;
 if(Object.keys(value).some(k=>!['consent','version','event','page','source','campaign','placement','product','count','test'].includes(k)))return null;
 if(!events.has(value.event)||!pages.has(value.page)||!sources.has(value.source)||!campaigns.has(value.campaign)||!placements.has(value.placement))return null;
 if(value.product!==undefined&&(!products.has(value.product)||value.event!=='affiliate_click'))return null;
 if(value.event==='affiliate_click'&&!value.product)return null;
 if(value.count!==undefined&&(!Number.isInteger(value.count)||value.count<0||value.count>3))return null;
 if(value.test!==undefined&&typeof value.test!=='boolean')return null;
 return {kind:'cadrin_metric',version:1,event:value.event,page:value.page,source:value.source,campaign:value.campaign,placement:value.placement,...(value.product?{product:value.product}:{}),...(value.count!==undefined?{count:value.count}:{}),test:value.test===true};
}
export function createWorker(lists,{enabled=true,log=console.log}={}){
 const allow={pages:new Set(lists.pages),products:new Set(lists.products)};
 return {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname!=='/api/measure')return env.ASSETS.fetch(request);
  const reply=(status)=>new Response(null,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex','Vary':'Origin'}});
  if(!enabled)return reply(404);
  if(request.method!=='POST')return reply(405);
  if(request.headers.get('Origin')!==url.origin||request.headers.get('Sec-Fetch-Site')!=='same-origin')return reply(403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply(415);
  if(Number(request.headers.get('Content-Length'))>1024)return reply(413);
  try{
   const reader=request.body?.getReader();if(!reader)return reply(400);
   let length=0;const chunks=[];while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>1024){await reader.cancel();return reply(413);}chunks.push(value);}
   const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
   const metric=validateMetric(JSON.parse(new TextDecoder().decode(bytes)),allow);if(!metric)return reply(400);
   log(metric);return reply(204);
  }catch{return reply(400);}
 }};
}
