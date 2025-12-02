
import { state, saveState, registerAction } from './state.js';
import { pullState, mergeRemote } from './google_sync.js';
import { setupSidebarToggle } from './ui.js';
import { importPlatesFromExcelFile, renderDrivers, renderPlates, fillFundSelects, fillPedidoRelated, renderFundList, renderItemsTable, renderPedidosList } from './ui_helpers.js';

// init UI
document.addEventListener('DOMContentLoaded', async ()=>{
  setupSidebarToggle();
  // navigation
  document.querySelectorAll('.nav-btn').forEach(b=> b.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(nb=> nb.classList.remove('active'));
    b.classList.add('active');
    document.querySelectorAll('.section').forEach(s=> s.classList.add('hidden'));
    const id = b.dataset.sec;
    document.getElementById(id).classList.remove('hidden');
  }));

  // fill initial UI
  fillFundSelects(); fillPedidoRelated(); renderFundList(); renderItemsTable(); renderDrivers(); renderPlates(); renderPedidosList();

  // wire buttons
  document.getElementById('btnFundCreate').addEventListener('click', ()=>{
    const nit = document.getElementById('f_nit').value.trim();
    const name = document.getElementById('f_name').value.trim();
    if(!nit || !name) return alert('NIT y nombre requeridos');
    if(state.foundations.some(f=>f.nit===nit)) return alert('NIT ya existe');
    state.foundations.push({nit, name, points:[]});
    saveState(); fillFundSelects(); renderFundList(); registerAction('crear_fund', {nit,name}); document.getElementById('f_nit').value=''; document.getElementById('f_name').value='';
  });

  document.getElementById('btnPointCreate').addEventListener('click', ()=>{
    const idx = Number(document.getElementById('selFund').value);
    const f = state.foundations[idx];
    if(!f) return alert('Seleccione fundación');
    const p = { barrio: document.getElementById('p_barrio').value.trim(), ciudad: document.getElementById('p_ciudad').value.trim(), encargada: document.getElementById('p_encargada').value.trim()};
    f.points = f.points || []; f.points.push(p); saveState(); fillFundSelects(); renderFundList(); registerAction('crear_punto',{fund:f.nit,p}); document.getElementById('p_barrio').value='';
  });

  document.getElementById('btnCreateItem').addEventListener('click', ()=>{
    const ref = document.getElementById('item_ref').value.trim();
    const name = document.getElementById('item_name').value.trim();
    const price = Number(document.getElementById('item_price').value) || 0;
    if(!ref||!name) return alert('Referencia y nombre requeridos');
    if(state.items.some(it=>it.ref===ref)) return alert('Referencia ya existe');
    state.items.push({ref,name,price}); saveState(); renderItemsTable(); fillPedidoRelated(); registerAction('crear_item',{ref,name}); document.getElementById('item_ref').value=''; document.getElementById('item_name').value='';
  });

  document.getElementById('btnAddDriver').addEventListener('click', ()=>{
    const name = document.getElementById('drv_name').value.trim();
    const doc = document.getElementById('drv_doc').value.trim();
    if(!name) return alert('Nombre requerido');
    state.drivers.push({name,document:doc}); saveState(); renderDrivers(); fillPedidoRelated(); registerAction('crear_driver',{name}); document.getElementById('drv_name').value=''; document.getElementById('drv_doc').value='';
  });

  document.getElementById('btnAddPlate').addEventListener('click', ()=>{
    const plate = document.getElementById('pl_plate').value.trim();
    const type = document.getElementById('pl_type').value.trim();
    if(!plate) return alert('Placa requerida');
    if(state.plates.some(p=>p.plate===plate)) return alert('Placa ya existe');
    state.plates.push({plate,type}); saveState(); renderPlates(); fillPedidoRelated(); registerAction('crear_placa',{plate}); document.getElementById('pl_plate').value=''; document.getElementById('pl_type').value='';
  });

  document.getElementById('btnImportPlates').addEventListener('click', ()=>{
    const file = document.getElementById('excel_plates').files[0]; importPlatesFromExcelFile(file);
  });

  // pedido flows
  let currentPedidoItems = [];
  function refreshPdItems(){ const ul=document.getElementById('pd_items_list'); ul.innerHTML=''; currentPedidoItems.forEach((it,i)=>{ const li=document.createElement('li'); li.textContent = it.name + ' x' + (it.qty||1) + ' — ' + (it.kgs||0) + 'kg'; const del=document.createElement('button'); del.textContent='Eliminar'; del.style.marginLeft='8px'; del.addEventListener('click', ()=>{ currentPedidoItems.splice(i,1); refreshPdItems(); }); li.appendChild(del); ul.appendChild(li); }); }
  document.getElementById('pd_add_item').addEventListener('click', ()=>{
    const idx = Number(document.getElementById('pd_item_sel').value);
    if(isNaN(idx) || !state.items[idx]) return alert('Seleccione item');
    const it = state.items[idx]; const pack = document.getElementById('pd_pack_sel').value || ''; const qty = Number(document.getElementById('pd_pack_qty').value)||1; const kgs = Number(document.getElementById('pd_kilos').value)||0;
    currentPedidoItems.push({ref:it.ref,name:it.name,price:it.price,pack,qty,kgs}); refreshPdItems();
  });

  document.getElementById('btnAddPedido').addEventListener('click', ()=>{
    if(currentPedidoItems.length===0) return alert('Agregue items');
    const fi = Number(document.getElementById('pd_fund').value); const f = state.foundations[fi];
    if(!f) return alert('Seleccione fundación');
    const pi = Number(document.getElementById('pd_point').value); const point = (f.points||[])[pi];
    if(!point) return alert('Seleccione punto');
    const driverIdx = Number(document.getElementById('pd_driver').value); const driver = state.drivers[driverIdx]||null;
    const plateIdx = Number(document.getElementById('pd_plate').value); const plate = state.plates[plateIdx]||null;
    const peaje = Number(document.getElementById('pd_peaje').value)||0; const trans = Number(document.getElementById('pd_trans').value)||0;
    const subtotal = currentPedidoItems.reduce((s,it)=> s + ((it.price||0) * (it.qty||1)),0); const total = subtotal + peaje + trans;
    const pedido = { id: 'PED-'+Date.now(), foundation:f.name, foundationNIT:f.nit, point, items: currentPedidoItems.slice(), peaje, trans, total, driver, createdAt: new Date().toISOString() };
    state.pedidos.unshift(pedido); saveState(); registerAction('crear_pedido',{id:pedido.id}); currentPedidoItems=[]; refreshPdItems(); renderPedidosList(); alert('Pedido creado: '+pedido.id);
  });

  // Export/import config
  document.getElementById('btnExportConfig').addEventListener('click', ()=>{
    const data = JSON.stringify({foundations: state.foundations, items: state.items, plates: state.plates, pedidos: state.pedidos});
    const blob = new Blob([data], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'erp_export_'+Date.now()+'.json'; a.click();
  });
  document.getElementById('btnImportConfig').addEventListener('click', ()=>{
    const f = document.getElementById('importConfigFile').files[0]; if(!f) return alert('Seleccione archivo'); const r=new FileReader(); r.onload = e=>{ try{ const remote = JSON.parse(e.target.result); // merge non-destructive
      (remote.foundations||[]).forEach(f=>{ if(!state.foundations.some(x=>x.nit===f.nit)) state.foundations.push(f) });
      (remote.items||[]).forEach(it=>{ if(!state.items.some(x=>x.ref===it.ref)) state.items.push(it) });
      (remote.plates||[]).forEach(p=>{ if(!state.plates.some(x=>x.plate===p.plate)) state.plates.push(p) });
      (remote.pedidos||[]).forEach(pd=>{ if(!state.pedidos.some(x=>x.id===pd.id)) state.pedidos.push(pd) });
      saveState(); fillFundSelects(); fillPedidoRelated(); renderFundList(); renderItemsTable(); renderPlates(); renderPedidosList(); alert('Import OK'); }catch(er){alert('Error al importar')}}; r.readAsText(f);
  });

  // Try auto-import from assets if available (BASE DE DATOS.xlsx)
  try{
    fetch('assets/BASE DE DATOS.xlsx').then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer() }).then(ab=>{
      const wb = XLSX.read(new Uint8Array(ab), {type:'array'});
      if(wb.SheetNames.length>0){
        const s0 = wb.Sheets[wb.SheetNames[0]]; const rows0 = XLSX.utils.sheet_to_json(s0,{header:1});
        rows0.forEach((r,i)=>{ if(i===0) return; const nit=String(r[0]||'').trim(); const name=String(r[1]||'').trim(); if(nit && name && !state.foundations.some(f=>f.nit===nit)) state.foundations.push({nit,name,points:[]}); });
      }
      if(wb.SheetNames.length>1){
        const s1 = wb.Sheets[wb.SheetNames[1]]; const rows1 = XLSX.utils.sheet_to_json(s1,{header:1});
        rows1.forEach((r,i)=>{ if(i===0) return; const ref=String(r[0]||'').trim(); const name=String(r[1]||'').trim(); const price=Number(r[2]||0); if(ref && name && !state.items.some(it=>it.ref===ref)) state.items.push({ref,name,price}); });
      }
      if(wb.SheetNames.length>2){
        const s2 = wb.Sheets[wb.SheetNames[2]]; const rows2 = XLSX.utils.sheet_to_json(s2,{header:1});
        rows2.forEach((r,i)=>{ if(i===0) return; const plate=String(r[0]||'').trim(); const tipo=String(r[1]||'').trim(); if(plate && !state.plates.some(p=>p.plate===plate)) state.plates.push({plate,type:tipo}); });
      }
      saveState(); fillFundSelects(); fillPedidoRelated(); renderFundList(); renderItemsTable(); renderPlates(); renderPedidosList();
    }).catch(()=>{});
  }catch(e){console.warn('no assets');}

  // periodic sync (every 10s) - non-blocking
  setInterval(async ()=>{
    try{
      const remote = await pullState();
      if(remote){ const added = mergeRemote(remote); if(added>0){ fillFundSelects(); fillPedidoRelated(); renderFundList(); renderItemsTable(); renderPlates(); renderPedidosList(); } }
    }catch(e){ console.warn('sync err',e); }
  }, 10000);
});
