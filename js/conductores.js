
import { state, save } from './state.js';

window.addDriver = function(d){
  state.drivers.push(d);
  save();
}

window.addPlate = function(p){
  state.plates.push(p);
  save();
}
