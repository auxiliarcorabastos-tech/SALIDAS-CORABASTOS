import { state, saveState } from './state.js';
import { setupSidebarToggle, renderDrivers, renderPlates, renderItemsTable, renderFundaciones, renderPedidos, importPlatesFromFile, tryInitAssets } from './ui.js';
import { exportPedidoImagenByIndex } from './pedidos.js';

document.addEventListener('DOMContentLoaded', async ()=>{
  document.querySelectorAll('#sidebar button[data-sec]').forEach(b=> b.addEventListener('click', ()=>{ const id=b.dataset.sec; document.querySelectorAll('main section').forEach(s=>s.classList.add('hidden')); document.getElementById(id).classList.remove('hidden'); document.querySelectorAll('#sidebar button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); }));
  setupSidebarToggle();
  await tryInitAssets();
  renderFundaciones(); renderItemsTable(); renderDrivers(); renderPlates(); renderPedidos();

  document.getElementById('btnFundCreate').addEventListener('click', ()=>{ const nit=document.getElementById('f_nit').value.trim(); const name=document.getElementById('f_name').value.trim(); if(!nit||!name) return alert('NIT y nombre'); state.foundations.push({nit,name,points:[]}); saveState(); renderFundaciones(); alert('Fundación creada'); document.getElementById('f_nit').value=''; document.getElementById('f_name').value=''; });

  document.getElementById('btnCreateItem').addEventListener('click', ()=>{ const ref=document.getElementById('item_ref').value.trim(); const name=document.getElementById('item_name').value.trim(); const price=Number(document.getElementById('item_price').value)||270; if(!ref||!name) return alert('Ref y nombre'); state.items.push({ref,name,price}); saveState(); renderItemsTable(); document.getElementById('item_ref').value=''; document.getElementById('item_name').value=''; });

  document.getElementById('btnAddDriver').addEventListener('click', ()=>{ const name=document.getElementById('drv_name').value.trim(); const doc=document.getElementById('drv_doc').value.trim(); if(!name) return alert('Nombre'); state.drivers.push({name,document:doc}); saveState(); renderDrivers(); document.getElementById('drv_name').value=''; document.getElementById('drv_doc').value=''; });

  document.getElementById('btnImportPlates').addEventListener('click', ()=>{ const f=document.getElementById('excel_plates').files[0]; importPlatesFromFile(f); });

  let currentItems = [];
  document.getElementById('pd_add_item').addEventListener('click', ()=>{ const idx=Number(document.getElementById('pd_item_sel').value); if(isNaN(idx)||!state.items[idx]) return alert('Seleccione item'); const kgs=Number(document.getElementById('pd_kilos').value)||0; const it=state.items[idx]; currentItems.push({ref:it.ref,name:it.name,qty:1,kgs}); const ul=document.getElementById('pd_items_list'); const li=document.createElement('li'); li.textContent=it.name+' — '+kgs+'kg'; ul.appendChild(li); });

  document.getElementById('btnAddPedido').addEventListener('click', ()=>{ const fi=Number(document.getElementById('pd_fund').value||0); const f=state.foundations[fi]; if(!f) return alert('Seleccione fundación'); if(currentItems.length===0) return alert('Agregue items'); const peaje=Number(document.getElementById('pd_peaje').value)||0; const trans=Number(document.getElementById('pd_trans').value)||0; const subtotal=currentItems.reduce((s,it)=>s+(it.qty||1)*(it.price||0),0); const total=subtotal+peaje+trans; const pedido={ id:'PED-'+Date.now(), foundation:f.name, foundationNIT:f.nit, point:null, items: currentItems.slice(), peaje, trans, total, createdAt:new Date().toISOString() }; state.pedidos.unshift(pedido); saveState(); alert('Pedido guardado: '+pedido.id); currentItems=[]; renderPedidos(); });

  document.getElementById('btnExportPedidoIMG').addEventListener('click', ()=>{ if(state.pedidos.length===0) return alert('Sin pedidos'); exportPedidoImagenByIndex(0); });

  document.getElementById('btnExportConfig').addEventListener('click', ()=>{ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='erp_config.json'; a.click(); URL.revokeObjectURL(a.href); });

  document.getElementById('btnImportConfig').addEventListener('click', ()=>{ const f=document.getElementById('importConfig').files[0]; if(!f) return alert('Seleccione archivo'); const r=new FileReader(); r.onload=e=>{ try{ const remote=JSON.parse(e.target.result); function mergeArray(local, remote, key){ (remote||[]).forEach(rc=>{ if(!local.some(l=> l[key] && rc[key] && l[key]===rc[key])) local.push(rc); }); } mergeArray(state.foundations, remote.foundations||[], 'nit'); mergeArray(state.items, remote.items||[], 'ref'); mergeArray(state.plates, remote.plates||[], 'plate'); mergeArray(state.pedidos, remote.pedidos||[], 'id'); saveState(); alert('Importado y fusionado'); renderFundaciones(); renderItemsTable(); renderPlates(); renderPedidos(); }catch(err){ alert('JSON inválido'); }}; r.readAsText(f); });

  // periodic simple pull stub (no remote)
  setInterval(()=>{ console.log('sync tick'); }, 10000);
});
