import { state, saveState } from './state.js';
export async function initFromExcelAssets(){
  try{
    const res = await fetch('assets/BASE DE DATOS.xlsx');
    if(!res.ok) return;
    const ab = await res.arrayBuffer();
    const wb = XLSX.read(new Uint8Array(ab), {type:'array'});
    if(wb.SheetNames.length>0){
      const s0=wb.Sheets[wb.SheetNames[0]];
      const rows0=XLSX.utils.sheet_to_json(s0,{header:1});
      rows0.forEach((r,i)=>{ if(i===0) return; const nit=String(r[0]||'').trim(); const name=String(r[1]||'').trim(); if(!nit||!name) return; if(!state.foundations.some(f=>f.nit===nit)){ state.foundations.push({nit,name,points:[]}); } });
    }
    if(wb.SheetNames.length>1){
      const s1=wb.Sheets[wb.SheetNames[1]];
      const rows1=XLSX.utils.sheet_to_json(s1,{header:1});
      rows1.forEach((r,i)=>{ if(i===0) return; const ref=String(r[0]||'').trim(); const name=String(r[1]||'').trim(); const price=Number(r[2]||270); const desc=String(r[3]||'').trim(); if(!ref||!name) return; if(!state.items.some(it=>it.ref===ref)){ state.items.push({ref,name,price,desc}); } });
    }
    if(wb.SheetNames.length>2){
      const s2=wb.Sheets[wb.SheetNames[2]];
      const rows2=XLSX.utils.sheet_to_json(s2,{header:1});
      rows2.forEach((r,i)=>{ if(i===0) return; const plate=String(r[0]||'').trim(); const tipo=String(r[1]||'').trim(); if(!plate) return; if(!state.plates.some(p=>p.plate===plate)){ state.plates.push({plate:type?type:tipo, type:tipo}); } });
    }
    saveState();
  }catch(e){ console.warn('No assets or error',e); }
}
