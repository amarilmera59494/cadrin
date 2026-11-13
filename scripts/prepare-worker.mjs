import fs from 'node:fs/promises';
import path from 'node:path';
import {writeAssets,writeWorkerConfig,writeRootConfig,getWorkerBundleDir,getWorkerAssetsDir,cleanBuildOutputDir} from '@cloudflare/build-output-utils';
import {createHash} from 'node:crypto';
import config from '../cloudflare.config.ts';
const root=process.cwd(),production=process.env.SITE_STAGE==='production',directory=path.resolve(production?'dist-production':'dist');
const pages=[];async function walk(dir){for(const f of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,f.name);if(f.isDirectory())await walk(p);else if(f.name==='index.html')pages.push('/'+path.relative(directory,path.dirname(p)).replaceAll('\\','/')+(p===path.join(directory,'index.html')?'':'/'));}}await walk(directory);
const data=JSON.parse(await fs.readFile('src/data/tempus-catalogue.json','utf8'));const lists={pages,products:[...new Set(data.products.map(p=>new URL(p.source).pathname))]};
// writeAssets preserves existing destination files. Clear only this generated output,
// after resolving and checking its boundary, so preview files can never survive a production build.
const realRoot=await fs.realpath(root),output=path.join(realRoot,'.cloudflare','output');
let resolvedOutput;try{resolvedOutput=await fs.realpath(output);}catch(e){if(e.code!=='ENOENT')throw e;}
if(resolvedOutput&&resolvedOutput!==output)throw Error('Refusing to clean a redirected build output');
if(!output.startsWith(realRoot+path.sep)||path.relative(realRoot,output)!==path.join('.cloudflare','output'))throw Error('Unsafe build output boundary');
await cleanBuildOutputDir(root);
await writeAssets({root,sourceDirectory:directory});
const assets=getWorkerAssetsDir(root),hash=b=>createHash('sha256').update(b).digest('hex');
let verified=0;async function verify(dir){for(const f of await fs.readdir(dir,{withFileTypes:true})){const source=path.join(dir,f.name);if(f.isDirectory())await verify(source);else {const target=path.join(assets,path.relative(directory,source));if(hash(await fs.readFile(source))!==hash(await fs.readFile(target)))throw Error('Staged asset mismatch: '+source);verified++;}}}await verify(directory);
const bundle=getWorkerBundleDir(root);await fs.mkdir(bundle,{recursive:true});await fs.copyFile('worker/measure.mjs',path.join(bundle,'measure.mjs'));
await fs.writeFile(path.join(bundle,'index.mjs'),`import {createWorker} from './measure.mjs';\nexport default createWorker(${JSON.stringify(lists)},{enabled:${production}});\n`);
await writeWorkerConfig({root,config:config.worker,manifest:{type:'complete',mainModule:'index.mjs',modules:{'index.mjs':{type:'esm'},'measure.mjs':{type:'esm'}}}});
await writeRootConfig(root,undefined,{isPreview:!production,mode:production?'production':'preview'});
console.log(`Worker prepared: ${verified} assets verified byte for byte; ${pages.length} allowed pages; ${lists.products.length} product paths; collection ${production?'enabled after consent':'disabled in preview'}`);
