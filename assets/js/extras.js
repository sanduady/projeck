/* Project — информационные страницы, подсказки поиска (история, популярное, категории),
   кнопка «наверх», управление с клавиатуры. */

Object.assign(T.ru, {
  favEmpty:"В избранном пока пусто", favEmpty2:"Нажимайте ♡ на объявлениях — они сохранятся здесь.",
  sgHistory:"Вы искали", findIn:"Найти в списке", sgPopular:"Часто ищут", sgCats:"Категории", sgAds:"Объявления", sgClear:"Очистить", totop:"Наверх"
});
Object.assign(T.ro, {
  favEmpty:"Lista de favorite e goală", favEmpty2:"Apasă ♡ pe anunțuri — vor fi salvate aici.",
  sgHistory:"Ai căutat", findIn:"Caută în listă", sgPopular:"Căutări populare", sgCats:"Categorii", sgAds:"Anunțuri", sgClear:"Șterge", totop:"Sus"
});

/* ---------- информационные страницы ---------- */
const INFO = {
  about:{ru:["О Project",`Project — доска объявлений для Молдовы, где легко продать ненужное и быстро найти нужное: от телефона до квартиры.
Мы делаем сайт лёгким и быстрым, без навязчивой рекламы. Фильтры подстраиваются под каждую категорию, а ИИ-помощник сам сравнивает предложения и показывает самые выгодные.
Подать объявление можно бесплатно за пару минут, с телефона или компьютера.`],
    ro:["Despre Project",`Project este o platformă de anunțuri pentru Moldova, unde vinzi ușor ce nu-ți mai trebuie și găsești rapid ce cauți: de la telefon la apartament.
Facem site-ul ușor și rapid, fără reclame agresive. Filtrele se adaptează fiecărei categorii, iar asistentul AI compară ofertele și îți arată cele mai avantajoase.
Poți publica un anunț gratuit în câteva minute, de pe telefon sau calculator.`]},
  blog:{ru:["Блог","Скоро здесь появятся новости площадки, советы покупателям и продавцам, обзоры цен на авто и недвижимость в Молдове."],
    ro:["Blog","În curând aici vor apărea noutăți, sfaturi pentru cumpărători și vânzători, analize de prețuri la auto și imobiliare în Moldova."]},
  privacy:{ru:["Конфиденциальность",`Мы собираем только то, что нужно для работы сайта: контакты в объявлениях, переписку с продавцами и настройки.
Номер телефона продавца показывается только по нажатию кнопки, точный адрес никогда не публикуется.
В демо-версии избранное, чаты и ваши объявления хранятся только в вашем браузере и никуда не отправляются.`],
    ro:["Confidențialitate",`Colectăm doar ce e necesar pentru funcționarea site-ului: contactele din anunțuri, mesajele cu vânzătorii și setările.
Numărul vânzătorului apare doar la apăsarea butonului, adresa exactă nu se publică niciodată.
În versiunea demo, favoritele, mesajele și anunțurile tale se păstrează doar în browserul tău.`]},
  terms:{ru:["Условия использования",`Пользуясь сайтом, вы соглашаетесь публиковать правдивую информацию и не размещать запрещённые товары и услуги.
Project — площадка для объявлений: сделку вы заключаете напрямую с продавцом или покупателем.
Мы можем снять объявление, нарушающее правила, и ограничить доступ за спам или мошенничество.`],
    ro:["Termeni de utilizare",`Folosind site-ul, accepți să publici informații corecte și să nu plasezi bunuri sau servicii interzise.
Project este o platformă de anunțuri: tranzacția o încheii direct cu vânzătorul sau cumpărătorul.
Putem retrage anunțurile care încalcă regulile și limita accesul pentru spam sau fraudă.`]},
  rules:{ru:["Правила размещения",`Одно объявление — один товар или услуга. Не публикуйте одно и то же несколько раз.
Фотографии должны быть ваши и показывать именно этот товар. Цена — реальная, без «1 лей».
Запрещено: оружие, лекарства по рецепту, поддельные вещи, чужие персональные данные, оскорбления.
Выбирайте правильную категорию — так ваше объявление быстрее найдут.`],
    ro:["Regulile de publicare",`Un anunț — un singur produs sau serviciu. Nu publica același anunț de mai multe ori.
Fotografiile trebuie să fie ale tale și să arate exact acest produs. Prețul trebuie să fie real, fără „1 leu”.
Interzis: arme, medicamente cu rețetă, contrafaceri, datele personale ale altor persoane, insulte.
Alege categoria corectă — astfel anunțul tău va fi găsit mai repede.`]},
  safe:{ru:["Как не попасться на мошенников",`Не переводите предоплату незнакомым людям, особенно «на карту» до встречи.
Встречайтесь в людных местах, проверяйте товар до оплаты. Машину — на СТО, телефон — включите и проверьте все функции.
Никому не сообщайте коды из SMS и CVV карты: сотрудники площадки никогда их не спрашивают.
Подозрительное объявление? Нажмите «Пожаловаться» — модератор проверит.`],
    ro:["Cum să nu cazi în plasa escrocilor",`Nu transfera avans persoanelor necunoscute, mai ales „pe card” înainte de întâlnire.
Întâlnește-te în locuri aglomerate și verifică produsul înainte de plată. Mașina — la service, telefonul — pornește-l și verifică toate funcțiile.
Nu comunica nimănui codurile din SMS și CVV-ul cardului: angajații platformei nu le cer niciodată.
Anunț suspect? Apasă „Raportează” — moderatorul îl va verifica.`]},
  faq:{ru:["Вопросы и ответы",`Сколько стоит подать объявление? — Бесплатно. Платно только продвижение: выделение и ТОП.
Как поднять объявление? — В «Кабинете» → «Мои объявления» → «Поднять».
Как работает ИИ-поиск? — Опишите обычными словами, что ищете и бюджет. ИИ ищет только среди объявлений сайта и ничего не выдумывает.
Как сохранить поиск? — Настройте фильтры и нажмите колокольчик «Сохранить поиск».`],
    ro:["Întrebări frecvente",`Cât costă publicarea unui anunț? — Gratuit. Se plătește doar promovarea: evidențierea și TOP.
Cum ridic anunțul? — „Cabinet” → „Anunțurile mele” → „Ridică”.
Cum funcționează căutarea AI? — Descrie cu cuvinte simple ce cauți și bugetul. AI-ul caută doar printre anunțurile site-ului și nu inventează nimic.
Cum salvez o căutare? — Setează filtrele și apasă clopoțelul „Salvează căutarea”.`]},
  report:{ru:["Пожаловаться",`Откройте объявление и нажмите «Пожаловаться» под кнопками связи. Выберите причину — модератор проверит объявление в течение дня.
Если вас обманули, сохраните переписку и обратитесь в полицию.`],
    ro:["Raportează",`Deschide anunțul și apasă „Raportează” sub butoanele de contact. Alege motivul — moderatorul va verifica anunțul în aceeași zi.
Dacă ai fost înșelat, păstrează conversația și adresează-te poliției.`]},
  promo:{ru:["Продвижение объявлений",`Выделение цветом — объявление заметнее в списке на 7 дней.
ТОП — объявление показывается первым в своей категории 3 дня.
Турбо — ТОП и выделение вместе, до 10 раз больше просмотров.
Выбрать продвижение можно при подаче объявления. В демо-версии оплата не подключена.`],
    ro:["Promovarea anunțurilor",`Evidențiere color — anunțul iese în evidență în listă timp de 7 zile.
TOP — anunțul apare primul în categoria sa timp de 3 zile.
Turbo — TOP și evidențiere împreună, până la 10 ori mai multe vizualizări.
Promovarea se alege la publicarea anunțului. În versiunea demo plata nu este conectată.`]},
  shops:{ru:["Магазины на Project","Скоро бизнес-аккаунты: страница магазина с логотипом, обложкой, адресом и всеми товарами, рейтинг и статистика просмотров."],
    ro:["Magazine pe Project","În curând — conturi business: pagina magazinului cu logo, copertă, adresă și toate produsele, rating și statistici."]},
  ads:{ru:["Реклама на сайте","Рекламные места на главной и в категориях появятся после запуска. Мы показываем только аккуратную рекламу, которая не мешает искать объявления."],
    ro:["Publicitate pe site","Spațiile publicitare pe pagina principală și în categorii vor apărea după lansare. Afișăm doar publicitate discretă, care nu încurcă la căutare."]},
};
INFO.help = INFO.faq;
function openInfo(key){
  const it = INFO[key]; if (!it) return;
  const [title, body] = it[S.lang] || it.ru;
  openModal(`<div class="form info"><h2>${esc(title)}</h2>${body.split("\n").map(p=>`<p>${esc(p)}</p>`).join("")}
    <div class="infolinks">${["about","rules","safe","faq","privacy","terms"].filter(k=>k!==key).map(k=>`<button class="chip" data-info="${k}">${esc((INFO[k][S.lang]||INFO[k].ru)[0])}</button>`).join("")}</div></div>`, 640);
}

