
export const state = {
  foundations: [],
  items: [],
  drivers: [],
  plates: [],
  orders: [],
  currentUser: { name:'admin' }
};

export function save(){
  localStorage.setItem('erp_state', JSON.stringify(state));
}

export function load(){
  const d = localStorage.getItem('erp_state');
  if(d) Object.assign(state, JSON.parse(d));
}
