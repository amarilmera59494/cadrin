import {startLocalWorker} from './local-worker.mjs';
import path from 'node:path';
const directory=path.resolve(process.argv[2]||'dist');const port=Number(process.env.PORT||4323);
const server=await startLocalWorker(directory,port);
console.log(`Cloudflare Static Assets local : ${await server.ready} (${directory})`);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await server.dispose();process.exit(0)});
