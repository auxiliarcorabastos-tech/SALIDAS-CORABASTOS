
export let state = JSON.parse(localStorage.getItem('erp_state')||'null') || {};
if(!state.users) state.users = [{username:'admin',pass:'admin',role:'admin'}];
if(!state.foundations) state.foundations = [];
if(!state.items) state.items = [];
if(!state.packs) state.packs = ['Atado','Bulto','Canastilla','Caja','Unidad'];
if(!state.drivers) state.drivers = [];
if(!state.plates) state.plates = [];
if(!state.pedidos) state.pedidos = [];
if(!state.audit) state.audit = [];

export function saveState(){ localStorage.setItem('erp_state', JSON.stringify(state)); }
export function registerAction(action, detail){ state.audit.unshift({fecha:new Date().toISOString(),action,detail}); saveState(); }
