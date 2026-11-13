import {mkdir,writeFile} from 'node:fs/promises';
import {destinations,validDestination} from '../src/data/destinations.ts';
const results=[];
for(const [id,d] of Object.entries(destinations))for(const [locale,url] of [['fr',d.url],['en',d.englishUrl]]){
 if(!url)continue;
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(25000)});
  const html=await response.text();
  const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()||'';
  const normalize=value=>value.toUpperCase().replace(/[^A-Z0-9]/g,'');
  const final=new URL(response.url);
  const exactTitle=normalize(title).includes(normalize(d.reference));
  const pass=validDestination(d)&&response.ok&&final.hostname===d.host&&/^\/(?:en\/)?products\/[^/]+\/?$/.test(final.pathname)&&exactTitle;
  results.push({id,reference:d.reference,locale,url,finalUrl:response.url,status:response.status,title,exactTitle,affiliate:d.affiliate,pass});
 }catch(error){results.push({id,locale,url,pass:false,error:String(error)});}
}
await mkdir('evidence/launch-final',{recursive:true});
await writeFile('evidence/launch-final/merchant-links.json',JSON.stringify({checkedAt:new Date().toISOString(),note:'Page identity only; does not verify stock, image rights or affiliate tracking.',results},null,2));
console.log(JSON.stringify({checked:results.length,passed:results.filter(r=>r.pass).length,failures:results.filter(r=>!r.pass)},null,2));
if(results.some(r=>!r.pass))process.exitCode=1;
