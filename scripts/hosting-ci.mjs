import {startLocalWorker} from './local-worker.mjs';
const server=await startLocalWorker(process.env.SITE_STAGE==='production'?'dist-production':'dist');
try {
 process.env.QA_ORIGIN=String(await server.ready).replace(/\/$/,'');
 await import('./hosting-check.mjs');
} finally {await server.dispose();}
