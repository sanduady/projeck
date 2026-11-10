/* Project — обработчики событий */
function resetState(){
  Object.assign(S,{cat:null,sub:null,q:"",reg:"all",min:"",max:"",cond:"all",photo:false,priv:false,deal:false,delivery:false,verified:false,attrs:{},ids:null,favOnly:false,sort:"new",shown:24});
  $("#q").value=""; $("#pmin").value=$("#pmax").value=""; $("#fPhoto").checked=$("#fPrivate").checked=$("#fDeal").checked=$("#fDel").checked=$("#fVer").checked=false;
  $$("#cond .chip").forEach(x=>x.classList.toggle("on", x.dataset.v==="all")); $("#sort").value="new";
}
const go = (patch) => { Object.assign(S, {shown:24}, patch); renderCats(); render(); };
const toMain = () => { const h = document.querySelector("header").offsetHeight;
  const y = document.querySelector(".main").getBoundingClientRect().top + window.scrollY - h - 8;
  if (Math.abs(window.scrollY - y) > 4) window.scrollTo({top:Math.max(0,y), behavior:"smooth"}); };
document.addEventListener("click", e => {
  const fav = e.target.closest("[data-fav]");
  if (fav){ e.preventDefault(); e.stopPropagation(); const id=+fav.dataset.fav;
    FAV.has(id) ? (FAV.delete(id), toast(t("favDel"))) : (FAV.add(id), toast(t("favAdd"))); saveFav();
    $$(`.fav[data-fav="${id}"]`).forEach(b=>b.classList.toggle("on",FAV.has(id)));
    if (S.favOnly) render(); else { const n=FAV.size; ["#favN","#favN2"].forEach(x=>{$(x).hidden=!n;$(x).textContent=n;}); }
    return; }
  const mc = e.target.closest("[data-mc]");
  if (mc){ closeModal(); go({cat:mc.dataset.mc, sub: mc.dataset.ms!=null? +mc.dataset.ms : null, attrs:{}, ids:null, favOnly:false}); toMain(); return; }
  const cat = e.target.closest("[data-cat]");
  if (cat){ e.preventDefault(); const same=S.cat===cat.dataset.cat; go({cat: same?null:cat.dataset.cat, sub:null, attrs:{}, ids:null, favOnly:false}); toMain(); return; }
  const sub = e.target.closest("[data-sub]");
  if (sub){ const v = sub.dataset.sub===""?null:+sub.dataset.sub; const keep={}; const c=catOf(S.cat);
    for (const k in S.attrs) if (fieldsFor(c,v).some(f=>f.k===k)) keep[k]=S.attrs[k];
    go({sub:v, attrs:keep}); return; }
  const ask = e.target.closest("[data-ask]"); if (ask){ aiSend(ask.dataset.ask); return; }
  const op = e.target.closest("[data-open]"); if (op){ openAd(+op.dataset.open); return; }
  const si = e.target.closest("[data-showids]");
  if (si){ resetState(); go({ids: si.dataset.showids.split(",").map(Number)}); $("#drawer").classList.remove("open"); document.body.style.overflow=""; toMain(); return; }
  const sl = e.target.closest("[data-seller]"); if (sl){ openSeller(+sl.dataset.seller); return; }
  const city = e.target.closest("[data-city]"); if (city){ $("#regionTop").value=$("#region").value=city.dataset.city; go({reg:city.dataset.city, view:"grid"}); toMain(); return; }
  const card = e.target.closest(".card"); if (card){ openAd(+card.dataset.id); return; }
  const x = e.target.closest("[data-x]");
  if (x){ const k=x.dataset.x;
    if (k.startsWith("a:")){ const a={...S.attrs}; delete a[k.slice(2)]; go({attrs:a}); return; }
    const p = {ids:{ids:null},fav:{favOnly:false},cat:{cat:null,sub:null,attrs:{}},sub:{sub:null},q:{q:""},reg:{reg:"all"},price:{min:"",max:""},delivery:{delivery:false},verified:{verified:false}}[k];
    if (k==="delivery") $("#fDel").checked=false; if (k==="verified") $("#fVer").checked=false;
    if (k==="q") $("#q").value=""; if (k==="price") $("#pmin").value=$("#pmax").value="";
    go(p); renderStatic(); return; }
  if (e.target.closest("#mx") || e.target===$("#ov")) closeModal();
  if (e.target.closest('a[href="#"]')) e.preventDefault();
});
document.addEventListener("keydown", e => { if (e.key==="Escape"){ if ($("#ov").classList.contains("show")) closeModal(); else $("#drawer").classList.remove("open"); } });
$("#adv").addEventListener("change", e => {
  const el = e.target;
  if (el.dataset.af){ const a={...S.attrs}; if (el.value) a[el.dataset.af]=el.value; else delete a[el.dataset.af]; go({attrs:a}); }
});
let at; $("#adv").addEventListener("input", e => { const el=e.target; if(!el.dataset.ar) return; clearTimeout(at); at=setTimeout(()=>{
  const a={...S.attrs}, cur={...(a[el.dataset.ar]||{})}; cur[el.dataset.e]= el.value===""?undefined:+el.value;
  if (cur.min==null && cur.max==null) delete a[el.dataset.ar]; else a[el.dataset.ar]=cur;
  Object.assign(S,{attrs:a,shown:24}); render(); }, 300); });
