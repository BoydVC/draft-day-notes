import { readFileSync } from "node:fs";
const core:any = await import(process.cwd()+"/src/core/index.ts");
const H:any = await import("/workspace/tokenmax/poteto-pipeline/fixtures/model/model-harness.mjs");
const rows = new Set(H.TRANSITION_ROWS.map((r:any)=>H.tripleKey(r)));
const GO = core.GO_TIMEOUT_MS;
function census(events:any[]){const out:string[]=[];let prev="intake";for(let i=1;i<=events.length;i++){const st=core.reduce(events.slice(0,i),Date.parse(events[i-1].ts))?.status;out.push(`${prev}>${events[i-1].type}>${st}`);prev=st;}const last=Date.parse(events.at(-1).ts);const a=core.reduce(events,last)?.status,b=core.reduce(events,last+GO)?.status;if(a!==b)out.push(`${a}>timeout>${b}`);return out;}
for (const f of process.argv.slice(2)) {
  const lines = readFileSync(f,"utf8").split("\n").filter(Boolean).map((l)=>{const o=JSON.parse(l);return o.event?{...o.event,pickId:o.pickId}:{...o,pickId:o.payload?.id??o.pickId??f};});
  const by = new Map<string,any[]>(); for (const e of lines) { const k=e.pickId; if(!by.has(k)) by.set(k,[]); by.get(k)!.push(e); }
  for (const [id, evs] of by) { evs.sort((a,b)=>a.seq-b.seq); const c = census(evs); const extra=c.filter((t)=>!rows.has(t)); console.log(f.split("/").slice(-2).join("/"), id, evs.length, core.reduce(evs, Date.parse(evs.at(-1).ts))?.status, "extra:", JSON.stringify([...new Set(extra)])); }
}
