import { state, saveState } from './state.js';
const SYNC_URL = "https://script.google.com/macros/s/AKfycby-tt7UY_tChKNxfYY6OLTiDqOiDNnIr5wvnnkpksPzXUx970S_dL2QKELnSOCWi_i9/exec";
export async function pushSync(){ try{ await fetch(SYNC_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'push',data:state}),mode:'cors'}); console.log('pushSync ok'); }catch(e){console.warn('pushSync err',e);} }
export async function pullSync(){ try{ const res = await fetch(SYNC_URL + '?action=pull',{method:'GET',mode:'cors'}); if(!res.ok) return; const obj = await res.json(); if(obj){ /* merge logic should be handled by caller */ } console.log('pullSync ok'); }catch(e){console.warn('pullSync err',e);} }
