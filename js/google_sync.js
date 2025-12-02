
// google_sync.js
// Basic push/pull integration with your Apps Script URL.
// Provided URL and ID are embedded here.
export const SYNC_URL = "https://script.google.com/macros/s/AKfycby-tt7UY_tChKNxfYY6OLTiDqOiDNnIr5wvnnkpksPzXUx970S_dL2QKELnSOCWi_i9/exec";
export const LIBRARY_ID = "1S-kuB0n5a3ra_jVxR1dHqok7ZgR3mCWtMUf4BiPWRFB6HYvtobhwblPl/1";

// push state to remote (POST)
export async function pushState(){ try{ const payload = { action:'push', id: LIBRARY_ID, data: localStorage.getItem('erp_state') }; const r = await fetch(SYNC_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); const j = await r.json(); return j; }catch(e){ console.warn('push failed',e); return null; } }

// pull state from remote (GET)
export async function pullState(){ try{ const r = await fetch(SYNC_URL + '?action=pull&id=' + encodeURIComponent(LIBRARY_ID)); const j = await r.json(); if(j && j.data){ try{ const remote = JSON.parse(j.data); return remote; }catch(e){return null;} } return null; }catch(e){ console.warn('pull failed',e); return null; } }

// merge remote into local (non destructive)
export function mergeRemote(remote){ if(!remote) return 0; let added = 0; // simple merging logic for arrays by unique key
  // foundations (by nit)
  remote.foundations = remote.foundations || [];
  remote.foundations.forEach(f=>{ if(!state.foundations.some(x=>x.nit===f.nit)){ state.foundations.push(f); added++; }});
  remote.items = remote.items || [];
  remote.items.forEach(it=>{ if(!state.items.some(x=>x.ref===it.ref)){ state.items.push(it); added++; }});
  remote.plates = remote.plates || [];
  remote.plates.forEach(p=>{ if(!state.plates.some(x=>x.plate===p.plate)){ state.plates.push(p); added++; }});
  remote.pedidos = remote.pedidos || [];
  remote.pedidos.forEach(pd=>{ if(!state.pedidos.some(x=>x.id===pd.id)){ state.pedidos.push(pd); added++; }});
  if(added>0) saveLocal();
  return added;
}

function saveLocal(){ localStorage.setItem('erp_state', JSON.stringify(state)); }
