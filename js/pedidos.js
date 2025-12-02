
import { state, saveState, registerAction } from './state.js';

export function exportPedidoIMG(idx){
  const p = state.pedidos[idx];
  if(!p) return alert('Pedido no encontrado');
  const totalK = (p.items||[]).reduce((s,it)=> s + (parseFloat(it.kgs)||0), 0);
  const wrapper = document.createElement('div');
  wrapper.style.width='1400px'; wrapper.style.padding='28px'; wrapper.style.fontFamily='Arial,Helvetica';
  wrapper.style.background='#fff'; wrapper.style.color='#000';
  const itemsHtml = (p.items||[]).map(it=> `<tr><td style="border:1px solid #000;padding:8px">${it.name}</td><td style="border:1px solid #000;padding:8px">${it.pack||''}</td><td style="border:1px solid #000;padding:8px">${it.qty||1}</td><td style="border:1px solid #000;padding:8px">${it.kgs||0}</td></tr>`).join('');
  wrapper.innerHTML = `
    <div style="text-align:center;font-size:28px;font-weight:700;margin-bottom:12px">PEDIDO</div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><div><b>Fundación:</b> ${p.foundation||''}<br><b>NIT:</b> ${p.foundationNIT||''}</div><div><b>Pedido #:</b> ${p.id}</div></div>
    <div style="margin-bottom:12px"><b>Punto:</b> ${p.point?.barrio||''} — ${p.point?.ciudad||''}</div>
    <div style="margin-bottom:12px"><b>Conductor:</b> ${p.driver?.name||''} — <b>Placa:</b> ${p.driver?.plate||''}</div>
    <table style="width:100%;border-collapse:collapse"><thead><tr><th style="border:1px solid #000;padding:8px">Item</th><th style="border:1px solid #000;padding:8px">Embalaje</th><th style="border:1px solid #000;padding:8px">Cant</th><th style="border:1px solid #000;padding:8px">Kgs</th></tr></thead><tbody>${itemsHtml}</tbody></table>
    <div style="margin-top:12px;font-size:18px"><b>Total Kgs:</b> ${totalK} — <b>Peaje:</b> $${p.peaje||0} — <b>Trans:</b> $${p.trans||0} — <b>Total:</b> $${p.total||0}</div>
  `;
  document.body.appendChild(wrapper);
  html2canvas(wrapper,{scale:2}).then(canvas=>{
    const link=document.createElement('a'); link.download='pedido_'+p.id+'.png'; link.href=canvas.toDataURL('image/png'); link.click(); wrapper.remove();
  }).catch(e=>{ console.error(e); wrapper.remove(); alert('Error generando imagen'); });
}
