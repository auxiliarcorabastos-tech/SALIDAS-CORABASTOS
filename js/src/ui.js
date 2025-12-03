
import { state, saveState, loadStateFromStorage } from './state.js';

export function setupSidebarToggle(){
  const btn = document.getElementById('btnMenu');
  const sidebar = document.getElementById('sidebar');
  if(!btn || !sidebar) return;
  btn.addEventListener('click', ()=>{ const isMobile = window.innerWidth <= 900; if(isMobile) sidebar.classList.toggle('open'); else sidebar.classList.toggle('sidebar-hidden'); });
  if(localStorage.getItem('erp_sidebar_hidden')==='1') sidebar.classList.add('sidebar-hidden');
}

export function renderFundList(){ const box=document.getElementById('fundList'); if(!box) return; box.innerHTML=''; state.foundations.forEach(f=>{ const d=document.createElement('div'); d.className='card'; d.innerHTML = '<strong>' + (f.name||f.nombre||'') + '</strong><div class="small">NIT: ' + f.nit + '</div>'; box.appendChild(d); }); }

export function renderItemsTable(){ const tbody=document.querySelector('#itemsTable tbody'); if(!tbody) return; tbody.innerHTML=''; state.items.forEach((it,i)=>{ const tr=document.createElement('tr'); tr.innerHTML = '<td>' + (it.ref||it.referencia||'') + '</td><td>' + (it.name||it.nombre||'') + '</td><td>$' + (it.price||it.precio||0) + '</td><td><button data-i="' + i + '" class="delItem">Eliminar</button></td>'; tbody.appendChild(tr); }); document.querySelectorAll('.delItem').forEach(btn=>btn.addEventListener('click',function(){ const i=Number(this.dataset.i); state.items.splice(i,1); saveState(); renderItemsTable(); })); }

export function renderDrivers(){ const ul=document.getElementById('driversList'); if(!ul) return; ul.innerHTML=''; state.drivers.forEach(d=>{ const li=document.createElement('li'); li.textContent = d.name + ' — ' + (d.document||''); ul.appendChild(li); }); }

export function renderPlates(){ const ul=document.getElementById('platesList'); if(!ul) return; ul.innerHTML=''; state.plates.forEach(p=>{ const li=document.createElement('li'); li.textContent = p.plate + ' (' + (p.type||'') + ')'; ul.appendChild(li); }); }

export function fillSelectors(){ const pf = document.getElementById('pd_fund'); if(pf){ pf.innerHTML=''; state.foundations.forEach((f,i)=>pf.appendChild(new Option(f.name+' ('+f.nit+')', i))); }
  const pi = document.getElementById('pd_item_sel'); if(pi){ pi.innerHTML=''; state.items.forEach((it,i)=> pi.appendChild(new Option((it.name||it.nombre) + ' - $' + (it.price||it.precio||0), i))); }
  const sd = document.getElementById('pd_driver'); if(sd){ sd.innerHTML=''; state.drivers.forEach((d,i)=> sd.appendChild(new Option(d.name, i))); }
  const sp = document.getElementById('pd_plate'); if(sp){ sp.innerHTML=''; state.plates.forEach((p,i)=> sp.appendChild(new Option(p.plate, i))); }
}
