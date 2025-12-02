import { state, saveState } from './state.js';
import { initFromExcelAssets } from './helpers.js';

export function setupSidebarToggle(){
  const btn = document.getElementById('btnMenu');
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');
  if(!btn||!sidebar) return;
  btn.addEventListener('click', ()=>{
    const hidden = sidebar.classList.toggle('sidebar-hidden');
    main.classList.toggle('expanded', hidden);
    localStorage.setItem('erp_sidebar_hidden', hidden? '1':'0');
  });
  const saved = localStorage.getItem('erp_sidebar_hidden')==='1';
  if(saved){ sidebar.classList.add('sidebar-hidden'); main.classList.add('expanded'); }
}

export function renderDrivers(){ const ul=document.getElementById('driversList'); if(!ul) return; ul.innerHTML=''; state.drivers.forEach((d,i)=>{ const li=document.createElement('li'); li.textContent=d.name+' — '+(d.document||''); ul.appendChild(li); }); }
export function renderPlates(){ const ul=document.getElementById('platesList'); if(!ul) return; ul.innerHTML=''; state.plates.forEach((p,i)=>{ const li=document.createElement('li'); li.textContent=p.plate+' ('+(p.type||'')+')'; ul.appendChild(li); }); }
export function renderItemsTable(){ const tbody=document.querySelector('#itemsTable tbody'); if(!tbody) return; tbody.innerHTML=''; state.items.forEach(it=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${it.ref||''}</td><td>${it.name||''}</td><td>$${it.price||0}</td>`; tbody.appendChild(tr); }); }
export function renderFundaciones(){ const box=document.getElementById('fundList'); if(!box) return; box.innerHTML=''; state.foundations.forEach(f=>{ const d=document.createElement('div'); d.className='card small'; let html = '<strong>'+ (f.name||'') +'</strong><div class="small">NIT: '+(f.nit||'')+'</div>'; if(Array.isArray(f.points)&&f.points.length){ html += '<div style="margin-top:8px">'; f.points.forEach(p=> html += '<div class="small">'+(p.barrio||'')+' — '+(p.localidad||'')+' — '+(p.ciudad||'')+'</div>'); html += '</div>'; } else { html += '<div class="small">Sin puntos</div>'; } d.innerHTML = html; box.appendChild(d); }); }
export function renderPedidos(){ const ul=document.getElementById('pedidosList'); if(!ul) return; ul.innerHTML=''; state.pedidos.forEach((p,i)=>{ const li=document.createElement('li'); li.style.marginBottom='8px'; li.innerHTML = '<b>'+p.id+'</b> — '+p.foundation+' — $'+(p.total||0)+' <div class="small">'+(new Date(p.createdAt).toLocaleString())+'</div>'; const btnView=document.createElement('button'); btnView.textContent='Ver'; btnView.addEventListener('click', ()=>{ alert(JSON.stringify(p,null,2)); }); li.appendChild(btnView); ul.appendChild(li); }); }

export function importPlatesFromFile(file){ if(!file) return alert('Seleccione archivo'); const reader=new FileReader(); reader.onload = e => { try{ const data=new Uint8Array(e.target.result); const wb=XLSX.read(data,{type:'array'}); const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1}); let added=0; rows.forEach((r,i)=>{ if(i===0) return; const plate=String(r[0]||'').trim(); const tipo=String(r[1]||'').trim(); if(!plate) return; if(!state.plates.some(p=>p.plate===plate)){ state.plates.push({plate:plate,type:tipo}); added++; } }); saveState(); alert('Placas importadas: '+added); renderPlates(); }catch(err){ console.error(err); alert('Error leyendo excel'); } }; reader.readAsArrayBuffer(file); }

export async function tryInitAssets(){ await initFromExcelAssets(); renderFundaciones(); renderItemsTable(); renderPlates(); renderDrivers(); }
