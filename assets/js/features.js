/* Gata.md — функции маркетплейса:
   продавцы и отзывы, мессенджер, доставка с безопасной оплатой, личный кабинет,
   сохранённые поиски, продвижение, поиск на карте, «вы смотрели», рекомендации, похожие, поделиться/пожаловаться.
   В демо-версии данные хранятся в браузере (localStorage); на сервере их заменит API. */

/* ---------- хранилище ---------- */
const store = {
  get(k, d){ try { const v = localStorage.getItem("gata_"+k); return v==null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem("gata_"+k, JSON.stringify(v)); return true; } catch(e){ return false; } }
};
let VIEWED = store.get("viewed", []);         // id объявлений
let SAVED  = store.get("saved", []);          // сохранённые поиски
let CHATS  = store.get("chats", {});          // { adId: {adId, msgs:[{me,text,t}], unread} }
let ORDERS = store.get("orders", []);         // заказы с доставкой
let MYADS  = store.get("myads", []);          // объявления пользователя
MYADS.forEach(a => { if (!ADS.some(x=>x.id===a.id)) ADS.unshift(a); });
const nextMyId = () => Math.max(900000, ...ADS.map(a=>a.id)) + 1;
const saveMy = () => { const mine = ADS.filter(a=>a.mine);
  if (!store.set("myads", mine)) store.set("myads", mine.map(a=>({...a, imgs:a.imgs.slice(0,1)}))); };

