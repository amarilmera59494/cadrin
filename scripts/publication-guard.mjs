import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import path from 'node:path';
const require=createRequire(import.meta.url);
const stage=process.env.SITE_STAGE ?? 'preview';
if(!['preview','production'].includes(stage))throw new Error('SITE_STAGE invalide.');
function run(file,args=[]){
  const result=spawnSync(process.execPath,[file,...args],{stdio:'inherit',env:{...process.env,SITE_STAGE:stage}});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status ?? 1);
}
// Remote preview is authorized. Indexable publication still requires editorial/legal clearance.
run('scripts/cadrin-content-check.mjs',stage==='production'?['--strict']:[]);
run('scripts/check-build.mjs');
const cf=path.join(path.dirname(require.resolve('cf/package.json')),'bin/cf');
run('scripts/prepare-worker.mjs');
run(cf,['deploy','--prebuilt','--provision=false',...process.argv.slice(2)]);
