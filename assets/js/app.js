/* Gata.md — состояние, поиск, отрисовка, окна */
const S = {lang:"ru",cat:null,sub:null,q:"",reg:"all",min:"",max:"",cur:"MDL",cond:"all",photo:false,priv:false,deal:false,delivery:false,verified:false,attrs:{},ids:null,sort:"new",view:"grid",favOnly:false,shown:24};
const FAV = new Set();
try{ JSON.parse(localStorage.getItem("gata_fav")||"[]").forEach(x=>FAV.add(x)); }catch(e){}
const saveFav = () => { try{ localStorage.setItem("gata_fav",JSON.stringify([...FAV])); }catch(e){} };
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const t = k => T[S.lang][k] ?? T.ru[k] ?? k;
const L = () => S.lang==="ru"?1:2;
const catOf = id => CATS.find(c=>c.id===id);
const subName = (c,i,lang=S.lang) => c.subs[i][lang==="ru"?0:1];
const regName = (id,lang=S.lang) => { const r = REG.find(r=>r[0]===id); return r ? r[lang==="ru"?1:2] : ""; };
const esc = s => String(s).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const fieldsFor = (c,sub) => c ? c.fields.filter(f => !f.only || (sub!==null && sub!==undefined && f.only.includes(sub))) : [];
const fmtN = n => Math.round(n).toLocaleString("ru-RU");
const curS = c => c==="EUR"?"€":(S.lang==="ru"?"лей":"lei");
const mdl = a => a.cur==="EUR" ? a.price*RATE : a.price;
const isDeal = a => a.val>0 && a.price>0 && a.price <= a.val*0.9;
function fmtAttr(f,v,lang=S.lang){
  const ru = lang==="ru";
  if (f.k==="mileage") return fmtN(v)+" км";
  if (f.k==="rooms") return (v==="4"?"4+":v)+(ru?" комн.":" cam.");
  if (f.k==="floor") return v+(ru?" этаж":" etaj");
  if (f.k==="land") return v+(ru?" сот.":" ari");
  if (f.k==="year") return v+(ru?" г.":"");
  if (f.k==="shoe") return (ru?"р. ":"mr. ")+v;
  if (f.t==="sel") return lbl(f.opts,v,lang);
  if (f.k==="ram"||f.k==="storage") return v>=1000? (v/1000)+" TB" : v+" GB";
  return v + (f.u? (f.u==="\""?'"':" "+f.u) : "");
}
function specLine(a){
  const c=catOf(a.cat), fs=fieldsFor(c,a.sub).filter(f=>a.attrs[f.k]!=null && !(f.k==="brand") && !(f.k==="sector"));
  return fs.slice(0,3).map(f=>fmtAttr(f,a.attrs[f.k])).join(" · ");
}
const fmtPrice = a => (a.cat==="free"||(a.price===0 && !["serv","job"].includes(a.cat))) ? `<span class="price free">${t("free")}</span>` :
  a.price===0 ? `<span class="price">${t("neg")}</span>` : `<span class="price">${fmtN(a.price)} ${curS(a.cur)}</span>`;
const fmtDate = ts => { const d = Math.floor((Date.now()-ts)/864e5), hm = new Date(ts).toTimeString().slice(0,5);
  return d===0 ? `${t("today")}, ${hm}` : d===1 ? `${t("yest")}, ${hm}` : `${d} ${t("ago")}`; };
function cover(a){
  if (a.imgs.length) return `style="background-image:url(${a.imgs[0]})"`;
  const c = catOf(a.cat).c, ang = (a.id*47)%360;
  return `style="background:linear-gradient(${ang}deg, ${c}, ${c}aa 60%, ${c}55)"`;
}