/* ---------- переводы новых функций ---------- */
Object.assign(T.ru, {
  msgs:"Сообщения", cabinet:"Кабинет", nMsgs:"Чаты", nProfile:"Профиль", delivery:"Доставка", withDelivery:"С доставкой", verifiedOnly:"Проверенные продавцы",
  verified:"Документы проверены", reply_min:"Отвечает за несколько минут", reply_hour:"Отвечает в течение часа", reply_day:"Отвечает в течение дня",
  reviewsN:"отзывов", noReviews:"Пока нет отзывов", sinceY:"На Gata с", soldN:"продаж", allAds:"Все объявления продавца", reviews:"Отзывы", ads2:"Объявления",
  buyDelivery:"Купить с доставкой", deliveryInfo:"Доставка по Молдове от 49 лей · Безопасная оплата", writeSeller:"Написать продавцу",
  share:"Поделиться", report:"Пожаловаться", linkCopied:"Ссылка скопирована", similar:"Похожие объявления", sellerOther:"Другие объявления продавца",
  quick:["Ещё продаётся?","Торг уместен?","Когда можно посмотреть?","Отправите доставкой?"], chatPh:"Сообщение…", noChats:"Здесь появятся ваши переписки с продавцами. Нажмите «Написать продавцу» в любом объявлении.",
  online:"был(а) недавно", typing:"печатает…",
  rep_title:"Пожаловаться на объявление", rep_r:["Товар продан","Неверная цена","Мошенничество","Запрещённый товар","Неверная категория","Другое"], rep_send:"Отправить жалобу", rep_ok:"Спасибо! Модератор проверит объявление.",
  co_title:"Оформление доставки", co_method:"Способ получения", co_pick:"Пункт выдачи", co_pickD:"2–4 дня · 49 лей", co_cour:"Курьер до двери", co_courD:"1–3 дня · 89 лей",
  co_city:"Город", co_addr:"Адрес или пункт выдачи", co_name:"Имя получателя", co_phone:"Телефон", co_item:"Товар", co_ship:"Доставка", co_fee:"Сервисный сбор", co_total:"Итого",
  co_safe:"Безопасная сделка: деньги придут продавцу только после того, как вы получите и проверите товар. Не понравилось — вернём деньги.",
  co_btn:"Оформить заказ", co_demo:"Демо-версия: оплата не списывается — здесь подключается платёжная система.", co_ok:"Заказ оформлен!", co_err:"Заполните адрес, имя и телефон",
  st:["Оформлен","Продавец отправил","В пункте выдачи","Получен"], orderN:"Заказ №",
  cab_guest:"Гость", cab_login:"Войти или зарегистрироваться", cab_my:"Мои объявления", cab_orders:"Заказы", cab_saved:"Сохранённые поиски", cab_viewed:"Просмотренные",
  cab_noMy:"У вас пока нет объявлений.", cab_noOrders:"Заказов пока нет. Ищите значок «Доставка» в объявлениях.", cab_noSaved:"Нет сохранённых поисков. Настройте фильтры и нажмите «Сохранить поиск».", cab_noViewed:"Вы ещё ничего не смотрели.",
  raise:"Поднять", remove:"Снять", open:"Открыть", del:"Удалить", raised:"Объявление поднято в начало списка", removed:"Объявление снято с публикации", viewsN:"просмотров",
  saveSearch:"Сохранить поиск", searchSaved:"Поиск сохранён — новые объявления будут в кабинете", nowFound:"сейчас найдено", newN:"новых",
  promo_t:"Продвижение", promo:[["none","Обычное","Бесплатно"],["hl","Выделить цветом","29 лей · 7 дней"],["top","В ТОП","59 лей · 3 дня"],["turbo","Турбо: ТОП + выделение","99 лей · до 10× просмотров"]], promoNote:"Демо: оплата продвижения подключается позже.",
  pDelivery:"Готов отправить доставкой (Gata Доставка)",
  viewedT:"Вы недавно смотрели", recoT:"Рекомендации для вас", mapT:"Объявления на карте", mapHint:"Нажмите на город, чтобы показать его объявления", map:"Карта"
});
Object.assign(T.ro, {
  msgs:"Mesaje", cabinet:"Cabinet", nMsgs:"Chaturi", nProfile:"Profil", delivery:"Livrare", withDelivery:"Cu livrare", verifiedOnly:"Vânzători verificați",
  verified:"Documente verificate", reply_min:"Răspunde în câteva minute", reply_hour:"Răspunde într-o oră", reply_day:"Răspunde în aceeași zi",
  reviewsN:"recenzii", noReviews:"Încă nu are recenzii", sinceY:"Pe Gata din", soldN:"vânzări", allAds:"Toate anunțurile vânzătorului", reviews:"Recenzii", ads2:"Anunțuri",
  buyDelivery:"Cumpără cu livrare", deliveryInfo:"Livrare în toată Moldova de la 49 lei · Plată sigură", writeSeller:"Scrie vânzătorului",
  share:"Distribuie", report:"Raportează", linkCopied:"Link copiat", similar:"Anunțuri similare", sellerOther:"Alte anunțuri ale vânzătorului",
  quick:["Mai este disponibil?","Prețul e negociabil?","Când pot să-l văd?","Trimiteți cu livrare?"], chatPh:"Mesaj…", noChats:"Aici vor apărea conversațiile cu vânzătorii. Apasă „Scrie vânzătorului” în orice anunț.",
  online:"activ recent", typing:"scrie…",
  rep_title:"Raportează anunțul", rep_r:["Produs vândut","Preț greșit","Fraudă","Produs interzis","Categorie greșită","Altceva"], rep_send:"Trimite", rep_ok:"Mulțumim! Moderatorul va verifica anunțul.",
  co_title:"Comandă cu livrare", co_method:"Metoda de primire", co_pick:"Punct de ridicare", co_pickD:"2–4 zile · 49 lei", co_cour:"Curier la ușă", co_courD:"1–3 zile · 89 lei",
  co_city:"Oraș", co_addr:"Adresa sau punctul de ridicare", co_name:"Numele destinatarului", co_phone:"Telefon", co_item:"Produs", co_ship:"Livrare", co_fee:"Taxa de serviciu", co_total:"Total",
  co_safe:"Tranzacție sigură: banii ajung la vânzător doar după ce primești și verifici produsul. Nu-ți place — îți returnăm banii.",
  co_btn:"Plasează comanda", co_demo:"Versiune demo: plata nu se retrage — aici se conectează sistemul de plăți.", co_ok:"Comanda a fost plasată!", co_err:"Completează adresa, numele și telefonul",
  st:["Plasată","Vânzătorul a expediat","În punctul de ridicare","Primită"], orderN:"Comanda nr.",
  cab_guest:"Oaspete", cab_login:"Intră sau înregistrează-te", cab_my:"Anunțurile mele", cab_orders:"Comenzi", cab_saved:"Căutări salvate", cab_viewed:"Vizualizate",
  cab_noMy:"Încă nu ai anunțuri.", cab_noOrders:"Încă nu ai comenzi. Caută insigna „Livrare” în anunțuri.", cab_noSaved:"Nu ai căutări salvate. Setează filtrele și apasă „Salvează căutarea”.", cab_noViewed:"Încă nu ai vizualizat nimic.",
  raise:"Ridică", remove:"Retrage", open:"Deschide", del:"Șterge", raised:"Anunțul a fost ridicat în top", removed:"Anunțul a fost retras", viewsN:"vizualizări",
  saveSearch:"Salvează căutarea", searchSaved:"Căutare salvată — anunțurile noi vor fi în cabinet", nowFound:"găsite acum", newN:"noi",
  promo_t:"Promovare", promo:[["none","Obișnuit","Gratuit"],["hl","Evidențiere color","29 lei · 7 zile"],["top","În TOP","59 lei · 3 zile"],["turbo","Turbo: TOP + evidențiere","99 lei · până la 10× vizualizări"]], promoNote:"Demo: plata promovării se conectează mai târziu.",
  pDelivery:"Pot trimite prin livrare (Gata Livrare)",
  viewedT:"Ai văzut recent", recoT:"Recomandări pentru tine", mapT:"Anunțuri pe hartă", mapHint:"Apasă pe un oraș pentru a vedea anunțurile lui", map:"Hartă"
});

/* ---------- мелкие помощники ---------- */
const stars = (r, size=14) => { let h=""; for (let i=1;i<=5;i++){ const f = r>=i-.25 ? 1 : r>=i-.75 ? .5 : 0;
  h += `<span class="star" style="--f:${f*100}%;width:${size}px;height:${size}px"></span>`; } return `<span class="stars">${h}</span>`; };
