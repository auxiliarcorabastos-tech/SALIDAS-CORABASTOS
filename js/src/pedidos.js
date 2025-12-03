
import { state, saveState } from './state.js';
import { renderFundList, fillSelectors, renderPlates, renderDrivers, renderItemsTable } from './ui.js';
import { pushSync, pullSync } from './google_sync.js';

let currentItems = [];

export function initPedidos(){
  const btnAddItem = document.getElementById('pd_add_item');
  if(btnAddItem) btnAddItem.addEventListener('click', ()=>{ const idx = Number(document.getElementById('pd_item_sel').value); if(isNaN(idx)) return alert('Seleccione item'); const it = state.items[idx]; const qty = Number(document.getElementById('pd_pack_qty').value)||1; const kgs = Number(document.getElementById('pd_kilos').value)||0; currentItems.push({name:it.name||it.nombre, price:it.price||it.precio||0, qty, kgs, pack:document.getElementById('pd_pack_sel').value||''}); renderCurrentItems(); });
  const btnGen = document.getElementById('btnAddPedido');
  if(btnGen) btnGen.addEventListener('click', ()=>{ const nit=document.getElementById('pd_nit').value.trim(); const fi=Number(document.getElementById('pd_fund').value); const f=state.foundations[fi]; if(!nit || !f) return alert('NIT y fundación requeridos'); if(currentItems.length===0) return alert('Agregue items'); const pedido = { id:'PED-'+Date.now(), foundation:f.name, foundationNIT:f.nit, point: state.foundations[fi].points ? state.foundations[fi].points[Number(document.getElementById('pd_point').value||0)] : null, items: currentItems.slice(), peaje: Number(document.getElementById('pd_peaje').value)||0, trans: Number(document.getElementById('pd_trans').value)||0, createdAt:new Date().toISOString() }; state.pedidos.unshift(pedido); saveState(); pushSync(); currentItems=[]; renderPedidos(); alert('Pedido creado: '+pedido.id); });
  renderPedidos();
}

export function renderCurrentItems(){ const ul=document.getElementById('pd_items_list'); if(!ul) return; ul.innerHTML=''; currentItems.forEach((it,i)=>{ const li=document.createElement('li'); li.textContent = it.name + ' x' + it.qty + ' — ' + it.kgs + 'kg'; const del=document.createElement('button'); del.textContent='Eliminar'; del.style.marginLeft='8px'; del.addEventListener('click', ()=>{ currentItems.splice(i,1); renderCurrentItems(); }); li.appendChild(del); ul.appendChild(li); }); }

export function renderPedidos(){ const ul=document.getElementById('pedidosList'); if(!ul) return; ul.innerHTML=''; state.pedidos.forEach((p,idx)=>{ const li=document.createElement('li'); li.innerHTML = '<strong>' + p.id + '</strong> — <div class="small">' + (new Date(p.createdAt).toLocaleString()) + '</div>'; const btnView=document.createElement('button'); btnView.textContent='Ver Imagen'; btnView.addEventListener('click', ()=>{ exportPedidoAsImage(idx); }); li.appendChild(btnView); ul.appendChild(li); }); }

export function exportPedidoAsImage(i){ const p = state.pedidos[i]; if(!p) return alert('Pedido no encontrado'); const wrapper = document.createElement('div'); wrapper.style.width='1200px'; wrapper.style.padding='24px'; wrapper.style.background='#fff'; wrapper.style.color='#000'; wrapper.innerHTML = '<h2>Pedido: ' + p.id + '</h2><div><b>Fundación:</b> ' + p.foundation + ' — NIT: ' + p.foundationNIT + '</div><div><b>Punto:</b> ' + (p.point? p.point.barrio : '') + '</div><hr/><table style="width:100%;border-collapse:collapse"><thead><tr><th>Item</th><th>Pack</th><th>Qty</th><th>Kgs</th></tr></thead><tbody>' + p.items.map(it=>('<tr><td>'+it.name+'</td><td>'+it.pack+'</td><td>'+it.qty+'</td><td>'+it.kgs+'</td></tr>')).join('') + '</tbody></table>'; document.body.appendChild(wrapper); import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js').then(({default:html2canvas})=>{ html2canvas(wrapper,{scale:2}).then(canvas=>{ const a=document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'pedido_' + p.id + '.png'; a.click(); wrapper.remove(); }); }).catch(e=>{ alert('html2canvas error'); wrapper.remove(); console.error(e); }); }
