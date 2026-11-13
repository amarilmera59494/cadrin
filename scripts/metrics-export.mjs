import fs from 'node:fs/promises';import path from 'node:path';import {spawnSync} from 'node:child_process';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),cf=path.join(path.dirname(require.resolve('cf/package.json')),'bin/cf');
const date=process.argv[2]||new Date(Date.now()-86400000).toISOString().slice(0,10);
if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Use YYYY-MM-DD (UTC).');
const from=Date.parse(date+'T00:00:00Z'),to=Math.min(from+86400000,Date.now());if(!Number.isFinite(from)||from>=to||from<Date.now()-3*86400000)throw Error('Choose a past UTC day within the last three days.');
await fs.mkdir('.tmp',{recursive:true});await fs.mkdir('evidence/metrics',{recursive:true});
const base=[{key:'kind',operation:'eq',type:'string',value:'cadrin_metric'},{key:'test',operation:'eq',type:'boolean',value:false}];
const results={dateUTC:date,from,to,partialDay:to<from+86400000,meaning:'Consented events, not unique people, orders or commissions.',reports:{}};
for(const [name,groups] of [['sources',['event','source','campaign']],['pages',['event','page']],['products',['product','placement']]]){
 const body={queryId:'cadrin-export-'+name,view:'calculations',limit:2000,timeframe:{from,to},parameters:{filters:[...base,...(name==='products'?[{key:'event',operation:'eq',type:'string',value:'affiliate_click'}]:[])],calculations:[{operator:'count',alias:'events'}],groupBys:groups.map(value=>({type:'string',value})),limit:2000}};
 const file=path.resolve('.tmp/metric-query-'+name+'.json');await fs.writeFile(file,JSON.stringify(body));
 const r=spawnSync(process.execPath,[cf,'o11y','telemetry','query','--body','@'+file,'-q'],{encoding:'utf8',maxBuffer:8*1024*1024});if(r.status!==0)throw Error(r.stderr||r.stdout);
 const text=r.stdout.replace(/\x1b\[[0-9;]*m/g,'');const parsed=JSON.parse(text.slice(text.indexOf('{')));const data=parsed.result||parsed;if(!data.calculations)throw Error('Unexpected response shape');
 results.reports[name]=data.calculations.flatMap(c=>(c.aggregates||[]).map(row=>({...Object.fromEntries((row.groups||[]).map(g=>[g.key,g.value])),events:row.value,sampleInterval:row.sampleInterval??null})));
 if(results.reports[name].length>=2000)throw Error('Export may be truncated: split the day before reporting.');
}
await fs.writeFile(`evidence/metrics/${date}.json`,JSON.stringify(results,null,2));
const cell=x=>'"'+String(x??'').replaceAll('"','""')+'"';for(const [name,rows] of Object.entries(results.reports)){const keys=[...new Set(rows.flatMap(Object.keys))];await fs.writeFile(`evidence/metrics/${date}-${name}.csv`,keys.length?[keys.map(cell).join(','),...rows.map(row=>keys.map(k=>cell(row[k])).join(','))].join('\n')+'\n':'events\n');}
console.log(JSON.stringify({dateUTC:date,partialDay:results.partialDay,rows:Object.fromEntries(Object.entries(results.reports).map(([k,v])=>[k,v.length])),path:`evidence/metrics/${date}.json`}));
