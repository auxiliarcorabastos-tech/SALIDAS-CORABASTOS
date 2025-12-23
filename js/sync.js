
const SYNC_URL = 'https://script.google.com/macros/s/AKfycby-tt7UY_tChKNxfYY6OLTiDqOiDNnIr5wvnnkpksPzXUx970S_dL2QKELnSOCWi_i9/exec';

export async function syncPush(data){
  await fetch(SYNC_URL,{method:'POST',body:JSON.stringify(data)});
}