/* ---------- подсказки поиска ---------- */
let QHIST = store.get("qhist", []);
const POPULAR = {ru:["iPhone","квартира Ботаника","игровой ПК","Toyota","диван","велосипед","работа водитель","аренда"],
                 ro:["iPhone","apartament Botanica","PC gaming","Toyota","canapea","bicicletă","chirie","Chișinău"]};
function addHist(q){ q=q.trim(); if(q.length<2) return; QHIST=[q,...QHIST.filter(x=>norm(x)!==norm(q))].slice(0,8); store.set("qhist",QHIST); }
let sgIdx = -1;
function renderSuggest(){
  const box = $("#suggest"), raw = $("#q").value, q = norm(raw).trim();
  let h = "";
  if (!q){
    if (QHIST.length) h += `<div class="sgh"><span>${t("sgHistory")}</span><button data-sgclear>${t("sgClear")}</button></div>` + QHIST.map(x=>`<button class="sgi" data-sgq="${esc(x)}"><i data-lucide="history"></i>${esc(x)}</button>`).join("");
    h += `<div class="sgh"><span>${t("sgPopular")}</span></div><div class="sgchips">${POPULAR[S.lang].map(x=>`<button class="chip" data-sgq="${esc(x)}">${esc(x)}</button>`).join("")}</div>`;
  } else {
    const cats = [];
    CATS.forEach(c=>{ if (norm(c.ru+" "+c.ro).includes(q)) cats.push([c,null]);
      c.subs.forEach((s,i)=>{ if (norm(s[0]+" "+s[1]).includes(q)) cats.push([c,i]); }); });
    if (cats.length) h += `<div class="sgh"><span>${t("sgCats")}</span></div>` + cats.slice(0,4).map(([c,i])=>`<button class="sgi" data-mc="${c.id}" ${i!=null?`data-ms="${i}"`:""}><i data-lucide="${c.ic}"></i>${esc(c[S.lang])}${i!=null?` › ${esc(subName(c,i))}`:""}</button>`).join("");
    const seen = new Set(), ads = [];
    for (const a of ADS){ const tt = a.title; if (norm(tt).includes(q) && !seen.has(tt)){ seen.add(tt); ads.push(a); if (ads.length>=6) break; } }
    if (ads.length) h += `<div class="sgh"><span>${t("sgAds")}</span></div>` + ads.map(a=>`<button class="sgi" data-sgq="${esc(a.title)}"><i data-lucide="search"></i><span>${hl(a.title, raw)}</span><small>${a.price?fmtN(a.price)+" "+curS(a.cur):""}</small></button>`).join("");
    if (!h) h = `<div class="sgh"><span>${t("nores")}</span></div>`;
  }
  box.innerHTML = h; box.hidden = false; sgIdx = -1; icons();
}
function hl(text, raw){ const n = norm(text), q = norm(raw).trim(), i = n.indexOf(q);
  return i<0 ? esc(text) : esc(text.slice(0,i)) + "<b>" + esc(text.slice(i,i+q.length)) + "</b>" + esc(text.slice(i+q.length)); }