const ago = days => days<1 ? t("today") : days<30 ? `${days} ${t("ago")}` : S.lang==="ru" ? `${Math.floor(days/30)} мес. назад` : `acum ${Math.floor(days/30)} luni`;
const unreadCount = () => Object.values(CHATS).reduce((n,c)=>n+(c.unread||0),0);
function updateBadges(){
  const u = unreadCount();
  ["#msgN","#msgN2"].forEach(x=>{ const el=$(x); if(el){ el.hidden=!u; el.textContent=u; } });
}
const rowHTML = list => `<div class="hrow">${list.map(cardHTML).join("")}</div>`;
const isHome = () => !S.cat && !S.q && !S.ids && !S.favOnly && S.reg==="all" && S.min==="" && S.max==="" && !Object.keys(S.attrs).length && !S.photo && !S.priv && !S.deal && !S.delivery && !S.verified && S.cond==="all";

/* ---------- главная: «вы смотрели» и рекомендации ---------- */
function renderHomeStrips(){
  const box = $("#strips"); if (!box) return;
  if (!isHome() || S.view==="map"){ box.innerHTML=""; return; }
  const viewed = VIEWED.map(id=>ADS.find(a=>a.id===id)).filter(Boolean).slice(0,12);
  const cats = {}; viewed.forEach(a=>cats[a.cat+":"+a.sub]=(cats[a.cat+":"+a.sub]||0)+1);
  [...FAV].forEach(id=>{ const a=ADS.find(x=>x.id===id); if(a) cats[a.cat+":"+a.sub]=(cats[a.cat+":"+a.sub]||0)+2; });
  let reco = [];
  const keys = Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
  if (keys.length) reco = ADS.filter(a=>keys.includes(a.cat+":"+a.sub) && !VIEWED.includes(a.id) && a.price>0)
    .sort((a,b)=>(isDeal(b)-isDeal(a)) || (b.val&&b.price? b.val/b.price:0)-(a.val&&a.price? a.val/a.price:0)).slice(0,12);
  else reco = ADS.filter(a=>isDeal(a)).sort((a,b)=>b.t-a.t).slice(0,12);
  let h = "";
  if (reco.length) h += `<div class="strip"><h3><i data-lucide="sparkles"></i>${t("recoT")}</h3>${rowHTML(reco)}</div>`;
  if (viewed.length) h += `<div class="strip"><h3><i data-lucide="history"></i>${t("viewedT")}</h3>${rowHTML(viewed)}</div>`;
  box.innerHTML = h;
}

/* ---------- поиск на карте ---------- */
const CITY_GEO = {chi:[28.86,47.01],bal:[27.93,47.76],cah:[28.19,45.90],com:[28.66,46.30],ung:[27.80,47.21],orh:[28.82,47.38],sor:[28.30,48.16],edi:[27.30,48.17],hin:[28.59,46.83],str:[28.61,47.14],tir:[29.63,46.84]};
const MD_SHAPE = [[26.62,48.26],[27.25,48.38],[27.58,48.47],[28.1,48.24],[28.5,48.17],[28.95,47.95],[29.2,47.98],[29.25,47.75],[29.55,47.4],[29.6,47.2],[29.95,46.95],[30.13,46.6],[30.1,46.42],[29.65,46.45],[29.3,46.47],[29.0,46.5],[28.95,46.1],[28.6,45.72],[28.2,45.47],[28.15,45.62],[28.1,46.0],[28.0,46.5],[28.0,46.85],[27.8,47.2],[27.4,47.6],[27.0,48.0],[26.62,48.26]];
const proj = ([lon,lat]) => [ (lon-26.4)*68*0.68*1.0 + 20, (48.65-lat)*68 + 14 ];
function renderMap(list){
  const by = {}; list.forEach(a=>by[a.reg]=(by[a.reg]||0)+1);
  const max = Math.max(1,...Object.values(by));
  const path = MD_SHAPE.map((p,i)=>(i?"L":"M")+proj(p).map(n=>n.toFixed(1)).join(",")).join("")+"Z";
  const pins = Object.entries(CITY_GEO).map(([id,g])=>{ const [x,y]=proj(g), n=by[id]||0, r = n? 6+Math.sqrt(n/max)*10 : 3.5;
    return `<g class="pin ${n?"":"zero"} ${S.reg===id?"on":""}" data-city="${id}" tabindex="0"><circle cx="${x}" cy="${y}" r="${r}"/>${n?`<text x="${x}" y="${y+3}">${n}</text>`:""}
      <text class="nm" x="${x}" y="${y-r-3}">${esc(regName(id))}</text></g>`; }).join("");
  const side = Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([id,n])=>`<button class="city ${S.reg===id?"on":""}" data-city="${id}"><span>${esc(regName(id))}</span><b>${n}</b></button>`).join("");
  return `<div class="mapbox"><div class="mapsvg"><svg viewBox="0 0 230 240" role="img" aria-label="${t("mapT")}"><path class="land" d="${path}"/>${pins}</svg></div>
    <div class="mapside"><h3>${t("mapT")}</h3><p>${t("mapHint")}</p>${side||`<p>${t("nores")}</p>`}</div></div>`;
}

