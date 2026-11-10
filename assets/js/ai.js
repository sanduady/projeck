/* Project — ИИ-помощник поиска (Claude + запасной локальный подбор) */
const AI = {hist:[], busy:false, mode:"claude", sample:undefined};
async function getSample(){
  if (AI.sample!==undefined) return AI.sample;
  try { AI.sample = (window.claude && typeof claude.use==="function") ? await claude.use("sample") : null; } catch(e){ AI.sample = null; }
  if (!AI.sample){ AI.mode="local"; $("#aiMode").textContent=t("aiLocal"); }
  return AI.sample;
}
function catalogForAI(){
  const desc = f => f.t==="date" ? "дата ГГГГ-ММ-ДД, фильтр {min,max}" : f.t==="rng" ? "число"+(f.u?" ("+f.u+")":"")+", фильтр {min,max}" : f.t==="bool" ? "да/нет, фильтр true"
    : f.by ? `зависит от ${f.dep}` : (f.t==="multi"||f.t==="color" ? "один или несколько: " : "") + fieldOpts(f).map(optV).join(" | ");
  const cats = CATS.map(c=>{
    const fs=[]; const seen={};
    c.fields.forEach(f=>{ const key=f.k+(f.only?"@"+f.only.join(","):""); if(seen[key])return; seen[key]=1;
      fs.push(`${f.k}${f.only?` [подкат. ${f.only.join(",")}]`:""}: ${desc(f)}`); });
    return `- ${c.id} «${c.ru}»; подкатегории: ${c.subs.map((s,i)=>i+"="+s[0]).join(", ")}${fs.length?"\n    атрибуты: "+fs.join("; "):""}`;
  }).join("\n");
  const cars = CAR_BRANDS.map(b=>`${b}: ${CAR_MODELS[b].map(m=>`${m} (${CAR_DB[b][m].map(g=>g[0]+" "+g[1]).join(", ")})`).join("; ")}`).join("\n");
  const phones = Object.entries(PHONE_DB).map(([b,ms])=>`${b}: ${ms.join(", ")}`).join("; ");
  const gpus = Object.entries(GPU_SERIES).map(([v,ss])=>`${v}: `+ss.map(x=>`${x} (${GPU_BY_SERIES[x].join(", ")})`).join("; ")).join("\n");
  const cpus = Object.entries(CPU_SERIES).map(([b,ss])=>`${b}: `+ss.map(x=>`${x} (${(CPU_BY_SERIES[x]||[]).join(", ")})`).join("; ")).join("\n");
  const regs = REG.slice(1).map(r=>`${r[0]}=${r[1]}`).join(", ");
  return `${cats}\n\nЛегковые авто — марка (brand) → модель (model) → поколение (gen, с годами выпуска):\n${cars}\n\nТелефоны — бренд → модель: ${phones}\n\nВидеокарты (comp, подкат. 3) — gvendor → gseries → gmodel:\n${gpus}\n\nПроцессоры (comp, подкат. 4) — cbrand → cseries → cmodel:\n${cpus}\n\nГорода (region): ${regs}`;
}
const AI_RULES = () => `Ты — ИИ-помощник доски объявлений Project (Молдова). Пользователь описывает, что хочет купить или найти. Твоя задача — найти в базе объявлений Project самые выгодные и перспективные предложения.

Правила:
1. Ищи ТОЛЬКО через инструмент search_ads. Никогда не выдумывай объявления, цены и характеристики. Делай 1–4 поиска (например, сначала в бюджете, потом чуть шире или с другим фильтром).
2. Бюджет: цены в объявлениях бывают в леях (MDL), евро, долларах, леях Румынии и гривнах; инструмент принимает границы в MDL (демо-курсы: ${Object.entries(CURRENCIES).filter(([k])=>k!=="MDL").map(([k,v])=>`1 ${k} = ${v.rate} MDL`).join(", ")}). Не предлагай варианты дороже бюджета более чем на 5%.
3. Выбирай по соотношению цена/качество: характеристики (для ПК важнее всего видеокарта и процессор, затем RAM/SSD), год/пробег/состояние, market_estimate (средняя цена похожих: если цена ниже — это выгодно), свежесть объявления. Подозрительно дешёвые варианты отмечай с осторожностью.
4. Ответ — коротко, на языке пользователя (русский или румынский), без таблиц и заголовков: одно предложение-вывод, затем 1–3 лучших варианта, по каждому 1–2 предложения «почему». Можно **жирный** для названий. В конце — короткий совет (например, что проверить при встрече).
5. Самая последняя строка ответа строго в формате: IDS: <id лучшего>, <id второго>, <id третьего>

Каталог (id категории, номера подкатегорий, атрибуты):
${catalogForAI()}`;
const SEARCH_TOOL = {
  name:"search_ads",
  description:"Поиск по объявлениям Project. Возвращает до 20 объявлений с ценой (в т.ч. price_mdl), характеристиками, market_estimate (средняя цена похожих, если известна), состоянием, городом и датой. Все параметры необязательны.",
  inputSchema:{type:"object",properties:{
    text:{type:"string",description:"Ключевые слова, которые должны встречаться в объявлении (например 'RTX', 'iPhone 15', 'Ботаника'). Не пиши сюда цену и общие слова вроде 'лучший'."},
    category:{type:"string",enum:CATS.map(c=>c.id)},
    subcategory:{type:"integer",description:"Номер подкатегории внутри категории"},
    min_price_mdl:{type:"number"}, max_price_mdl:{type:"number"},
    region:{type:"string",enum:REG.map(r=>r[0])},
    condition:{type:"string",enum:["new","used"]},
    attrs:{type:"object",description:"Фильтры по атрибутам из каталога. Список — строка или массив вариантов (любой из них подходит), например {\"brand\":\"BMW\",\"model\":\"3 Series\",\"fuel\":[\"diesel\",\"hybrid\"],\"drive\":\"awd\"}; число — {\"min\":..,\"max\":..}, например {\"year\":{\"min\":2015},\"engine\":{\"max\":2.0}}; да/нет — true, например {\"furniture\":true}. opts (опции авто) — массив, нужны все перечисленные."},
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
        market_estimate_mdl:a.val?Math.round(a.val*rateOf(a.cur)):null,category:`${c.ru} / ${c.subs[a.sub][0]}`,
        condition:a.cond==="new"?"новое":"б/у",city:regName(a.reg,"ru"),posted_days_ago:Math.floor((Date.now()-a.t)/864e5),seller:a.priv?"частное лицо":"компания",seller_rating:sellerOf(a).reviews?sellerOf(a).rating:null,seller_verified:sellerOf(a).verified,delivery:!!a.delivery,attrs:at,description:a.desc}; })};
  }
};

