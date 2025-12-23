
import { load } from './state.js';
import { setupSidebarToggle } from './ui.js';
import './fundaciones.js';
import './conductores.js';
import './pedidos.js';
import './sync.js';

document.addEventListener('DOMContentLoaded', ()=>{
  load();
  setupSidebarToggle();
});
