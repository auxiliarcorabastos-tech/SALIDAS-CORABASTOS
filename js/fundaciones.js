
import { state, save } from './state.js';

window.createFoundation = function(nit,name){
  if(!nit||!name) return alert('Datos requeridos');
  if(state.foundations.some(f=>f.nit===nit)) return;
  state.foundations.push({nit,name,points:[]});
  save();
}