/* =================== FILTER ENGINE (используется и сайтом, и ИИ) =================== */
function query(p){
  const q = (p.q||"").trim().toLowerCase().split(/\s+/).filter(Boolean);
  const k = p.cur==="EUR"?RATE:1;
  const min = p.min===""||p.min==null ? null : +p.min*k, max = p.max===""||p.max==null ? null : +p.max*k;
  let r = ADS.filter(a =>
    (!p.ids || p.ids.includes(a.id)) && (!p.favOnly || FAV.has(a.id)) &&
    (!p.cat || a.cat===p.cat) && (p.sub==null || a.sub===p.sub) &&
    (!p.reg || p.reg==="all" || a.reg===p.reg) && (!p.cond || p.cond==="all" || a.cond===p.cond) &&
    (!p.photo || a.photos>0) && (!p.priv || a.priv) && (!p.deal || isDeal(a)) && (!p.delivery || a.delivery) && (!p.verified || sellerOf(a).verified) &&
    (min==null || mdl(a) >= min) && (max==null || (mdl(a) <= max && !(a.price===0 && ["serv","job"].includes(a.cat)))) &&
    (!q.length || q.every(w => (a.title+" "+a.desc+" "+Object.values(a.attrs).join(" ")).toLowerCase().includes(w))) &&
    Object.entries(p.attrs||{}).every(([key,v]) => {
      const x = a.attrs[key];
      if (v==null || v==="" ) return true;
      if (typeof v==="object") return x!=null && (v.min==null||v.min===""||+x>=+v.min) && (v.max==null||v.max===""||+x<=+v.max);
      return x!=null && String(x).toLowerCase()===String(v).toLowerCase();
    }));
  const dealScore = a => a.val>0 && a.price>0 ? a.val/a.price : 0;
  const by = {new:(a,b)=>b.t-a.t, cheap:(a,b)=>mdl(a)-mdl(b), exp:(a,b)=>mdl(b)-mdl(a), pop:(a,b)=>b.views-a.views, deal:(a,b)=>dealScore(b)-dealScore(a)||b.t-a.t, value:(a,b)=>(b.val||0)-(a.val||0)}[p.sort||"new"];
  if (p.ids && (!p.sort || p.sort==="new")) r.sort((a,b)=>p.ids.indexOf(a.id)-p.ids.indexOf(b.id));
  else r.sort((a,b)=> ((p.sort||"new")==="new" ? (b.top-a.top) : 0) || by(a,b));
  return r;
}

