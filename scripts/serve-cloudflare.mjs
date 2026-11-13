import {Miniflare} from 'miniflare';
import path from 'node:path';
import cloudflare from '../cloudflare.config.ts';
const directory=path.resolve(process.argv[2]||'dist');const port=Number(process.env.PORT||4323);
const {name,compatibilityDate,assets}=cloudflare.worker;
// This installed Miniflare requires an inert module even for assets-only emulation.
// It exists only in this local harness and is never part of the Astro/Cloudflare build.
const manifest={mainModule:'empty.mjs',modules:{'empty.mjs':{type:'esm',contents:'export default {fetch(){return new Response(null,{status:404})}}'}}};
const server=new Miniflare({host:'127.0.0.1',port,telemetry:{enabled:false},workers:[{config:{name,compatibilityDate,manifest,assets:{...assets,directory,hasUserWorker:false}}}]});
console.log(`Cloudflare Static Assets local : ${await server.ready} (${directory})`);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await server.dispose();process.exit(0)});
