
import { state, saveState, registerAction } from './state.js';
import { exportPedidoIMG } from './pedidos.js';

export function importPlatesFromExcelFile(file){
  if(!file) return alert('Seleccione un archivo');
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, {type:'array'});
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, {header:1});
      let added = 0;
      rows.forEach((r,i)=>{
        if(i===0) return;
        const plate = String(r[0]||'').trim();
        const tipo = String(r[1]||'').trim();
        if(!plate) return;
        if(!state.plates.some(p=>p.plate===plate)){
          state.plates.push({plate, type: tipo});
          added++;
        }
      });
      saveState();
      renderPlates();
      alert('Placas importadas: ' + added);
      registerAction('import_plates', {added});
    }catch(err){
      console.error(err);
      alert('Error leyendo excel');
    }
  };
  reader.readAsArrayBuffer(file);
}

export function renderDrivers(){
  const ul = document.getElementById('driversList');
  if(!ul) return;
  ul.innerHTML='';
  state.drivers.forEach(d=>{
    const li=document.createElement('li'); li.textContent = d.name + ' — ' + (d.document||'');
    ul.appendChild(li);
  });
}

export function renderPlates(){
  const ul = document.getElementById('platesList');
  if(!ul) return;
  ul.innerHTML='';
  state.plates.forEach(p=>{
    const li=document.createElement('li'); li.textContent = p.plate + ' ('+(p.type||'')+')';
    ul.appendChild(li);
  });
}

export function fillFundSelects(){
  const sel = document.getElementById('selFund');
  const pf = document.getElementById('pd_fund');
  if(sel){ sel.innerHTML=''; state.foundations.forEach((f,i)=> sel.appendChild(new Option(f.name+' ('+f.nit+')', i))); }
  if(pf){ pf.innerHTML=''; state.foundations.forEach((f,i)=> pf.appendChild(new Option(f.name+' ('+f.nit+')', i))); }
}

export function fillPedidoRelated(){
  const sd = document.getElementById('pd_driver');
  const sp = document.getElementById('pd_plate');
  const si = document.getElementById('pd_item_sel');
  const spack = document.getElementById('pd_pack_sel');
  if(sd){ sd.innerHTML=''; state.drivers.forEach((d,i)=> sd.appendChild(new Option(d.name,i))); }
  if(sp){ sp.innerHTML=''; state.plates.forEach((p,i)=> sp.appendChild(new Option(p.plate,i))); }
  if(si){ si.innerHTML=''; state.items.forEach((it,i)=> si.appendChild(new Option(it.name+' - '+it.ref,i))); }
  if(spack){ spack.innerHTML=''; spack.appendChild(new Option('','')); state.packs.forEach(p=> spack.appendChild(new Option(p,p))); }
}

export function renderFundList(){
  const box = document.getElementById('fundList');
  if(!box) return;
  box.innerHTML='';
  state.foundations.forEach(f=>{
    const d=document.createElement('div'); d.className='card'; d.style.marginBottom='8px';
    let html = '<strong>'+ (f.name||'') +'</strong><div class="small">NIT: '+(f.nit||'')+'</div>';
    if(Array.isArray(f.points) && f.points.length){
      html += '<div style="margin-top:8px">';
      f.points.forEach(p=> html += '<div class="small">'+(p.barrio||'')+' — '+(p.ciudad||'')+' — '+(p.encargada||'')+'</div>');
      html += '</div>';
    } else html += '<div class="small">Sin puntos</div>';
    d.innerHTML = html; box.appendChild(d);
  });
}

export function renderItemsTable(){
  const tbody = document.querySelector('#itemsTable tbody');
  if(!tbody) return;
  tbody.innerHTML='';
  state.items.forEach(it=>{
    const tr=document.createElement('tr');
    tr.innerHTML = '<td>'+ (it.ref||'') +'</td><td>'+ (it.name||'') +'</td><td>$'+(it.price||0) +'</td>';
    tbody.appendChild(tr);
  });
}

export function renderPedidosList(){
  const ul = document.getElementById('pedidosList');
  if(!ul) return;
  ul.innerHTML='';
  state.pedidos.forEach((p,i)=>{
    const li=document.createElement('li');
    li.style.marginBottom='8px';
    li.innerHTML = '<strong>'+p.id+'</strong> — '+(p.foundation||'')+' — $'+(p.total||0)+' <div class="small">'+new Date(p.createdAt).toLocaleString()+'</div>';
    const btnImg = document.createElement('button'); btnImg.textContent='IMG'; btnImg.className='primary'; btnImg.style.marginLeft='6px';
    btnImg.addEventListener('click', ()=> exportPedidoIMG(i));
    li.appendChild(btnImg);
    ul.appendChild(li);
  });
}