$$(".lang button").forEach(b => b.onclick = () => { S.lang=b.dataset.l; full(); if($("#msgs").children.length===1) aiWelcome(); });
$("#home").onclick = e => { e.preventDefault(); resetState(); full(); window.scrollTo({top:0,behavior:"smooth"}); };
$("#allCats").onclick = openMega;
let qt; $("#q").oninput = e => { clearTimeout(qt); qt = setTimeout(()=>go({q:e.target.value, ids:null}),180); };
$("#sform").onsubmit = e => { e.preventDefault(); go({q:$("#q").value, ids:null}); toMain(); };
$("#favBtn").onclick = () => { go({favOnly:!S.favOnly, ids:null}); toMain(); };
$("#postBtn").onclick = openPost;
$("#aiBtn").onclick = () => openAI($("#q").value.trim().split(/\s+/).length>=3 ? $("#q").value : "");
$("#aiStrip").onclick = () => openAI(t("aiS")[0]);
$("#aiClose").onclick = () => $("#drawer").classList.remove("open");
$("#aiForm").onsubmit = e => { e.preventDefault(); aiSend($("#aiIn").value); };
$("#aiIn").onkeydown = e => { if (e.key==="Enter" && !e.shiftKey){ e.preventDefault(); aiSend($("#aiIn").value); } };
$("#loginLink").onclick = e => { e.preventDefault(); openLogin(); };
$("#regionTop").onchange = e => { go({reg:e.target.value}); $("#region").value=S.reg; };
$("#region").onchange = e => { go({reg:e.target.value}); $("#regionTop").value=S.reg; };
let pt; ["#pmin","#pmax"].forEach(s => $(s).oninput = () => { clearTimeout(pt); pt=setTimeout(()=>go({min:$("#pmin").value,max:$("#pmax").value}),250); });
$("#cur").onclick = e => { const b=e.target.closest("[data-c]"); if(!b)return; $$("#cur .chip").forEach(x=>x.classList.toggle("on",x===b)); go({cur:b.dataset.c}); };
$("#cond").onclick = e => { const b=e.target.closest("[data-v]"); if(!b)return; $$("#cond .chip").forEach(x=>x.classList.toggle("on",x===b)); go({cond:b.dataset.v}); };
$("#fPhoto").onchange = e => go({photo:e.target.checked});
$("#fPrivate").onchange = e => go({priv:e.target.checked});
$("#fDeal").onchange = e => go({deal:e.target.checked});
$("#fDel").onchange = e => go({delivery:e.target.checked});
$("#fVer").onchange = e => go({verified:e.target.checked});
$("#saveS").onclick = saveSearch;
$("#msgBtn").onclick = () => openChats();
$("#cabBtn").onclick = () => openCabinet();
$("#sort").onchange = e => go({sort:e.target.value});
$$(".vt button").forEach(b => b.onclick = () => { S.view=b.dataset.v; render(); });
$("#more").onclick = () => { S.shown += 24; render(); };
const sheet = open => { $("#aside").classList.toggle("open",open); $("#scrim").classList.toggle("show",open); document.body.style.overflow = open?"hidden":""; };
$("#mobF").onclick = () => sheet(true);
$("#asideX").onclick = $("#asideApply").onclick = $("#scrim").onclick = () => { sheet(false); toMain(); };
$("#bnav").onclick = e => { const b=e.target.closest("[data-nav]"); if(!b) return; const v=b.dataset.nav;
  if (v==="home"){ resetState(); full(); window.scrollTo({top:0,behavior:"smooth"}); }
  else if (v==="cats") openMega();
  else if (v==="post") openPost();
  else if (v==="msgs") openChats();
  else if (v==="cab") openCabinet();
  else if (v==="fav"){ go({favOnly:!S.favOnly, ids:null}); toMain(); } };
$("#reset").onclick = () => { resetState(); full(); };

