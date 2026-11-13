import fs from 'node:fs/promises';
import path from 'node:path';
import {Miniflare} from 'miniflare';
import cloudflare from '../cloudflare.config.ts';
export async function startLocalWorker(directory,port=0){
 const production=directory.endsWith('dist-production');
 const files=await fs.readdir(directory,{recursive:true});
 const pages=files.filter(p=>p.replaceAll('\\','/').endsWith('index.html')).map(p=>'/'+p.replaceAll('\\','/').replace(/index.html$/,''));
 const data=JSON.parse(await fs.readFile('src/data/tempus-catalogue.json','utf8'));
 const lists={pages,products:[...new Set(data.products.map(p=>new URL(p.source).pathname))]};
 const manifest={mainModule:'index.mjs',modules:{'index.mjs':{type:'esm',contents:`import {createWorker} from './measure.mjs';export default createWorker(${JSON.stringify(lists)},{enabled:${production}});`},'measure.mjs':{type:'esm',contents:await fs.readFile('worker/measure.mjs','utf8')}}};
 const {name,compatibilityDate,assets,env}=cloudflare.worker;
 return new Miniflare({host:'127.0.0.1',port,telemetry:{enabled:false},workers:[{config:{name,compatibilityDate,env,manifest,assets:{...assets,directory:path.resolve(directory),hasUserWorker:true}}}]});
}