/* ---------- карточка объявления (полная) ---------- */
function similarTo(a, n=8){
  const p = mdl(a)||1;
  return ADS.filter(x=>x.id!==a.id && x.cat===a.cat && x.sub===a.sub)
    .sort((x,y)=>Math.abs(Math.log((mdl(x)||1)/p))-Math.abs(Math.log((mdl(y)||1)/p))).slice(0,n);
}
function openAd(id){
  const a = ADS.find(x=>x.id===id); if(!a) return; a.views++;
  VIEWED = [id, ...VIEWED.filter(x=>x!==id)].slice(0,30); store.set("viewed", VIEWED);
  const c = catOf(a.cat), s = sellerOf(a);
  const attrs = fieldsFor(c,a.sub).filter((f,i,arr)=>a.attrs[f.k]!=null && arr.findIndex(g=>g.k===f.k)===i).map(f=>`<dt>${f[S.lang]}</dt><dd>${esc(fmtAttr(f,a.attrs[f.k]))}</dd>`).join("");
  const sim = similarTo(a), other = ADS.filter(x=>x.seller===a.seller && x.id!==a.id).slice(0,8);
  openModal(`<div class="det">
    <div style="display:flex;flex-direction:column"><div class="ph" id="bigph" ${cover(a)} style="flex:1">${a.imgs.length?"":`<i data-lucide="${icOf(a)}"></i>`}</div>
      ${a.imgs.length>1?`<div class="gal">${a.imgs.map(x=>`<img src="${x}" data-big alt="">`).join("")}</div>`:""}</div>
    <div class="di">
      <div class="badges">${isDeal(a)?`<span class="deal"><i data-lucide="trending-down"></i>${t("deal")}</span>`:""}${a.delivery?`<span class="dlv"><i data-lucide="truck"></i>${t("delivery")}</span>`:""}</div>
      ${fmtPrice(a)}
      ${a.val>0&&a.price>0?`<div class="mkt">${t("market")}: ~${fmtN(a.val)} ${curS(a.cur)}</div>`:""}
      <h2>${esc(a.title)}</h2>
      <p class="fulldesc">${esc(a.desc)}</p>
      <dl class="kv">
        <dt>${t("category")}</dt><dd>${c[S.lang]} · ${subName(c,a.sub)}</dd>${attrs}
        <dt>${t("condition")}</dt><dd>${t(a.cond)}</dd>
        <dt>${t("location")}</dt><dd>${regName(a.reg)}</dd>
        <dt>${t("posted")}</dt><dd>${fmtDate(a.t)} · ${a.views} ${t("views")}</dd>
        <dt>${t("id")}</dt><dd>${100000+a.id}</dd>
      </dl>
      <button class="seller sbtn" data-seller="${s.id}"><span class="ava">${esc(s.name[0])}</span><span style="min-width:0;text-align:left">
        <b>${esc(s.name)}</b>${s.verified?` <span class="vf" title="${t("verified")}"><i data-lucide="badge-check"></i></span>`:""}
        <span class="srow">${s.reviews?`${stars(s.rating)} <b>${s.rating.toFixed(1)}</b> · ${s.reviews} ${t("reviewsN")}`:t("noReviews")}</span>
        <span class="ssub">${s.type==="company"?t("bizS"):t("privS")} · ${t("reply_"+s.reply)}</span></span><i data-lucide="chevron-right"></i></button>
      ${a.delivery && !a.mine ? `<button class="btn l" id="buyBtn"><i data-lucide="truck"></i>${t("buyDelivery")}</button><div class="dinfo"><i data-lucide="shield-check"></i>${t("deliveryInfo")}</div>`:""}
      <div class="g2b"><button class="btn p" id="phoneBtn"><i data-lucide="phone"></i><span>${t("showphone")}</span></button>
      <button class="btn ${a.delivery?"g":"l"}" id="writeBtn"><i data-lucide="message-circle"></i>${t("writeSeller")}</button></div>
      <div class="acts"><button data-fav="${a.id}" class="${FAV.has(a.id)?"on":""}"><i data-lucide="heart"></i>${t("favs")}</button>
        <button id="shareBtn"><i data-lucide="share-2"></i>${t("share")}</button><button id="repBtn"><i data-lucide="flag"></i>${t("report")}</button></div>
    </div></div>
    ${other.length?`<div class="strip in"><h3>${t("sellerOther")}</h3>${rowHTML(other)}</div>`:""}
    ${sim.length?`<div class="strip in"><h3>${t("similar")}</h3>${rowHTML(sim)}</div>`:""}`);
  $("#phoneBtn").onclick = e => { const sp = e.currentTarget.querySelector("span");
    if (sp.textContent === a.phone){ try{ navigator.clipboard.writeText(a.phone).then(()=>toast(t("copied")),()=>{}); }catch(_){} } else sp.textContent = a.phone; };
  $("#writeBtn").onclick = () => openChats(a.id);
  if ($("#buyBtn")) $("#buyBtn").onclick = () => openCheckout(a.id);
  $("#shareBtn").onclick = () => { const url = location.href.split("#")[0]+"#ad-"+a.id;
    try { navigator.clipboard.writeText(url).then(()=>toast(t("linkCopied")),()=>toast(url)); } catch(_){ toast(url); } };
  $("#repBtn").onclick = () => openReport(a.id);
  $$("[data-big]").forEach(im => im.onclick = () => $("#bigph").style.backgroundImage = `url(${im.src})`);
  renderHomeStrips(); icons();
}

