/* Gata.md — ИИ-помощник поиска (Claude + запасной локальный подбор) */
const AI = {hist:[], busy:false, mode:"claude", sample:undefined};
async function getSample(){
  if (AI.sample!==undefined) return AI.sample;
  try { AI.sample = (window.claude && typeof claude.use==="function") ? await claude.use("sample") : null; } catch(e){ AI.sample = null; }
  if (!AI.sample){ AI.mode="local"; $("#aiMode").textContent=t("aiLocal"); }
  return AI.sample;
}
function catalogForAI(){
  return CATS.map(c=>{
    const fs=[]; const seen={};
    c.fields.forEach(f=>{ const key=f.k+(f.only?"@"+f.only.join(","):"");
      if(seen[key])return; seen[key]=1;
      fs.push(`${f.k}${f.only?` [только подкат. ${f.only.join(",")}]`:""}: ${f.t==="rng"?"число"+(f.u?" ("+f.u+")":""):f.opts.map(optV).join(" | ")}`); });
    return `- ${c.id} «${c.ru}»; подкатегории: ${c.subs.map((s,i)=>i+"="+s[0]).join(", ")}${fs.length?"\n    атрибуты: "+fs.join("; "):""}`;
  }).join("\n");
}
const AI_RULES = () => `Ты — ИИ-помощник доски объявлений Gata.md (Молдова). Пользователь описывает, что хочет купить или найти. Твоя задача — найти в базе объявлений Gata самые выгодные и перспективные предложения.

Правила:
1. Ищи ТОЛЬКО через инструмент search_ads. Никогда не выдумывай объявления, цены и характеристики. Делай 1–4 поиска (например, сначала в бюджете, потом чуть шире или с другим фильтром).
2. Бюджет: цены в объявлениях бывают в леях (MDL) и евро; инструмент принимает границы в MDL (курс ${RATE} лей = 1 €). Не предлагай варианты дороже бюджета более чем на 5%.
3. Выбирай по соотношению цена/качество: характеристики (для ПК важнее всего видеокарта и процессор, затем RAM/SSD), год/пробег/состояние, market_estimate (средняя цена похожих: если цена ниже — это выгодно), свежесть объявления. Подозрительно дешёвые варианты отмечай с осторожностью.
4. Ответ — коротко, на языке пользователя (русский или румынский), без таблиц и заголовков: одно предложение-вывод, затем 1–3 лучших варианта, по каждому 1–2 предложения «почему». Можно **жирный** для названий. В конце — короткий совет (например, что проверить при встрече).
5. Самая последняя строка ответа строго в формате: IDS: <id лучшего>, <id второго>, <id третьего>

Каталог (id категории, номера подкатегорий, атрибуты):
${catalogForAI()}`;
const SEARCH_TOOL = {
  name:"search_ads",
  description:"Поиск по объявлениям Gata.md. Возвращает до 20 объявлений с ценой (в т.ч. price_mdl), характеристиками, market_estimate (средняя цена похожих, если известна), состоянием, городом и датой. Все параметры необязательны.",
  inputSchema:{type:"object",properties:{
    text:{type:"string",description:"Ключевые слова, которые должны встречаться в объявлении (например 'RTX', 'iPhone 15', 'Ботаника'). Не пиши сюда цену и общие слова вроде 'лучший'."},
    category:{type:"string",enum:CATS.map(c=>c.id)},
    subcategory:{type:"integer",description:"Номер подкатегории внутри категории"},
    min_price_mdl:{type:"number"}, max_price_mdl:{type:"number"},
    region:{type:"string",enum:REG.map(r=>r[0])},
    condition:{type:"string",enum:["new","used"]},
    attrs:{type:"object",description:"Фильтры по атрибутам: строка для списков (например {\"gpu\":\"RTX 4060\",\"fuel\":\"diesel\"}) или {\"min\":..,\"max\":..} для чисел (например {\"year\":{\"min\":2015},\"ram\":{\"min\":32}})."},
    sort:{type:"string",enum:["deal","cheap","exp","new","value"],description:"deal — самые выгодные относительно рынка; value — самые «мощные/дорогие по рыночной стоимости»; cheap/exp — по цене; new — свежие"},
    limit:{type:"integer",description:"по умолчанию 15, максимум 20"}}},
  execute(inp){
    AI.status(t("aiSearching")+(inp.text?`: «${inp.text}»`:"")+(inp.max_price_mdl?` ≤ ${fmtN(inp.max_price_mdl)} MDL`:"")+"…");
    const r = query({q:inp.text||"",cat:inp.category||null,sub:inp.subcategory??null,min:inp.min_price_mdl??"",max:inp.max_price_mdl??"",cur:"MDL",
      reg:inp.region||"all",cond:inp.condition||"all",attrs:inp.attrs||{},sort:inp.sort||"deal"});
    const lim = Math.min(20, inp.limit||15);
    return {total_found:r.length, items:r.slice(0,lim).map(a=>{ const c=catOf(a.cat); const at={};
      fieldsFor(c,a.sub).forEach(f=>{ if(a.attrs[f.k]!=null) at[f.ru]=fmtAttr(f,a.attrs[f.k],"ru"); });
      return {id:a.id,title:a.title,price:a.price?`${a.price} ${a.cur}`:"договорная/бесплатно",price_mdl:Math.round(mdl(a)),
        market_estimate_mdl:a.val?Math.round(a.cur==="EUR"?a.val*RATE:a.val):null,category:`${c.ru} / ${c.subs[a.sub][0]}`,
        condition:a.cond==="new"?"новое":"б/у",city:regName(a.reg,"ru"),posted_days_ago:Math.floor((Date.now()-a.t)/864e5),seller:a.priv?"частное лицо":"компания",seller_rating:sellerOf(a).reviews?sellerOf(a).rating:null,seller_verified:sellerOf(a).verified,delivery:!!a.delivery,attrs:at,description:a.desc}; })};
  }
};

