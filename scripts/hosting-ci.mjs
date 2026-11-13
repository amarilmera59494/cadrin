import {Miniflare} from 'miniflare';
import path from 'node:path';
import cloudflare from '../cloudflare.config.ts';
const {name,compatibilityDate,assets}=cloudflare.worker;
// Exercise the exact static asset configuration before uploading it.
const manifest={mainModule:'empty.mjs',modules:{'empty.mjs':{type:'esm',contents:'export default {fetch(){return new Response(null,{status:404})}}'}}};
const server=new Miniflare({host:'127.0.0.1',port:0,telemetry:{enabled:false},workers:[{config:{name,compatibilityDate,manifest,assets:{...assets,directory:path.resolve('dist'),hasUserWorker:false}}}]});
try {
 process.env.QA_ORIGIN=String(await server.ready).replace(/\/$/,'');
 await import('./hosting-check.mjs');
} finally {await server.dispose();}