/* ---------- продавец ---------- */
function openSeller(id, tab="ads"){
  const s = SELLERS.find(x=>x.id===id) || sellerOf({seller:id,name:"—"});
  const ads = ADS.filter(a=>a.seller===id), rv = reviewsOf(s);
  const dist = [5,4,3,2,1].map(k=>[k, rv.filter(r=>r.stars===k).length]);
  openModal(`<div class="sp">
    <div class="sphead"><span class="ava big">${esc(s.name[0])}</span><div>
      <h2>${esc(s.name)} ${s.verified?`<span class="vf"><i data-lucide="badge-check"></i></span>`:""}</h2>
      <div class="srow">${s.reviews?`${stars(s.rating,18)} <b>${s.rating.toFixed(1)}</b> · ${s.reviews} ${t("reviewsN")}`:t("noReviews")}</div>
      <div class="ssub">${s.type==="company"?t("bizS"):t("privS")} · ${t("sinceY")} ${s.since} · ${s.sold} ${t("soldN")} · ${t("reply_"+s.reply)}</div>
      ${s.verified?`<div class="vtag"><i data-lucide="shield-check"></i>${t("verified")}</div>`:""}</div></div>
    <div class="tabs"><button class="${tab==="ads"?"on":""}" data-stab="ads">${t("ads2")} <small>${ads.length}</small></button><button class="${tab==="rev"?"on":""}" data-stab="rev">${t("reviews")} <small>${s.reviews}</small></button></div>
    <div id="stabBody">${tab==="ads" ? `<div class="grid">${ads.map(cardHTML).join("")}</div>` :
      rv.length ? `<div class="rvsum"><div class="big">${s.rating.toFixed(1)}</div><div>${stars(s.rating,20)}<div class="ssub">${s.reviews} ${t("reviewsN")}</div></div>
        <div class="bars">${dist.map(([k,n])=>`<div><span>${k}</span><i style="--w:${rv.length? n/rv.length*100:0}%"></i></div>`).join("")}</div></div>
        ${rv.map(r=>`<div class="rv"><div class="rvh"><span class="ava sm">${esc(r.name[0])}</span><b>${esc(r.name)}</b>${stars(r.stars,12)}<span class="ssub">${ago(r.days)}</span></div><p>${esc(r.text)}</p><div class="ssub">${esc(r.item)}</div></div>`).join("")}`
      : `<div class="empty">${t("noReviews")}</div>`}</div></div>`, 980);
  $$("[data-stab]").forEach(b=>b.onclick=()=>openSeller(id, b.dataset.stab));
}