/* =================== RENDER =================== */
function renderStatic(){
  document.documentElement.lang = S.lang;
  $$("[data-i]").forEach(el => el.textContent = t(el.dataset.i));
  $$("[data-ip]").forEach(el => el.placeholder = t(el.dataset.ip));
  $$("[data-it]").forEach(el => el.title = t(el.dataset.it));
  $$(".lang button").forEach(b => b.classList.toggle("on", b.dataset.l===S.lang));
  const opts = REG.map(r=>`<option value="${r[0]}">${r[L()]}</option>`).join("");
  $("#regionTop").innerHTML = opts; $("#region").innerHTML = opts;
  $("#regionTop").value = S.reg; $("#region").value = S.reg;
  $("#pmin").placeholder = t("from"); $("#pmax").placeholder = t("to");
  $("#cur [data-c=MDL]").textContent = curS("MDL");
  $("#aiMode").textContent = AI.mode==="local" ? t("aiLocal") : t("aiOn");
}
const counts = () => { const m={}; ADS.forEach(a=>{ m[a.cat]=(m[a.cat]||0)+1; m[a.cat+":"+a.sub]=(m[a.cat+":"+a.sub]||0)+1; }); return m; };
function renderCats(){
  const n = counts();
  $("#cats").innerHTML = CATS.map(c => `<a href="#" class="cat ${S.cat===c.id?"on":""}" data-cat="${c.id}">
    <span class="ic" style="background:${c.c}18;color:${c.c}"><i data-lucide="${c.ic}"></i></span>${c[S.lang]}<span class="n">${n[c.id]||0}</span></a>`).join("");
  const c = catOf(S.cat);
  $("#subbar").innerHTML = c ? `<button class="chip ${S.sub===null?"on":""}" data-sub="">${t("allIn")}<small>${n[c.id]||0}</small></button>` +
    c.subs.map((s,i)=>`<button class="chip ${S.sub===i?"on":""}" data-sub="${i}">${subName(c,i)}<small>${n[c.id+":"+i]||0}</small></button>`).join("") : "";
  renderAdv();
}
function renderAdv(){
  const c = catOf(S.cat), fs = fieldsFor(c,S.sub);
  let h = `<div class="hd"><i data-lucide="sliders-horizontal"></i>${t("adv")}</div>`;
  if (!c) h += `<div class="hint">${t("advHint")}</div>`;
  else {
    const seen = new Set();
    for (const f of fs){ if (seen.has(f.k)) continue; seen.add(f.k);
      const v = S.attrs[f.k];
      h += `<label class="f">${f[S.lang]}${f.u?`, ${f.u==="\""?"″":f.u}`:""}</label>`;
      if (f.t==="sel") h += `<select class="fld" data-af="${f.k}"><option value="">${t("any")}</option>${f.opts.map(o=>`<option value="${esc(optV(o))}" ${v==optV(o)?"selected":""}>${esc(Array.isArray(o)?o[L()]:o)}</option>`).join("")}</select>`;
      else h += `<div class="row2"><input class="fld" type="number" data-ar="${f.k}" data-e="min" placeholder="${t("from")}" value="${v?.min??""}"><input class="fld" type="number" data-ar="${f.k}" data-e="max" placeholder="${t("to")}" value="${v?.max??""}"></div>`;
    }
    if (S.sub===null && c.fields.some(f=>f.only)) h += `<div class="hint">${t("advHint2")}</div>`;
    if (!c.fields.length) h = h.replace(/$/, `<div class="hint">—</div>`);
  }
  $("#adv").innerHTML = h;
}
function cardHTML(a){
  const c = catOf(a.cat), sp = specLine(a);
  return `<article class="card${a.hl?" hl":""}" data-id="${a.id}">
    <div class="ph" ${cover(a)}>${a.imgs.length?"":`<i data-lucide="${icOf(a)}"></i>`}
      ${a.top?`<span class="top">${t("top")}</span>`:""}
      ${a.photos?`<span class="cnt"><i data-lucide="camera"></i>${a.photos}</span>`:""}
    </div>
    <button class="fav ${FAV.has(a.id)?"on":""}" data-fav="${a.id}" aria-label="fav"><i data-lucide="heart"></i></button>
    <div class="cb">${isDeal(a)?`<span class="deal" title="${t("dealTip")}"><i data-lucide="trending-down"></i>${t("deal")}</span>`:""}${fmtPrice(a)}<div class="ttl">${esc(a.title)}</div>
      ${sp?`<div class="spec">${esc(sp)}</div>`:""}<div class="desc">${esc(a.desc)}</div>
      ${a.delivery?`<div class="dl"><i data-lucide="truck"></i>${t("delivery")}</div>`:""}<div class="meta"><i data-lucide="map-pin"></i>${regName(a.reg)} · ${fmtDate(a.t)}</div></div>
  </article>`;
}
function render(){
  const r = query(S);
  const c = catOf(S.cat);
  $("#ttl").textContent = S.ids ? "✨ "+t("aiTitle") : S.favOnly ? t("favs") : c ? (S.sub!==null? subName(c,S.sub) : c[S.lang]) : (S.q ? `«${S.q}»` : t("newads"));
  $("#cnt").textContent = r.length;
  const g = $("#grid");
  g.className = "grid" + (S.view==="list"?" list":"") + (S.view==="map"?" mapv":"");
  g.innerHTML = S.view==="map" ? renderMap(r) : r.length ? r.slice(0,S.shown).map(cardHTML).join("") :
    `<div class="empty" style="grid-column:1/-1"><i data-lucide="search-x"></i><h3>${t("nores")}</h3><p>${t("nores2")}</p></div>`;
  $("#more").style.display = S.view!=="map" && r.length > S.shown ? "block" : "none";
  renderHomeStrips(); updateBadges();
  const cr = [];
  if (S.ids) cr.push(["ids","✨ "+t("aiTitle")]);
  if (S.favOnly) cr.push(["fav",t("favs")]);
  if (c) cr.push(["cat",c[S.lang]]);
  if (c && S.sub!==null) cr.push(["sub",subName(c,S.sub)]);
  if (S.q) cr.push(["q",`«${S.q}»`]);
  if (S.reg!=="all") cr.push(["reg",regName(S.reg)]);
  if (S.delivery) cr.push(["delivery",t("withDelivery")]);
  if (S.verified) cr.push(["verified",t("verifiedOnly")]);
  if (S.min!==""||S.max!=="") cr.push(["price",`${S.min||0} – ${S.max||"∞"} ${curS(S.cur)}`]);
  for (const [k,v] of Object.entries(S.attrs)){ const f=c?.fields.find(f=>f.k===k); if(!f) continue;
    cr.push(["a:"+k, f[S.lang]+": "+(typeof v==="object" ? `${v.min??""}–${v.max??""}` : fmtAttr(f,v))]); }
  $("#crumbs").innerHTML = cr.map(([k,v])=>`<button class="chip on" data-x="${k}">${esc(v)} <i data-lucide="x"></i></button>`).join("");
  const n = FAV.size; ["#favN","#favN2"].forEach(x=>{$(x).hidden=!n;$(x).textContent=n;});
  $("#asideApply").textContent = t("showN")+" ("+r.length+")";
  $$(".bnav button").forEach(b=>b.classList.toggle("on", b.dataset.nav===(S.favOnly?"fav":"home")));
  $$(".vt button").forEach(b=>b.classList.toggle("on",b.dataset.v===S.view));
  icons();
}
const full = () => { renderStatic(); renderCats(); render(); };