// Запасной «умный» подбор без ИИ: разбирает запрос и ранжирует по выгоде
function localAI(text){
  const s = text.toLowerCase().replace(/(\d)[\s ](?=\d{3}\b)/g,"$1").replace(/айфон/g,"iphone").replace(/самсунг/g,"samsung").replace(/сяоми|ксиаоми/g,"xiaomi");
  const W = x => new RegExp("(?<![a-zа-яёăâîșț])(?:"+x+")");
  const rules = [
    [W("электрик|сантехник|плиточ|ремонт квартир|отделк"),"serv",0],[W("грузоперевоз|переезд|грузчик|эвакуатор"),"serv",1],[W("репетитор|уроки|занятия по"),"serv",2],
    [W("удочк|удилищ|рыбалк|катушк|спиннинг|фидер|воблер|эхолот"),"sport",3],
    [W("видеокарт|placa video|gpu(?![a-z])"),"comp",3],[W("процессор|cpu(?![a-z])|ryzen|core i[3579]|core ultra"),"comp",4],
    [W("материнск|motherboard"),"comp",5],[W("оперативн|озу|ddr[345]"),"comp",6],[W("ssd|hdd|жёстк|жестк|накопител"),"comp",7],[W("блок питан|корпус для пк"),"comp",8],[W("кулер|сжо|охлажден"),"comp",9],
    [W("монитор|monitor"),"comp",10],[W("клавиатур|мышк|мышь|гарнитур"),"comp",11],[W("принтер|мфу|printer"),"comp",12],[W("роутер|router|wi-?fi|модем"),"comp",13],
    [W("игров|gaming|пк(?![а-яё])|компьютер|системник|calculator|pc(?![a-z])"),"comp",1],[W("ноутбук|laptop|macbook|лаптоп"),"comp",0],
    [W("смарт-?час|apple watch|galaxy watch|фитнес-?браслет|garmin"),"phones",2],
    [W("iphone|айфон|телефон|смартфон|telefon|samsung galaxy|pixel|redmi"),"phones",0],[W("планшет|ipad|tablet"),"phones",1],[W("телевизор|tv(?![a-z])|televizor"),"av",0],
    [W("наушник|airpods|căști"),"av",2],[W("колонк|саундбар|акустик"),"av",1],[W("фотоаппарат|объектив|камер[ау] (canon|sony|nikon)"),"av",3],[W("дрон|квадрокоптер|dji"),"av",5],[W("проектор"),"av",6],
    [W("приставк|playstation|ps5|xbox|nintendo"),"comp",14],
    [W("авиабилет|билет на самол|перел[её]т|avion"),"tour",1],[W("автобус|поезд|маршрутк"),"tour",2],[W("тур(?![а-яё])|путёвк|путевк|отдых в|all inclusive|всё включено"),"tour",0],[W("концерт|театр|опер[уа]|фестивал|билет"),"tour",3],
    [W("гитар|chitar"),"music",0],[W("пианино|синтезатор|фортепиано"),"music",1],[W("барабан|ударн"),"music",2],[W("скрипк|саксофон|укулеле"),"music",3],
    [W("свадебн[а-я]* плать|wedding"),"party",0],[W("вечерн[а-я]* плать"),"party",1],[W("букет|цвет[ыо]в(?![а-яё])|розы|пион"),"party",4],
    [W("парфюм|духи|туалетн[а-я]* вод"),"beauty",1],[W("косметик|крем|помад|тени"),"beauty",0],[W("фен|эпилятор|бритв|триммер"),"beauty",3],
    [W("знакомств|ищу (девушк|мужчин|спутни)"),"dating",0],[W("посудомо"),"appl",6],[W("бойлер|водонагрев"),"appl",7],
    [W("посуточ"),"real",3],[W("комнат[ау](?![а-яё]*\\s*(квартир))|койко-?мест"),"real",7],[W("снять дом|дом в аренду|аренда дома"),"real",8],[W("аренд|снять|сдаю|chirie"),"real",2],[W("квартир|apartament|\\d\\s*-?\\s*комн"),"real",0],[W("дом(?![а-яё])|дача|дачу|casă|casa(?![a-z])"),"real",1],[W("участ|teren"),"real",4],
    [W("мотоцикл|мото(?![а-яё])|скутер"),"auto",2],[W("грузови|camion"),"auto",1],[W("шины|шин(?![а-яё])|диски|anvelop"),"auto",7],
    [W("машин|авто(?!мат)|автомоб|mașin|masin|car(?![a-z])|toyota|bmw|volkswagen|mercedes|skoda|dacia|hyundai|kia"),"auto",0],
    [W("холодильник|frigider"),"appl",0],[W("стиральн"),"appl",1],[W("кондиционер"),"appl",3],[W("пылесос"),"appl",4],[W("коляск"),"kids",0],[W("велосипед|bicicl"),"sport",0],[W("самокат|ролики"),"sport",4],
    [W("работ|ваканс|job"),"job",0],[W("диван|мебел|шкаф|кроват"),"furn",0]];
  let cat=null, sub=null; for (const [re,c,sb] of rules) if (re.test(s)){ cat=c; sub=sb; break; }
  let budget=null, cur="MDL";
  const CURR = "(лей|леев|лея|lei|mdl|€|евро|eur|euro|\\$|долл[а-я]*|usd|ron|гривен|грн|uah)";
  const m = s.match(new RegExp("(?:за|до|бюджет[а-яёa-z]*|около|в пределах|не дороже|max|p[aâ]n[aă] la|sub|de)\\s*(\\d+(?:[.,]\\d+)?)\\s*(тыс[а-яёa-z]*|k|к|mii)?\\s*"+CURR+"?")) || s.match(new RegExp("(\\d{3,}|\\d+\\s*(?:тыс[а-яёa-z]*|k))\\s*(тыс[а-яёa-z]*|k)?\\s*"+CURR));
  if (m){ budget = parseFloat(m[1].replace(",", ".")) * (m[2]||/тыс|k/.test(m[1])?1000:1); const cu = m[3]||""; if (/€|евро|eur/.test(cu)) cur="EUR"; else if (/\$|долл|usd/.test(cu)) cur="USD"; else if (/ron/.test(cu)) cur="RON"; else if (/грн|гривен|uah/.test(cu)) cur="UAH"; }
  if (budget && !(m&&m[3]) && (cat==="auto"||cat==="real"&&sub!==3) && budget<200000) cur="EUR";
  if (cat==="real" && sub===0 && budget && cur==="EUR" && budget<=3000) sub = 2; // «квартира до 500 евро» — это аренда
  const attrs={};
  if (/автомат|automat/.test(s)) attrs.gearbox=["auto","robot","cvt"];
  if (/механик|manual/.test(s)) attrs.gearbox="manual";
  const fuels = [["diesel",/дизел|motorin/],["petrol",/бензин(?!\/)|benzin/],["hybrid",/гибрид|hibrid/],["electric",/электромоб|электро(?!вел)|electric/],["gas",/газ\b|газ\/|metan|propan/]].filter(([,re])=>re.test(s)).map(x=>x[0]);
  if (fuels.length && cat==="auto") attrs.fuel = fuels;
  if (/полн[а-яёa-z]* привод|4x4|4х4|awd|quattro|xdrive|4matic/.test(s)) attrs.drive="awd";
  const ROOMW = [["1",/(?<![а-я])(1|одн[оау][а-яёa-z]*|однушк[а-яёa-z]*)[\s-]*(комн|кімн|camer)|однушк/],["2",/(?<![а-я])(2|дв[уе][а-яёa-z]*|двушк[а-яёa-z]*)[\s-]*(комн|кімн|camer)|двушк|две комнаты/],["3",/(?<![а-я])(3|тр[её]х[а-яёa-z]*|три)[\s-]*(комн|camer)|трёшк|трешк/],["0",/студи|garsonier/]];
  if (cat==="real"){ const rr = ROOMW.filter(([,re])=>re.test(s)).map(x=>x[0]); if (rr.length) attrs.rooms = rr; }
  for (const sec of ["Центр","Ботаника","Рышкановка","Чеканы","Буюканы","Телецентр","Скулянка"]) if (s.includes(sec.toLowerCase().slice(0,5))) attrs.sector=sec;
  const sn = norm(s);
  const CITY = REG_DB.map(r=>[r[0], new RegExp("(?<![a-zа-я])(" + norm(r[1]).slice(0, Math.min(5, norm(r[1]).length-1)) + "|" + norm(r[2]).replace(/[^a-z]/g,"").slice(0,5) + ")")]);
  const city = (CITY.find(([,re])=>re.test(sn))||[])[0] || null;
  const RUMODEL = {"камри":"Camry","королл":"Corolla","рав4":"RAV4","гольф":"Golf","пассат":"Passat","туран":"Touran","тигуан":"Tiguan","октави":"Octavia","суперб":"Superb","логан":"Logan","дастер":"Duster","сандеро":"Sandero","меган":"Megane","туссан":"Tucson","спортейдж":"Sportage","фокус":"Focus","астр":"Astra","приус":"Prius","икс5":"X5","х5":"X5","икс3":"X3","х3":"X3","тройк":"3 Series","пятёрк":"5 Series","пятерк":"5 Series"};
  const BR_RU = {"бмв":"bmw","мерседес":"mercedes","мерс":"mercedes","тойот":"toyota","фольксваген":"volkswagen","vw":"volkswagen","шкод":"skoda","дачи":"dacia","ауди":"audi","лада":"lada","ваз":"lada","мазд":"mazda","хонд":"honda","ниссан":"nissan","митсубиси":"mitsubishi","мицубиси":"mitsubishi","пежо":"peugeot","ситроен":"citroen","вольво":"volvo","порше":"porsche","субару":"subaru","сузуки":"suzuki","фиат":"fiat","шевроле":"chevrolet","лексус":"lexus","тесл":"tesla","хендай":"hyundai","хюндай":"hyundai","хундай":"hyundai","киа":"kia","форд":"ford","опел":"opel","рено":"renault","ленд ровер":"land rover","рендж ровер":"land rover","джип":"jeep","инфинити":"infiniti","сеат":"seat","газ":"газ","уаз":"уаз","деу":"daewoo","джили":"geely","чери":"chery","хавал":"haval","бид":"byd"};
  const PH_BR = ["garmin","amazfit","apple","samsung","xiaomi","redmi","poco","google","pixel","oneplus","huawei","honor","motorola","nothing","oppo","realme","vivo","sony","nokia","lenovo","asus","acer","dell","hp","msi"];
  const carKeys = [...CAR_BRANDS.map(b=>b.toLowerCase().split(" (")[0]), ...Object.keys(BR_RU)].sort((a,b)=>b.length-a.length);
  const brand = (!["phones","comp"].includes(cat) ? carKeys.find(b=>new RegExp("(?<![a-zа-я])"+b.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).test(s)) : null) || ["iphone",...PH_BR].find(b=>new RegExp("(?<![a-zа-я])"+b).test(s));
  let q = "";
  if (brand==="iphone"){ cat=cat||"phones"; sub=sub??0; attrs.brand="Apple"; }
  if (brand && brand!=="iphone"){
    let bkey = BR_RU[brand] || brand; if (["redmi","poco"].includes(bkey)) bkey="xiaomi"; if (bkey==="pixel") bkey="google";
    if (!cat && CAR_BRANDS.some(b=>b.toLowerCase().startsWith(bkey))){ cat="auto"; sub=0; }
    if (!cat && Object.keys(PHONE_DB).some(b=>b.toLowerCase()===bkey)){ cat="phones"; sub=0; }
    if (!cat && ["lenovo","asus","acer","dell","hp","msi"].includes(bkey)){ cat="comp"; sub=0; }
    if (cat){ const bf = catOf(cat).fields.find(f=>f.k==="brand" && (!f.only||f.only.includes(sub)));
      const o = bf && fieldOpts(bf).find(o=>String(optV(o)).toLowerCase().startsWith(bkey)); if (o) attrs.brand=optV(o); }
  }
  if (cat==="auto" && sub===0){
    const models = attrs.brand ? CAR_MODELS[attrs.brand] : Object.values(CAR_MODELS).flat();
    let mm = models.find(m=>new RegExp("(?<![a-z0-9])"+m.toLowerCase().replace(/[-\s]/g,"[-\\s]?")+"(?![a-z0-9])").test(s));
    if (!mm){ const k = Object.keys(RUMODEL).find(k=>s.includes(k)); if (k && models.includes(RUMODEL[k])) mm = RUMODEL[k]; }
    const ser = s.match(/(?<![a-z0-9])([1-7])\s*(?:series|серии|серия|er)/); if (!mm && ser && attrs.brand==="BMW" && models.includes(ser[1]+" Series")) mm = ser[1]+" Series";
    if (mm){ attrs.model = mm; if (!attrs.brand) attrs.brand = CAR_BRANDS.find(b=>CAR_MODELS[b].includes(mm));
      const g = CAR_DB[attrs.brand][mm].find(([gg])=>new RegExp("(?<![a-z0-9])"+gg.toLowerCase()+"(?![a-z0-9])").test(s)); if (g) attrs.gen = g[0]; }
  }
  if (cat==="phones" && sub===0 && attrs.brand && PHONE_DB[attrs.brand]){ const pm = PHONE_DB[attrs.brand].slice().sort((a,b)=>b.length-a.length).find(m=>{ const ml=m.toLowerCase(); return s.includes(ml) || s.includes(ml.replace(/^(galaxy|pixel|redmi|poco|xiaomi|oneplus|honor|moto) /,"")); }); if (pm) attrs.model = pm; }
  if (!cat && /(?<![a-z0-9])(rtx|gtx|rx|arc)\s?\d{3,4}/.test(s)){ cat="comp"; sub=/видеокарт/.test(s)?3:1; }
  if (cat==="comp" && [1,3,4].includes(sub)){
    const g = GPU_ALL.slice().sort((a,b)=>b.length-a.length).find(x=>s.includes(x.toLowerCase()));
    const cp = CPU_ALL.slice().sort((a,b)=>b.length-a.length).find(x=>{ const l=x.toLowerCase().replace(/^(intel|amd) /,""); return s.includes(l) || s.includes(l.replace(/^core /,"")); });
    if (sub===1){ if (g) attrs.gpu = g; if (cp) attrs.cpu = cp; }
    if (sub===3){ if (g) attrs.gmodel = g; else { const v = /nvidia|geforce|rtx|gtx/.test(s) ? "NVIDIA" : /radeon|amd|(?<![a-z])rx/.test(s) ? "AMD" : /intel arc|arc/.test(s) ? "Intel" : null; if (v) attrs.gvendor = v; }
      const vm = s.match(/(\d{1,2})\s*(гб|gb)/); if (vm) attrs.vram = vm[1]; }
    if (sub===4){ if (cp) attrs.cmodel = cp; else { const b = /intel|core/.test(s) ? "Intel" : /amd|ryzen/.test(s) ? "AMD" : null; if (b) attrs.cbrand = b; }
      const sk = SOCKETS.find(x=>s.includes(x.toLowerCase())); if (sk) attrs.socket = sk; } }
  if (cat==="tour" && [0,1,2].includes(sub)){ const to = ["Бухарест","Стамбул","Анталья","Хургада","Рим","Милан","Париж","Лондон","Варшава","Батуми","Дубай","Будапешт","Вена","Яссы","Одесса"].find(c=>s.includes(c.toLowerCase().slice(0,5))); if (to) attrs.to = to; }
  if (cat==="serv"){ const SV = [["stype","elec",/электрик|electrician|electrician/],["stype","plumb",/сантехник/],["stype","tile",/плиточ|плитк/],["stype","turnkey",/под ключ/],["ttype","move",/переезд|грузчик/],["ttype","evac",/эвакуатор/],["subject","en",/англ/],["subject","ro",/румын/],["subject","math",/матем/]];
    SV.filter(([,,re])=>re.test(s)).forEach(([k,v])=>attrs[k]=v); }
  if (cat==="sport" && sub===3){ if (/карп/.test(s)) attrs.fstyle="carp"; if (/удочк|удилищ/.test(s)) attrs.fish="rod"; }
  const maxMDL = budget ? budget*rateOf(cur)*1.05 : null;
  let r = query({cat,sub,q,reg:city||"all",max:maxMDL??"",cur:"MDL",attrs,sort:"new"}).filter(a=>a.price>0 || cat==="serv");
  const score = a => { const ratio = a.val? a.val/a.price : 1; const power = a.val? Math.log(a.val+10) : 0;
    return (maxMDL? power*1.0 : 0) + ratio*3 + (a.cond==="new"?0.15:0) - ((Date.now()-a.t)/864e5)*0.01; };
  r.sort((a,b)=>score(b)-score(a));
  const best = r.slice(0,3);
  const ru = S.lang==="ru";
  const cc = catOf(cat), ufs = cc ? uniqFields(cc, sub) : [];
  const und = [cc ? cc[S.lang] + (sub!=null ? " › " + subName(cc,sub) : "") : null,
    ...Object.entries(attrs).map(([k,v])=>{ const f = ufs.find(x=>x.k===k); return f ? (f.t==="bool" ? f[S.lang] : fmtAttr(f,v)) : null; }),
    budget ? (ru?"до ":"până la ")+fmtN(budget)+" "+curS(cur) : null, city ? regName(city) : null].filter(Boolean);
  const got = und.length ? (ru?"Понял так: ":"Am înțeles: ") + und.join(" · ") + ".\n" : "";
  if (!best.length) return {text: got + (ru? "Подходящих объявлений сейчас нет — ничего выдумывать не буду. Попробуйте увеличить бюджет, убрать часть условий или сохраните поиск, чтобы узнать о новых объявлениях." : "Momentan nu sunt anunțuri potrivite — nu voi inventa nimic. Încearcă un buget mai mare, mai puține condiții sau salvează căutarea."), ids:[], q:{cat,sub,attrs,max:maxMDL}};
  const why = a => { const parts=[]; if (a.val && a.price<a.val*.93) parts.push(ru?`дешевле рынка ~на ${Math.round((1-a.price/a.val)*100)}%`:`cu ~${Math.round((1-a.price/a.val)*100)}% sub piață`);
    const sp=specLine(a); if(sp) parts.push(sp); parts.push(a.cond==="new"?(ru?"новое":"nou"):(ru?"б/у":"folosit")); return parts.join(", "); };
  const head = ru ? `Нашёл ${r.length} подходящих объявлений${budget?` в бюджете до ${fmtN(budget)} ${curS(cur)}`:""}. Лучшие по соотношению цена/качество:` :
                    `Am găsit ${r.length} anunțuri potrivite${budget?` cu buget până la ${fmtN(budget)} ${cur==="EUR"?"€":"lei"}`:""}. Cele mai bune după raportul preț/calitate:`;
  const lines = best.map((a,i)=>`${i+1}. **${a.title}** — ${fmtN(a.price)} ${curS(a.cur)}: ${why(a)}.`);
  return {text: got+head+"\n"+lines.join("\n"), ids: best.map(a=>a.id), q:{cat,sub,attrs,max:maxMDL}};
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

