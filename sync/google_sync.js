export async function pushState(){ try{ await fetch(location.origin + '/sync-push',{method:'POST',body:localStorage.getItem('erp_state')}); }catch(e){console.warn(e);} }
export async function pullState(){ try{ const res = await fetch(location.origin + '/sync-pull'); if(!res.ok) return; const remote = await res.json(); console.log('pulled', remote); }catch(e){console.warn(e);} }
