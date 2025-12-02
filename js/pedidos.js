import { state, saveState } from './state.js';
export function exportPedidoImagenByIndex(i){
  const p = state.pedidos[i];
  if(!p) return alert('No pedido');
  const wrapper=document.createElement('div');
  wrapper.style.width='1400px'; wrapper.style.padding='24px'; wrapper.style.background='#fff';
  wrapper.style.fontFamily='Arial,Helvetica,sans-serif';
  const rows = (p.items||[]).map(it=>`<tr><td style='border:1px solid #000;padding:8px'>${it.ref||''}</td><td style='border:1px solid #000;padding:8px'>${it.name||''}</td><td style='border:1px solid #000;padding:8px'>${it.pack||''}</td><td style='border:1px solid #000;padding:8px'>${it.qty||1}</td><td style='border:1px solid #000;padding:8px'>${it.kgs||0}</td></tr>`).join('');
  wrapper.innerHTML=`<div style="text-align:center;font-weight:700;font-size:28px">PEDIDO ${p.id}</div><div style="margin-top:8px"><b>Fundación:</b> ${p.foundation} — NIT: ${p.foundationNIT||''}</div><div style="margin-top:8px"><b>Conductor:</b> ${p.driver?.name||''} — Placa: ${p.driver?.plate||p.plate||''}</div><hr/><table style="width:100%;border-collapse:collapse"><thead><tr><th style='border:1px solid #000;padding:8px'>Ref</th><th style='border:1px solid #000;padding:8px'>Nombre</th><th style='border:1px solid #000;padding:8px'>Emb</th><th style='border:1px solid #000;padding:8px'>Cant</th><th style='border:1px solid #000;padding:8px'>Kgs</th></tr></thead><tbody>`+rows+`</tbody></table>`;
  document.body.appendChild(wrapper);
  html2canvas(wrapper,{scale:2}).then(canvas=>{ const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download='pedido_'+p.id+'.png'; document.body.appendChild(a); a.click(); a.remove(); wrapper.remove(); }).catch(e=>{ console.error(e); wrapper.remove(); alert('Error'); });
}
