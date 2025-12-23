
export function setupSidebarToggle(){
  const btn = document.getElementById('btnMenu');
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');
  if(!btn || !sidebar) return;
  btn.onclick = ()=>{
    sidebar.classList.toggle('hidden');
    if(main) main.classList.toggle('expanded');
  };
}