/* ---------- мессенджер ---------- */
let CUR_CHAT = null;
const saveChats = () => store.set("chats", CHATS);
function botReply(text){
  const s = text.toLowerCase(), ru = S.lang==="ru";
  if (/продаёт|продает|актуал|disponibil|în vânzare/.test(s)) return ru?"Здравствуйте! Да, ещё продаётся 👍":"Bună ziua! Da, este încă disponibil 👍";
  if (/торг|скидк|дешевле|negocia|reducere/.test(s)) return ru?"Небольшой торг возможен при осмотре.":"Un mic discount este posibil la vizionare.";
  if (/посмотр|встрет|когда|văd|întâlni|când/.test(s)) return ru?"Можно сегодня после 18:00 или завтра днём. Вам удобно?":"Se poate azi după ora 18:00 sau mâine ziua. Vă convine?";
  if (/доставк|отправ|livrare|trimite/.test(s)) return ru?"Да, могу отправить через Gata Доставку — оформляйте прямо в объявлении.":"Da, pot trimite prin Gata Livrare — plasați comanda direct din anunț.";
  return ru?"Здравствуйте! Всё в силе. Пишите, если есть вопросы, или звоните.":"Bună ziua! Totul e valabil. Scrieți dacă aveți întrebări sau sunați.";
}
function chatSend(adId, text){
  text = text.trim(); if (!text) return;
  const c = CHATS[adId] ||= {adId, msgs:[], unread:0};
  c.msgs.push({me:true, text, t:Date.now()}); saveChats(); drawChat();
  setTimeout(()=>{ const ty=$("#typing"); if(ty && CUR_CHAT===adId) ty.hidden=false; }, 500);
  setTimeout(()=>{ c.msgs.push({me:false, text:botReply(text), t:Date.now()});
    if (CUR_CHAT===adId && $("#ov").classList.contains("show") && $("#chatBox")) c.unread=0; else c.unread=(c.unread||0)+1;
    saveChats(); updateBadges(); if ($("#chatBox")) { drawList(); drawChat(); } }, 1600);
}
function drawList(){
  const list = Object.values(CHATS).filter(c=>ADS.some(a=>a.id===c.adId)).sort((a,b)=>(b.msgs.at(-1)?.t||0)-(a.msgs.at(-1)?.t||0));
  $("#chatList").innerHTML = list.length ? list.map(c=>{ const a=ADS.find(x=>x.id===c.adId), s=sellerOf(a), last=c.msgs.at(-1);
    return `<button class="ci ${CUR_CHAT===c.adId?"on":""}" data-chat="${c.adId}"><span class="th" ${cover(a)}>${a.imgs.length?"":`<i data-lucide="${icOf(a)}"></i>`}</span>
      <span class="cim"><b>${esc(s.name)}</b><span class="ct">${esc(a.title)}</span><span class="cl">${last?esc((last.me?(S.lang==="ru"?"Вы: ":"Tu: "):"")+last.text):""}</span></span>
      ${c.unread?`<span class="badge">${c.unread}</span>`:""}</button>`; }).join("") : `<div class="cempty"><i data-lucide="message-circle"></i><p>${t("noChats")}</p></div>`;
  icons();
}
function drawChat(){
  const pane = $("#chatPane"); if (!pane) return;
  if (!CUR_CHAT){ pane.innerHTML = `<div class="cempty"><i data-lucide="messages-square"></i><p>${t("noChats")}</p></div>`; $("#chatBox").classList.remove("conv"); icons(); return; }
  const a = ADS.find(x=>x.id===CUR_CHAT), s = sellerOf(a), c = CHATS[CUR_CHAT] || {msgs:[]};
  pane.innerHTML = `<div class="chd"><button class="back" id="chatBack"><i data-lucide="arrow-left"></i></button><span class="ava sm">${esc(s.name[0])}</span>
      <div style="min-width:0"><b>${esc(s.name)}</b><div class="ssub">${s.reviews?`★ ${s.rating.toFixed(1)} · `:""}${t("online")}</div></div></div>
    <button class="cad" data-open="${a.id}"><span class="th" ${cover(a)}>${a.imgs.length?"":`<i data-lucide="${icOf(a)}"></i>`}</span><span><b>${a.price?fmtN(a.price)+" "+curS(a.cur):t("free")}</b><span class="ct">${esc(a.title)}</span></span></button>
    <div class="cmsgs" id="cmsgs">${c.msgs.map(m=>`<div class="cm ${m.me?"me":""}"><span>${esc(m.text)}</span><small>${new Date(m.t).toTimeString().slice(0,5)}</small></div>`).join("")}
      <div class="cm typing" id="typing" hidden><span>${t("typing")}</span></div></div>
    <div class="qr">${t("quick").map(q=>`<button data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>
    <form class="cin" id="cin"><input id="cinput" autocomplete="off" placeholder="${t("chatPh")}"><button><i data-lucide="send"></i></button></form>`;
  $("#chatBox").classList.add("conv");
  const box = $("#cmsgs"); box.scrollTop = 1e9;
  $("#cin").onsubmit = e => { e.preventDefault(); const v=$("#cinput").value; $("#cinput").value=""; chatSend(CUR_CHAT, v); };
  $$("[data-q]").forEach(b=>b.onclick=()=>chatSend(CUR_CHAT, b.dataset.q));
  $("#chatBack").onclick = () => { CUR_CHAT=null; drawList(); drawChat(); };
  icons();
}
function openChats(adId){
  if (adId){ CHATS[adId] ||= {adId, msgs:[], unread:0}; CUR_CHAT = adId; }
  if (CUR_CHAT && CHATS[CUR_CHAT]) CHATS[CUR_CHAT].unread = 0;
  saveChats(); updateBadges();
  openModal(`<div class="chat" id="chatBox"><div class="clist"><h2>${t("msgs")}</h2><div id="chatList"></div></div><div class="cpane" id="chatPane"></div></div>`, 1000);
  drawList(); drawChat();
  $("#chatList").onclick = e => { const b=e.target.closest("[data-chat]"); if(!b) return; CUR_CHAT=+b.dataset.chat; CHATS[CUR_CHAT].unread=0; saveChats(); updateBadges(); drawList(); drawChat(); };
  if (adId) setTimeout(()=>$("#cinput")?.focus(), 200);
}

/* ---------- доставка и безопасная сделка ---------- */
function openCheckout(adId){
  const a = ADS.find(x=>x.id===adId); if(!a) return;
  const item = Math.round(mdl(a)), fee = Math.min(150, Math.max(15, Math.round(item*0.02)));
  openModal(`<form class="form" id="co" novalidate><h2>${t("co_title")}</h2>
    <div class="coitem"><span class="th" ${cover(a)}>${a.imgs.length?"":`<i data-lucide="${icOf(a)}"></i>`}</span><div><b>${esc(a.title)}</b><div class="ssub">${esc(sellerOf(a).name)} · ${regName(a.reg)}</div></div></div>
    <div><div class="lbl">${t("co_method")}</div><div class="opts">
      <label class="opt"><input type="radio" name="m" value="pick" checked><span><b>${t("co_pick")}</b><small>${t("co_pickD")}</small></span></label>
      <label class="opt"><input type="radio" name="m" value="cour"><span><b>${t("co_cour")}</b><small>${t("co_courD")}</small></span></label></div></div>
    <div class="g2"><label>${t("co_city")}<select class="fld" name="city">${REG.slice(1).map(r=>`<option value="${r[0]}">${r[L()]}</option>`).join("")}</select></label>
      <label>${t("co_addr")}<input class="fld" name="addr"></label></div>
    <div class="g2"><label>${t("co_name")}<input class="fld" name="nm"></label><label>${t("co_phone")}<input class="fld" name="ph" value="+373 " inputmode="tel"></label></div>
    <div class="sum" id="cosum"></div>
    <div class="safe"><i data-lucide="shield-check"></i><span>${t("co_safe")}</span></div>
    <div class="err" id="coerr"></div>
    <button class="btn l">${t("co_btn")}</button><p class="ssub" style="text-align:center">${t("co_demo")}</p></form>`, 620);
  const f = $("#co");
  const ship = () => f.m.value==="cour" ? 89 : 49;
  const sum = () => { $("#cosum").innerHTML = `<div><span>${t("co_item")}</span><b>${fmtN(item)} ${curS("MDL")}</b></div><div><span>${t("co_ship")}</span><b>${ship()} ${curS("MDL")}</b></div>
    <div><span>${t("co_fee")}</span><b>${fee} ${curS("MDL")}</b></div><div class="tot"><span>${t("co_total")}</span><b>${fmtN(item+ship()+fee)} ${curS("MDL")}</b></div>`; };
  sum(); f.onchange = sum;
  f.onsubmit = e => { e.preventDefault();
    if (f.addr.value.trim().length<3 || f.nm.value.trim().length<2 || f.ph.value.replace(/\D/g,"").length<8) return $("#coerr").textContent=t("co_err");
    const o = {id: 5000+ORDERS.length+1, adId:a.id, method:f.m.value, city:f.city.value, total:item+ship()+fee, t:Date.now()};
    ORDERS.unshift(o); store.set("orders", ORDERS);
    const c = CHATS[a.id] ||= {adId:a.id, msgs:[], unread:0};
    c.msgs.push({me:false, text: S.lang==="ru" ? `Спасибо за заказ №${o.id}! Отправлю в ближайшее время.` : `Mulțumesc pentru comanda nr. ${o.id}! O trimit în curând.`, t:Date.now()+1000});
    c.unread=(c.unread||0)+1; saveChats(); updateBadges();
    toast(t("co_ok")); openCabinet("orders"); };
}
const orderStage = o => Math.min(3, Math.floor((Date.now()-o.t)/ (2*60e3)));  // демо: статус меняется каждые 2 минуты

/* ---------- жалоба ---------- */
function openReport(adId){
  openModal(`<form class="form" id="rep"><h2>${t("rep_title")}</h2><div class="opts col">${t("rep_r").map((r,i)=>`<label class="opt"><input type="radio" name="r" value="${i}" ${i?"":"checked"}><span><b>${esc(r)}</b></span></label>`).join("")}</div>
    <textarea name="c" placeholder="…"></textarea><button class="btn p">${t("rep_send")}</button></form>`, 520);
  $("#rep").onsubmit = e => { e.preventDefault(); closeModal(); toast(t("rep_ok")); };
}

/* ---------- сохранённые поиски ---------- */
const SEARCH_KEYS = ["cat","sub","q","reg","min","max","cur","cond","photo","priv","deal","delivery","verified","attrs"];
function searchLabel(p){
  const c = catOf(p.cat), parts = [];
  if (c) parts.push(c[S.lang] + (p.sub!=null?" › "+subName(c,p.sub):""));
  if (p.q) parts.push(`«${p.q}»`);
  if (p.min!==""||p.max!=="") parts.push(`${p.min||0}–${p.max||"∞"} ${curS(p.cur)}`);
  if (p.reg!=="all") parts.push(regName(p.reg));
  for (const [k,v] of Object.entries(p.attrs||{})){ const f=c?.fields.find(f=>f.k===k); if(f) parts.push(typeof v==="object"?`${f[S.lang]} ${v.min??""}–${v.max??""}`:fmtAttr(f,v)); }
  if (p.delivery) parts.push(t("delivery")); if (p.verified) parts.push(t("verifiedOnly"));
  return parts.join(" · ") || t("newads");
}
function saveSearch(){
  const p = {}; SEARCH_KEYS.forEach(k=>p[k]=JSON.parse(JSON.stringify(S[k])));
  const n = query(p).length;
  SAVED = [{id:Date.now(), p, n, t:Date.now()}, ...SAVED.filter(x=>JSON.stringify(x.p)!==JSON.stringify(p))].slice(0,20);
  store.set("saved", SAVED); toast(t("searchSaved"));
}
function applySearch(p){ resetState(); Object.assign(S, JSON.parse(JSON.stringify(p))); syncFilterUI(); full(); toMain(); }
function syncFilterUI(){
  $("#q").value=S.q||""; $("#pmin").value=S.min; $("#pmax").value=S.max;
  $("#fPhoto").checked=S.photo; $("#fPrivate").checked=S.priv; $("#fDeal").checked=S.deal; $("#fDel").checked=S.delivery; $("#fVer").checked=S.verified;
  $$("#cond .chip").forEach(x=>x.classList.toggle("on", x.dataset.v===S.cond));
  $$("#cur .chip").forEach(x=>x.classList.toggle("on", x.dataset.c===S.cur));
}

/* ---------- личный кабинет ---------- */
function openCabinet(tab="my"){
  const my = ADS.filter(a=>a.mine);
  const tabs = [["my",t("cab_my"),my.length],["orders",t("cab_orders"),ORDERS.length],["saved",t("cab_saved"),SAVED.length],["viewed",t("cab_viewed"),VIEWED.length]];
  let body = "";
  if (tab==="my") body = my.length ? my.map(a=>`<div class="lrow"><span class="th" ${cover(a)} data-open="${a.id}">${a.imgs.length?"":`<i data-lucide="${icOf(a)}"></i>`}</span>
      <div class="lm" data-open="${a.id}"><b>${esc(a.title)}</b><div>${a.price?fmtN(a.price)+" "+curS(a.cur):t("free")}</div><div class="ssub"><i data-lucide="eye"></i> ${a.views} ${t("viewsN")} · ${fmtDate(a.t)}${a.top?" · TOP":""}</div></div>
      <div class="la"><button class="chip" data-raise="${a.id}"><i data-lucide="arrow-up"></i>${t("raise")}</button><button class="chip" data-unpub="${a.id}">${t("remove")}</button></div></div>`).join("")
      : `<div class="empty"><i data-lucide="file-plus"></i><p>${t("cab_noMy")}</p><button class="btn l" style="max-width:280px;margin:12px auto 0" id="cabPost"><i data-lucide="plus"></i>${t("post")}</button></div>`;
  if (tab==="orders") body = ORDERS.length ? ORDERS.map(o=>{ const a=ADS.find(x=>x.id===o.adId); if(!a) return ""; const st=orderStage(o);
      return `<div class="order"><div class="lrow" style="border:0;padding:0"><span class="th" ${cover(a)} data-open="${a.id}">${a.imgs.length?"":`<i data-lucide="${icOf(a)}"></i>`}</span>
        <div class="lm" data-open="${a.id}"><b>${t("orderN")}${o.id} · ${esc(a.title)}</b><div>${fmtN(o.total)} ${curS("MDL")} · ${o.method==="cour"?t("co_cour"):t("co_pick")} · ${regName(o.city)}</div></div></div>
        <div class="track">${t("st").map((x,i)=>`<div class="${i<=st?"done":""}"><i></i><span>${x}</span></div>`).join("")}</div></div>`; }).join("")
      : `<div class="empty"><i data-lucide="package"></i><p>${t("cab_noOrders")}</p></div>`;
  if (tab==="saved") body = SAVED.length ? SAVED.map(x=>{ const n=query(x.p).length, nw=Math.max(0,n-x.n);
      return `<div class="lrow"><span class="th ic"><i data-lucide="bell"></i></span><div class="lm" data-apply="${x.id}"><b>${esc(searchLabel(x.p))}</b><div class="ssub">${n} ${t("nowFound")}${nw?` · <span class="new">+${nw} ${t("newN")}</span>`:""}</div></div>
        <div class="la"><button class="chip on" data-apply="${x.id}">${t("open")}</button><button class="chip" data-unsave="${x.id}"><i data-lucide="trash-2"></i></button></div></div>`; }).join("")
      : `<div class="empty"><i data-lucide="bell"></i><p>${t("cab_noSaved")}</p></div>`;
  if (tab==="viewed"){ const v = VIEWED.map(id=>ADS.find(a=>a.id===id)).filter(Boolean);
    body = v.length ? `<div class="grid">${v.map(cardHTML).join("")}</div>` : `<div class="empty"><i data-lucide="history"></i><p>${t("cab_noViewed")}</p></div>`; }
  openModal(`<div class="cab"><div class="cabh"><span class="ava big"><i data-lucide="user"></i></span><div><h2>${t("cab_guest")}</h2><button class="lnk" id="cabLogin">${t("cab_login")}</button></div></div>
    <div class="tabs">${tabs.map(([k,l,n])=>`<button class="${tab===k?"on":""}" data-ctab="${k}">${l} <small>${n}</small></button>`).join("")}</div>
    <div class="cabb">${body}</div></div>`, 900);
  $$("[data-ctab]").forEach(b=>b.onclick=()=>openCabinet(b.dataset.ctab));
  $("#cabLogin").onclick = openLogin;
  if ($("#cabPost")) $("#cabPost").onclick = openPost;
  $$("[data-raise]").forEach(b=>b.onclick=()=>{ const a=ADS.find(x=>x.id===+b.dataset.raise); a.t=Date.now(); saveMy(); toast(t("raised")); render(); openCabinet("my"); });
  $$("[data-unpub]").forEach(b=>b.onclick=()=>{ ADS = ADS.filter(x=>x.id!==+b.dataset.unpub); saveMy(); toast(t("removed")); full(); openCabinet("my"); });
  $$("[data-unsave]").forEach(b=>b.onclick=()=>{ SAVED=SAVED.filter(x=>x.id!==+b.dataset.unsave); store.set("saved",SAVED); openCabinet("saved"); });
  $$("[data-apply]").forEach(b=>b.onclick=()=>{ const x=SAVED.find(x=>x.id===+b.dataset.apply); x.n=query(x.p).length; store.set("saved",SAVED); closeModal(); applySearch(x.p); });
}

/* ---------- ссылки вида #ad-123 ---------- */
function routeHash(){ const m = location.hash.match(/^#ad-(\d+)$/); if (m && ADS.some(a=>a.id===+m[1])) openAd(+m[1]); }
window.addEventListener("hashchange", routeHash);