/* =================== MODALS =================== */
function openModal(html, w=860){ $("#md").style.maxWidth = w+"px"; $("#md").innerHTML = `<button class="x" id="mx"><i data-lucide="x"></i></button>`+html; $("#ov").classList.add("show"); document.body.style.overflow="hidden"; icons(); }
function closeModal(){ $("#ov").classList.remove("show"); if(!$("#drawer").classList.contains("open")) document.body.style.overflow=""; }
function toast(msg){ const el=$("#toast"); el.querySelector("span").textContent=msg; el.classList.add("show"); clearTimeout(toast.h); toast.h=setTimeout(()=>el.classList.remove("show"),2200); }

/* openAd — в features.js */
function openLogin(){
  openModal(`<div class="form"><h2>${t("lTitle")}</h2><p style="color:var(--ink2)">${t("lText")}</p>
    <input class="fld" style="height:46px" value="+373 " inputmode="tel">
    <button class="btn p" id="lb">${t("lBtn")}</button><p style="color:var(--mute);font-size:13px">${t("lNote")}</p></div>`, 520);
  $("#lb").onclick = () => toast(t("lNote"));
}
function openMega(){
  const n = counts();
  openModal(`<div class="mega"><h2>${t("allcats")}</h2><div class="mg">${CATS.map(c=>`<div>
    <div class="h" data-mc="${c.id}"><span class="ic" style="background:${c.c}18;color:${c.c}"><i data-lucide="${c.ic}"></i></span>${c[S.lang]}</div>
    <ul>${c.subs.map((s,i)=>`<li data-mc="${c.id}" data-ms="${i}">${subName(c,i)} <small>${n[c.id+":"+i]||0}</small></li>`).join("")}</ul></div>`).join("")}</div></div>`, 1000);
}

