
import { state, save } from './state.js';

window.addOrder = function(o){
  state.orders.push(o);
  save();
}