// Запасной «умный» подбор без ИИ: разбирает запрос и ранжирует по выгоде
function localAI(text){
  const s = text.toLowerCase().replace(/(\d)[\s ](?=\d{3}\b)/g,"$1");
  const W = x => new RegExp("(?<![a-zа-яёăâîșț])(?:"+x+")");
  const rules = [
    [W("игров|gaming|пк(?![а-яё])|компьютер|системник|calculator|pc(?![a-z])"),"elec",2],[W("ноутбук|laptop|macbook|лаптоп"),"elec",1],
    [W("iphone|айфон|телефон|смартфон|telefon|samsung galaxy|pixel|redmi"),"elec",0],[W("планшет|ipad|tablet"),"elec",3],[W("телевизор|tv(?![a-z])|televizor"),"elec",4],
    [W("приставк|playstation|ps5|xbox|nintendo"),"elec",7],[W("видеокарт"),"elec",8],
    [W("посуточ"),"real",3],[W("аренд|снять|сдаю|chirie"),"real",2],[W("квартир|apartament|\\d\\s*-?\\s*комн"),"real",0],[W("дом(?![а-яё])|дача|дачу|casă|casa(?![a-z])"),"real",1],[W("участ|teren"),"real",4],
    [W("мотоцикл|мото(?![а-яё])|скутер"),"auto",2],[W("грузови|camion"),"auto",1],[W("шины|шин(?![а-яё])|диски|anvelop"),"auto",7],
    [W("машин|авто(?!мат)|автомоб|mașin|masin|car(?![a-z])|toyota|bmw|volkswagen|mercedes|skoda|dacia|hyundai|kia"),"auto",0],
    [W("холодильник|frigider"),"appl",0],[W("стиральн"),"appl",1],[W("кондиционер"),"appl",3],[W("пылесос"),"appl",4],[W("коляск"),"kids",0],[W("велосипед|bicicl"),"sport",0],
    [W("работ|ваканс|job"),"job",0],[W("диван|мебел|шкаф|кроват"),"home",0]];
  let cat=null, sub=null; for (const [re,c,sb] of rules) if (re.test(s)){ cat=c; sub=sb; break; }
  let budget=null, cur="MDL";
  const m = s.match(/(?:за|до|бюджет\w*|около|в пределах|не дороже|max|p[aâ]n[aă] la|sub|de)\s*(\d+(?:[.,]\d+)?)\s*(тыс\w*|k|к)?\s*(лей|lei|mdl|€|евро|eur|euro)?/) || s.match(/(\d{3,})\s*(тыс\w*|k)?\s*(лей|lei|mdl|€|евро|eur|euro)/);
  if (m){ budget = parseFloat(m[1].replace(",", ".")) * (m[2]?1000:1); if (/€|евро|eur/.test(m[3]||"")) cur="EUR"; }
  if (budget && !m[3] && (cat==="auto"||cat==="real"&&sub!==3) && budget<200000) cur="EUR";
  const attrs={};
  if (/автомат|automat/.test(s)) attrs.gearbox="auto";
  if (/дизел|motorin/.test(s)) attrs.fuel="diesel";
  const rm = s.match(/(\d)\s*-?\s*(комн|кімн|camer)/); if (rm && cat==="real") attrs.rooms = rm[1]>3?"4":rm[1];
  for (const sec of ["Центр","Ботаника","Рышкановка","Чеканы","Буюканы","Телецентр","Скулянка"]) if (s.includes(sec.toLowerCase().slice(0,5))) attrs.sector=sec;
  const brand = ["apple","iphone","samsung","xiaomi","lenovo","asus","acer","dell","hp","toyota","bmw","volkswagen","skoda","dacia","mercedes"].find(b=>new RegExp("\\b"+b).test(s));
  let q = brand==="iphone"?"iphone":"";
  if (brand && brand!=="iphone" && cat){ const bf = catOf(cat).fields.find(f=>f.k==="brand" && (!f.only||f.only.includes(sub))); if (bf){ const o=bf.opts.find(o=>optV(o).toLowerCase().startsWith(brand)); if(o) attrs.brand=optV(o);} }
  const maxMDL = budget ? budget*(cur==="EUR"?RATE:1)*1.05 : null;
  let r = query({cat,sub,q,max:maxMDL??"",cur:"MDL",attrs,sort:"new"}).filter(a=>a.price>0);
  const score = a => { const ratio = a.val? a.val/a.price : 1; const power = a.val? Math.log(a.val+10) : 0;
    return (maxMDL? power*1.0 : 0) + ratio*3 + (a.cond==="new"?0.15:0) - ((Date.now()-a.t)/864e5)*0.01; };
  r.sort((a,b)=>score(b)-score(a));
  const best = r.slice(0,3);
  const ru = S.lang==="ru";
  if (!best.length) return {text: ru? "Не нашёл подходящих объявлений. Попробуйте увеличить бюджет или убрать часть условий." : "Nu am găsit anunțuri potrivite. Încearcă un buget mai mare sau mai puține condiții.", ids:[], q:{cat,sub,attrs,max:maxMDL}};
  const why = a => { const parts=[]; if (a.val && a.price<a.val*.93) parts.push(ru?`дешевле рынка ~на ${Math.round((1-a.price/a.val)*100)}%`:`cu ~${Math.round((1-a.price/a.val)*100)}% sub piață`);
    const sp=specLine(a); if(sp) parts.push(sp); parts.push(a.cond==="new"?(ru?"новое":"nou"):(ru?"б/у":"folosit")); return parts.join(", "); };
  const head = ru ? `Нашёл ${r.length} подходящих объявлений${budget?` в бюджете до ${fmtN(budget)} ${cur==="EUR"?"€":"лей"}`:""}. Лучшие по соотношению цена/качество:` :
                    `Am găsit ${r.length} anunțuri potrivite${budget?` cu buget până la ${fmtN(budget)} ${cur==="EUR"?"€":"lei"}`:""}. Cele mai bune după raportul preț/calitate:`;
  const lines = best.map((a,i)=>`${i+1}. **${a.title}** — ${fmtN(a.price)} ${curS(a.cur)}: ${why(a)}.`);
  return {text: head+"\n"+lines.join("\n"), ids: best.map(a=>a.id), q:{cat,sub,attrs,max:maxMDL}};
}

