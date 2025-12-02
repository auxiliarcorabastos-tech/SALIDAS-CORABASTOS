export const SYNC_URL = "https://script.google.com/macros/s/AKfycby-tt7UY_tChKNxfYY6OLTiDqOiDNnIr5wvnnkpksPzXUx970S_dL2QKELnSOCWi_i9/exec";

export let state = JSON.parse(localStorage.getItem('erp_state')||'null') || {
  users: [{username:'admin',pass:'3134630773',role:'admin'}],
  currentUser: null,
  foundations: [],
  items: [],
  packs: ['Atado','Bulto','Caja','Unidad'],
  drivers: [],
  plates: [],
  pedidos: [],
  audit: []
};

export function saveState(){ localStorage.setItem('erp_state', JSON.stringify(state)); }
