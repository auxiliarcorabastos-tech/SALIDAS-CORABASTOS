
import { state, saveState, registerAction } from './state.js';
// small UI helper
export function setupSidebarToggle(){
  const btn = document.getElementById('btnMenu');
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');
  if(!btn || !sidebar) return;
  btn.addEventListener('click', ()=>{
    if(window.innerWidth <= 900){
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('sidebar-hidden');
      main.classList.toggle('expanded');
      localStorage.setItem('erp_sidebar_hidden', sidebar.classList.contains('sidebar-hidden')? '1':'0');
    }
  });
  const saved = localStorage.getItem('erp_sidebar_hidden') === '1';
  if(window.innerWidth>900 && saved){
    sidebar.classList.add('sidebar-hidden');
    main.classList.add('expanded');
  }
}