function mdLite(s){ return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^#+\s*/gm,""); }
const stripIds = s => s.replace(/\n?\s*IDS:[\s\S]*$/,"").trim();
function addMsg(role, html){ const m=document.createElement("div"); m.className="msg "+role; m.innerHTML=html; $("#msgs").appendChild(m); $("#msgs").scrollTop=1e9; return m; }
function miniCards(ids){
  const list = ids.map(id=>ADS.find(a=>a.id===id)).filter(Boolean);
  if (!list.length) return "";
  return `<div class="res">${list.map((a,i)=>`<div class="mini" data-open="${a.id}"><span class="rk ${i===0?"g":""}">${i+1}</span>
    <div class="th" ${cover(a)}>${a.imgs.length?"":`<i data-lucide="${icOf(a)}"></i>`}</div>
    <div style="min-width:0">${isDeal(a)?`<span class="deal"><i data-lucide="trending-down"></i>${t("deal")}</span>`:""}<div class="p">${a.price?fmtN(a.price)+" "+curS(a.cur):t("free")}</div><div class="tt">${esc(a.title)}</div>
    <div style="font-size:12px;color:var(--mute)">${regName(a.reg)} · ${fmtDate(a.t)}</div></div></div>`).join("")}
    <button class="chip" data-showids="${list.map(a=>a.id).join(",")}" style="justify-self:start">${t("aiOpen")} →</button></div>`;
}
function aiWelcome(){
  $("#msgs").innerHTML="";
  addMsg("a",`<div class="bub">${esc(t("aiHello"))}</div><div class="sugg">${t("aiS").map(x=>`<button data-ask="${esc(x)}">${esc(x)}</button>`).join("")}</div>`);
  icons();
}
function openAI(prefill){
  $("#drawer").classList.add("open");
  if (!$("#msgs").children.length) aiWelcome();
  getSample();
  if (prefill) aiSend(prefill); else setTimeout(()=>$("#aiIn").focus(),250);
}
async function aiSend(text){
  text = text.trim(); if (!text || AI.busy) return;
  AI.busy = true; $("#aiSend").disabled = true; $("#aiIn").value="";
  addMsg("u",`<div class="bub">${esc(text)}</div>`);
  const box = addMsg("a",`<div class="st"><span class="dots"><i></i><i></i><i></i></span><span>${t("aiThinking")}…</span></div><div class="bub" style="display:none"></div>`);
  const st = box.querySelector(".st span:last-child"), bub = box.querySelector(".bub");
  AI.status = s => { st.textContent = s; $("#msgs").scrollTop=1e9; };
  const finish = (txt, ids) => {
    box.querySelector(".st").remove();
    bub.style.display=""; bub.innerHTML = mdLite(stripIds(txt));
    if (ids.length) box.insertAdjacentHTML("beforeend", miniCards(ids));
    icons(); $("#msgs").scrollTop=1e9;
    AI.busy=false; $("#aiSend").disabled=false;
  };
  const sample = await getSample();
  if (!sample){ setTimeout(()=>{ const r=localAI(text); finish(r.text, r.ids); }, 350); return; }
  const first = AI.hist.length===0;
  AI.hist.push({role:"user", content: first ? AI_RULES()+"\n\nЗапрос пользователя: "+text : text});
  try {
    const res = await sample(AI.hist.slice(-12), {tools:[SEARCH_TOOL], modelTier:"default", cache:false,
      onText:({text:tx}) => { if (tx && tx!=="Thinking..." ){ bub.style.display=""; bub.innerHTML = mdLite(stripIds(tx)); $("#msgs").scrollTop=1e9; } }});
    const out = res.text||"";
    AI.hist.push({role:"assistant", content: out});
    const m = out.match(/IDS:\s*([\d,\s]+)/);
    finish(out, m ? m[1].split(/[,\s]+/).map(Number).filter(Boolean).slice(0,3) : []);
  } catch(e){
    AI.hist.pop();
    if (e && e.code==="rate_limited"){ finish(t("aiErr"), []); return; }
    AI.sample = null; AI.mode="local"; $("#aiMode").textContent=t("aiLocal");
    const r = localAI(text); finish(r.text, r.ids);
  }
}