let draftImgs = [];
function openPost(){
  draftImgs = [];
  openModal(`<form class="form" id="pf" novalidate><h2>${t("pTitle")}</h2>
    <label>${t("pName")}<input class="fld" name="title" maxlength="80"></label>
    <div class="g2"><label>${t("pCat")}<select class="fld" name="cat">${CATS.map(c=>`<option value="${c.id}" ${S.cat===c.id?"selected":""}>${c[S.lang]}</option>`).join("")}</select></label>
      <label>${t("pSub")}<select class="fld" name="sub"></select></label></div>
    <div id="pattrs" class="g2"></div>
    <label class="drop" id="drop"><i data-lucide="image-plus"></i><div>${t("pPhotos")}</div><input type="file" accept="image/*" multiple hidden id="files"></label>
    <div class="thumbs" id="thumbs"></div>
    <label>${t("pDesc")}<textarea name="desc" maxlength="2000"></textarea></label>
    <div class="g2"><label>${t("pPrice")}<input class="fld" name="price" type="number" min="0" placeholder="0"></label>
      <label>${t("pCur")}<select class="fld" name="cur"><option value="MDL">${curS("MDL")} (MDL)</option><option value="EUR">€ (EUR)</option></select></label></div>
    <div class="g2"><label>${t("pReg")}<select class="fld" name="reg">${REG.slice(1).map(r=>`<option value="${r[0]}">${r[L()]}</option>`).join("")}</select></label>
      <label>${t("pPhone")}<input class="fld" name="phone" value="+373 " inputmode="tel"></label></div>
    <label class="chk" style="display:flex;font-weight:600"><input type="checkbox" name="isnew"> ${t("new")}</label>
    <label class="chk" style="display:flex;font-weight:600"><input type="checkbox" name="dlv"> ${t("pDelivery")}</label>
    <div><div class="lbl">${t("promo_t")}</div><div class="opts promo">${t("promoOpts").map(([v,n,d],i)=>`<label class="opt"><input type="radio" name="promo" value="${v}" ${i?"":"checked"}><span><b>${n}</b><small>${d}</small></span></label>`).join("")}</div><p class="ssub">${t("promoNote")}</p></div>
    <div class="err" id="perr"></div>
    <button class="btn l">${t("pSend")}</button></form>`, 760);
  const f = $("#pf");
  const fillAttrs = () => { const c = catOf(f.cat.value), seen=new Set();
    $("#pattrs").innerHTML = fieldsFor(c,+f.sub.value).filter(x=>!seen.has(x.k)&&seen.add(x.k)).map(x=>`<label>${x[S.lang]}${x.u?", "+x.u:""}${x.t==="sel"
      ? `<select class="fld" data-pa="${x.k}"><option value="">—</option>${x.opts.map(o=>`<option value="${esc(optV(o))}">${esc(Array.isArray(o)?o[L()]:o)}</option>`).join("")}</select>`
      : `<input class="fld" type="number" data-pa="${x.k}" data-num>`}</label>`).join(""); };
  const fillSubs = () => { const c = catOf(f.cat.value); f.sub.innerHTML = c.subs.map((s,i)=>`<option value="${i}" ${S.cat===c.id&&S.sub===i?"selected":""}>${subName(c,i)}</option>`).join(""); fillAttrs(); };
  fillSubs(); f.cat.onchange = fillSubs; f.sub.onchange = fillAttrs;
  const addFiles = files => {
    [...files].filter(x=>x.type.startsWith("image/")).slice(0,10-draftImgs.length).forEach(file => {
      const rd = new FileReader();
      rd.onload = () => { const img = new Image(); img.onload = () => {
        const k = Math.min(1, 900/Math.max(img.width,img.height)), cv = document.createElement("canvas");
        cv.width = img.width*k; cv.height = img.height*k; cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
        draftImgs.push(cv.toDataURL("image/jpeg",.8));
        $("#thumbs").innerHTML = draftImgs.map(s=>`<img src="${s}">`).join("");
      }; img.src = rd.result; };
      rd.readAsDataURL(file);
    });
  };
  $("#files").onchange = e => addFiles(e.target.files);
  const d = $("#drop");
  d.ondragover = e => { e.preventDefault(); d.style.borderColor="var(--brand)"; };
  d.ondragleave = () => d.style.borderColor="";
  d.ondrop = e => { e.preventDefault(); d.style.borderColor=""; addFiles(e.dataTransfer.files); };
  f.onsubmit = e => {
    e.preventDefault();
    const title = f.title.value.trim(), phone = f.phone.value.trim();
    if (title.length<5) return $("#perr").textContent = t("eTitle");
    if (phone.replace(/\D/g,"").length<8) return $("#perr").textContent = t("ePhone");
    const attrs = {}; $$("[data-pa]").forEach(el => { if (el.value!=="") attrs[el.dataset.pa] = el.hasAttribute("data-num") ? +el.value : el.value; });
    const pr = f.promo.value;
    const a = {id:nextMyId(),mine:true,seller:0,delivery:f.dlv.checked,top:pr==="top"||pr==="turbo",hl:pr==="hl"||pr==="turbo",cat:f.cat.value,sub:+f.sub.value,title,cur:f.cur.value,price:Math.max(0,+f.price.value||0),val:0,reg:f.reg.value,
      cond:f.isnew.checked?"new":"used",priv:true,photos:draftImgs.length,t:Date.now(),views:0,desc:f.desc.value.trim()||"—",
      name:S.lang==="ru"?"Вы":"Tu",phone,imgs:draftImgs.slice(),attrs};
    ADS.unshift(a); saveMy();
    closeModal(); resetState(); full(); toast(t("posted_ok")); setTimeout(()=>openAd(a.id),300);
  };
}