const hideSuggest = () => { $("#suggest").hidden = true; };
$("#q").addEventListener("focus", renderSuggest);
$("#q").addEventListener("input", renderSuggest);
$("#q").addEventListener("keydown", e => {
  const items = $$("#suggest [data-sgq], #suggest [data-mc]");
  if (e.key==="ArrowDown"||e.key==="ArrowUp"){ if(!items.length) return; e.preventDefault();
    sgIdx = (sgIdx + (e.key==="ArrowDown"?1:-1) + items.length) % items.length; items.forEach((b,i)=>b.classList.toggle("act",i===sgIdx)); }
  else if (e.key==="Enter" && sgIdx>=0 && items[sgIdx]){ e.preventDefault(); items[sgIdx].click(); }
  else if (e.key==="Escape") hideSuggest();
});
$("#suggest").addEventListener("mousedown", e => e.preventDefault()); // не терять фокус при клике
$("#suggest").addEventListener("click", e => {
  const c = e.target.closest("[data-sgclear]"); if (c){ QHIST=[]; store.set("qhist",QHIST); renderSuggest(); return; }
  const b = e.target.closest("[data-sgq]"); if (b){ $("#q").value = b.dataset.sgq; addHist(b.dataset.sgq); hideSuggest(); $("#q").blur(); go({q:b.dataset.sgq, ids:null}); toMain(); }
  if (e.target.closest("[data-mc]")){ hideSuggest(); $("#q").value=""; S.q=""; $("#q").blur(); }
});
document.addEventListener("click", e => { if (!e.target.closest("#sw")) hideSuggest(); });
$("#sform").addEventListener("submit", () => { addHist($("#q").value); hideSuggest(); $("#q").blur(); });

/* ---------- информационные ссылки, клавиатура, «наверх» ---------- */
document.addEventListener("click", e => { const i = e.target.closest("[data-info]"); if (i){ e.preventDefault(); openInfo(i.dataset.info); } });
document.addEventListener("keydown", e => {
  if ((e.key==="Enter"||e.key===" ") && e.target.classList?.contains("card")){ e.preventDefault(); openAd(+e.target.dataset.id); }
  if (e.key==="Escape" && $("#aside").classList.contains("open")) { $("#aside").classList.remove("open"); $("#scrim").classList.remove("show"); document.body.style.overflow=""; }
  if (e.key==="/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){ e.preventDefault(); $("#q").focus(); }
});
const totop = $("#totop");
window.addEventListener("scroll", () => { totop.hidden = window.scrollY < 900; }, {passive:true});
totop.onclick = () => window.scrollTo({top:0, behavior:"smooth"});
