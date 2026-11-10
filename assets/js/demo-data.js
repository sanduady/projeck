/* Project — демо-объявления (заменяются данными с сервера) */
let seed = 11; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const ri = (a,b) => a + Math.floor(R()*(b-a+1));
const pick = a => a[Math.floor(R()*a.length)];
const said = arr => arr[Math.floor(R()*arr.length)];
const take = (arr, n) => { const c = arr.slice(), out=[]; while (out.length<n && c.length) out.push(c.splice(Math.floor(R()*c.length),1)[0]); return out; };
const r100 = n => Math.round(n/100)*100, r10 = n => Math.round(n/10)*10, r500 = n => Math.round(n/500)*500;
const NOW = Date.now();
const DESCS = {
 used:["Состояние отличное, всё работает. Торг уместен.","Продаю в связи с переездом. Возможен обмен.","Один владелец, без вложений. Покажу в удобное время.","Есть мелкие следы использования, на работу не влияют.","Обслуживался вовремя, все документы на руках."],
 new:["Новое, в упаковке, с гарантией и чеком.","Новое, не подошло по размеру/цвету. Возможна доставка.","Магазин. Гарантия 12 месяцев, доставка по Молдове."]};
const NAMES = ["Андрей","Мария","Ion","Елена","Victor","Наталья","Sergiu","Ольга","Mihai","Дмитрий","Ana","Игорь","Cristina","Павел"];
let ADS = [], uid = 1;
function add(o){
  const cond = o.cond || (R()<.3?"new":"used");
  ADS.push(Object.assign({id:uid++, cur:"MDL", val:0, reg: R()<.5?"chi": R()<.6 ? REG[2+Math.floor(R()*9)][0] : REG[2+Math.floor(R()*(REG.length-2))][0],
    cond, priv:R()<.72, photos: R()<.9?ri(1,14):0, t: NOW - Math.floor(R()*14*864e5), views:ri(5,3200), top:R()<.06,
    desc:pick(DESCS[cond]), name:pick(NAMES), phone:"+373 6"+ri(0,9)+" "+ri(100,999)+" "+ri(100,999), imgs:[], attrs:{}}, o, {cond}));
}
// --- Transport
(function(){
  const POPULAR=["Toyota","Volkswagen","BMW","Mercedes-Benz","Skoda","Dacia","Renault","Hyundai","Kia","Ford","Opel","Audi","Lexus","Mazda","Honda","Nissan","Peugeot","Mitsubishi","Volvo","Lada (ВАЗ)"];
  const BW = [...CAR_BRANDS, ...POPULAR, ...POPULAR, ...POPULAR];
  for(let i=0;i<260;i++){
    const b = pick(BW), m = pick(CAR_MODELS[b]), gens = CAR_DB[b][m], gi = Math.floor(R()*gens.length), [g, yrs] = gens.length ? gens[gi] : [null, "2005–2024"];
    const old = /ГАЗ|УАЗ|ЗАЗ|Москвич|Daewoo|Rover|Saab/.test(b) || /^(2101|2104|2105|2106|2107|2109|21099|2110|2112|2114|2115|24 Волга|3110|31105|412|2140|2141|469)$/.test(m);
    const y0 = Math.max(old?1985:2005, +yrs.slice(0,4)), y1 = Math.min(2024, yrs.endsWith("–") ? 2024 : +yrs.slice(-4)), year = ri(y0, Math.max(y0,y1));
    const cls = CAR_CLASS(b);
    const body = SUV_RE.test(m) ? "suv" : VAN_RE.test(m) ? "van" : HATCH_RE.test(m) ? (R()<.15?"wagon":"hatch") : /Passat|Octavia|Superb|A4|A6|Insignia|Mondeo|V\d0|Avensis|Laguna|508|Outback|Legacy|Largus/.test(m) ? (R()<.5?"wagon":"sedan") : /Mustang|Camaro|Challenger|911|4 Series|TT|MX-5/.test(m) ? "coupe" : /Hilux|L200|Navara|Ranger|RAM|Wingle|Poer/.test(m) ? "pickup" : "sedan";
    const fuel = (b==="Tesla"||/^(Leaf|i3|iX|e-tron|Zoe|Spring|ID\.3|ID\.4|Enyaq|Born|EV6|Taycan|Atto 3|Dolphin|Han|Seal|MG4|Bolt)$/.test(m)) ? "electric" : (b==="Toyota"||b==="Lexus") && R()<.55 ? "hybrid" : cls==="bud" && R()<.35 ? "gas" : R()<.5 ? "diesel" : "petrol";
    const engine = fuel==="electric" ? null : pick(cls==="prem" ? [2.0,2.0,2.5,3.0] : cls==="bud" ? [0.9,1.2,1.4,1.5,1.6] : [1.4,1.5,1.6,2.0,2.0,2.5]);
    const power = fuel==="electric" ? pick([283,351,460]) : Math.round(engine*(fuel==="diesel"?68:76)*(.85+R()*.3)*(cls==="prem"?1.35:1));
    const gearbox = fuel==="electric" ? "auto" : fuel==="hybrid" ? "cvt" : cls==="prem" ? (R()<.92?"auto":"manual") : pick(["manual","manual","auto","robot","cvt"]);
    const drive = body==="suv" ? (R()<.6?"awd":"fwd") : (b==="BMW"||b==="Mercedes-Benz"||b==="Lexus") && body!=="hatch" ? (R()<.55?"rwd":"awd") : b==="Audi" ? (R()<.5?"awd":"fwd") : "fwd";
    const mileage = Math.round((2025-year)*ri(9,24))*1000;
    const base = (cls==="prem"?46000:cls==="bud"?17000:27000)*(body==="suv"?1.25:1);
    const val = r100(base*Math.pow(0.89,2025-year)*(gearbox==="manual"?.95:1.03)*(1-Math.max(0,mileage-150000)/1e6));
    const damage = R()<.88 ? "ok" : R()<.75 ? "dmg" : "parts";
    const price = r100(val*(0.8+R()*0.38)*(damage==="ok"?1:damage==="dmg"?.7:.45));
    const nOpts = Math.min(CAR_OPTS.length, 2 + Math.floor((year-2004)/3) + (cls==="prem"?3:0));
    const opts = take(CAR_OPTS.map(o=>o[0]), nOpts);
    const fuelL = lbl(FUEL,fuel).toLowerCase(), gearL = lbl(GEAR,gearbox).toLowerCase();
    add({cat:"auto",sub:0,title:`${b} ${m}${g?" "+g:""}, ${year}, ${engine?engine.toFixed(1)+" ":""}${fuelL}, ${gearL}${damage!=="ok"?(damage==="dmg"?", после ДТП":", на запчасти"):""}`,cur:"EUR",price,val,cond:"used",
      attrs:{brand:b,model:m,...(g?{gen:g}:{}),year,mileage,fuel,...(engine?{engine}:{}),power,gearbox,drive,body,color:pick(COLORS)[0],wheel:R()<.97?"left":"right",damage,
        owners:pick(["1","2","2","3"]),reg:R()<.8?"md":R()<.6?"foreign":R()<.6?"tr":"none",trade:R()<.25,credit:cls!=="bud"&&R()<.15,opts}});
  }
  const trucks=[["Mercedes-Benz","Sprinter",14000],["MAN","TGX 18.440",32000],["DAF","XF 480",35000],["Iveco","Daily",12000],["Volkswagen","Crafter",15000],["Ford","Transit",11000]];
  for(let i=0;i<12;i++){const [b,m,base]=pick(trucks),year=ri(2008,2021),mileage=(2025-year)*ri(40,110)*1000,val=r100(base*Math.pow(.9,2022-year));
    add({cat:"auto",sub:R()<.35&&(m==="Sprinter"||m==="Crafter"||m==="Transit")?3:1,title:`${b} ${m} ${year}, ${R()<.5?"грузовой":"тент"}`,cur:"EUR",price:r100(val*(0.85+R()*.3)),val,cond:"used",attrs:{brand:b,year,mileage,fuel:"diesel",gearbox:R()<.6?"manual":"auto"}});}
  const moto=[["Honda","CB500F",5500],["Yamaha","MT-07",6500],["Kawasaki","Ninja 650",6200],["BMW","R 1250 GS",16000],["Suzuki","V-Strom 650",6000],["Yamaha","Aerox 50 (скутер)",1200]];
  for(let i=0;i<10;i++){const [b,m,base]=pick(moto),year=ri(2012,2023),val=r100(base*Math.pow(.92,2024-year));
    add({cat:"auto",sub:2,title:`${b} ${m}, ${year}`,cur:"EUR",price:r100(val*(.85+R()*.3)),val,cond:"used",attrs:{brand:b,year,mileage:(2025-year)*ri(2,6)*1000}});}
  [["Микроавтобус Mercedes Sprinter 516, 20 мест",3,"EUR",21500],["Volkswagen Crafter пассажирский 2017",3,"EUR",18900],["Автобус Iveco Daily 50C, 2015",3,"EUR",16500],["Экскаватор-погрузчик JCB 3CX 2012",4,"EUR",38000],["Мини-погрузчик Bobcat S175",4,"EUR",17500],["Прицеп легковой 2×1.3 м, документы",5,"MDL",14000],["Прицеп для лодки, усиленный",5,"MDL",19000],
   ["Фара левая Skoda Octavia A7, оригинал",6,"MDL",2300],["Двигатель 1.9 TDI в сборе, VW",6,"MDL",18000],["Тормозные колодки Bosch, Passat B8",6,"MDL",650],["Аккумулятор Varta 74Ah, новый",6,"MDL",1900],["Коробка передач DSG7, Golf 7",6,"MDL",12500],
   ["Зимние шины Michelin 205/55 R16, 4 шт",7,"MDL",5200],["Литые диски R17 5×112, оригинал Audi",7,"MDL",8900],["Летние шины Continental 225/45 R17",7,"MDL",6800],["Моторная лодка Казанка + мотор Yamaha 30",8,"EUR",4200],["Автодом Fiat Ducato, 6 спальных мест, 2016",9,"EUR",38500],["Кемпер Volkswagen California, 2014",9,"EUR",29900],["Прицеп-дача, 4 места, с кухней",9,"EUR",7900],["Гидроцикл Sea-Doo Spark 2019",8,"EUR",6900]]
   .forEach(([t,sub,cur,price])=>add({cat:"auto",sub,title:t,cur,price,cond:/новый|оригинал/.test(t)&&R()<.5?"new":"used"}));
})();
// --- Real estate
(function(){
  const sec=[["Центр",1450],["Ботаника",1100],["Рышкановка",1050],["Чеканы",1000],["Буюканы",1150],["Телецентр",1050],["Скулянка",950]];
  const sf={euro:1.12,white:.86,grey:.78,needs:.8};
  for(let i=0;i<75;i++){
    const [s,rate]=pick(sec), rooms=ri(1,4), area=[0,38,56,74,98][rooms]+ri(-6,12), building=R()<.5?"new":"old";
    const state = building==="new"&&R()<.5 ? pick(["white","grey"]) : pick(["euro","euro","needs","white"]);
    const maxf = building==="new"?ri(9,18):pick([5,9,9,10]), floor=ri(1,maxf);
    const val = r500(area*rate*sf[state]*(building==="new"?1:.94)*(floor===1||floor===maxf?.94:1));
    add({cat:"real",sub:0,reg:"chi",title:`${rooms}-комн. квартира, ${s}, ${area} м², ${floor}/${maxf} эт.`,cur:"EUR",price:r500(val*(.85+R()*.32)),val,cond:building==="new"?"new":"used",
      attrs:{rooms:String(rooms),area,floor,sector:s,state,building}});
  }
  for(let i=0;i<10;i++){const area=ri(70,260),land=ri(4,15),place=pick(["Ставчены","Дурлешты","Трушены","Кодру","Бубуечь","Ватра","Гидигич"]);
    const val=r500(area*ri(520,780)+land*2500); add({cat:"real",sub:1,reg:"chi",title:`Дом ${area} м², ${place}, ${land} соток`,cur:"EUR",price:r500(val*(.88+R()*.28)),val,cond:"used",attrs:{area,land,state:pick(["euro","white","grey","needs"])}});}
  for(let i=0;i<16;i++){const [s]=pick(sec),rooms=ri(1,3),area=[0,40,58,76][rooms]+ri(-4,8),floor=ri(1,12),val=r10(120+rooms*110+(s==="Центр"?120:0));
    add({cat:"real",sub:2,reg:"chi",title:`Сдаю ${rooms}-комн. квартиру, ${s}, ${area} м², длительно`,cur:"EUR",price:r10(val*(.85+R()*.3)),val,cond:"used",attrs:{rooms:String(rooms),area,floor,sector:s}});}
  for(let i=0;i<6;i++){const [s]=pick(sec),rooms=ri(1,2);add({cat:"real",sub:3,reg:"chi",title:`Посуточно ${rooms}-комн., ${s}, Wi-Fi, парковка`,price:r100(ri(500,1300)),cond:"used",attrs:{rooms:String(rooms),area:30+rooms*18,sector:s}});}
  for(let i=0;i<7;i++){const land=ri(6,40);add({cat:"real",sub:4,title:`Участок ${land} соток под строительство, ${pick(["Дурлешты","Кодру","Цынцарены","Бачой","Яловены"])}`,cur:"EUR",price:r500(land*ri(1500,4000)),cond:"used",attrs:{land}});}
  for(let i=0;i<5;i++){const area=ri(40,400);add({cat:"real",sub:5,reg:"chi",title:`${pick(["Офис","Торговое помещение","Склад","Помещение под кафе"])} ${area} м², ${pick(sec)[0]}`,cur:"EUR",price:r500(area*ri(700,1400)),cond:"used",attrs:{area}});}
  for(let i=0;i<3;i++) add({cat:"real",sub:6,reg:"chi",title:`Гараж ${ri(18,30)} м², ${pick(sec)[0]}, с ямой`,cur:"EUR",price:r100(ri(4000,12000)),cond:"used"});
})();
// --- Electronics
(function(){
  const TIER={"Apple":17000,"Samsung":12000,"Google":10000,"Xiaomi":7000,"OnePlus":9000,"Huawei":8000,"Honor":7000,"Motorola":5500,"Nothing":7000,"Oppo":6000,"Realme":5000,"Vivo":5500,"Sony":9000,"Nokia":3000};
  const phonePrice = (b,m) => { const list=PHONE_DB[b], i=list.indexOf(m), age=.45+1.0*i/Math.max(1,list.length-1);
    const k = /Ultra|Pro Max|Fold/.test(m)?1.6 : /Pro|Plus|Flip|Air/.test(m)?1.3 : /mini|SE|16e|FE|Lite|\ba\b|\d+a$|Redmi \d|C\d|A1|A2|A3|G\d/.test(m)?.7 : 1;
    return Math.round(TIER[b]*age*k/100)*100; };
  const PH_RAM = m => /Ultra|Pro Max|Fold|Pro/.test(m) ? pick([8,12]) : pick([4,6,8]);
  const PHW = [...Object.keys(PHONE_DB), "Apple","Apple","Apple","Samsung","Samsung","Xiaomi","Xiaomi"];
  for(let i=0;i<90;i++){ const b=pick(PHW), m=pick(PHONE_DB[b]), st=pick([64,128,128,256,256,512]), cond=R()<.25?"new":"used";
    const val=r100(phonePrice(b,m)*(st===256?1.12:st===512?1.3:st===64?.85:1)*(cond==="new"?1.08:.78));
    add({cat:"elec",sub:0,title:`${b==="Apple"||m.startsWith(b)||/^(Redmi|POCO|Galaxy|Pixel|Xperia|Moto|Nord)/.test(m)?"":b+" "}${/^Galaxy|^Pixel/.test(m)?b+" ":""}${m} ${st}GB${cond==="new"?", новый":""}`,price:r100(val*(.86+R()*.3)),val,cond,
      attrs:{brand:b,model:m,ram:PH_RAM(m),storage:String(st)}});}
  const laps=[["Apple","MacBook Air 13 M2",16500,8,256,"Apple M2"],["Apple","MacBook Air 15 M3",22500,8,512,"Apple M3"],["Apple","MacBook Pro 14 M3 Pro",34000,18,512,"Apple M3 Pro"],
   ["Lenovo","ThinkPad T14 Gen 3",11500,16,512,"Intel Core i5-1245U"],["Lenovo","Legion 5 RTX 4060",21000,16,1000,"AMD Ryzen 7 7840HS"],["Lenovo","IdeaPad 5",9500,16,512,"AMD Ryzen 5 7530U"],
   ["ASUS","ROG Strix G16 RTX 4070",28000,16,1000,"Intel Core i7-13650HX"],["ASUS","TUF Gaming F15 RTX 3050",13000,16,512,"Intel Core i5-11400H"],["ASUS","Zenbook 14 OLED",15500,16,512,"Intel Core Ultra 5"],
   ["HP","Pavilion 15",9800,16,512,"Intel Core i5-1335U"],["HP","Victus 16 RTX 4060",19500,16,512,"AMD Ryzen 7 7840HS"],["Acer","Nitro 5 RTX 3060",15500,16,512,"Intel Core i5-12500H"],["Acer","Aspire 3",6500,8,256,"Intel Core i3-1215U"],["Dell","XPS 13 Plus",24000,16,512,"Intel Core i7-1360P"]];
  for(let i=0;i<24;i++){const [b,m,base,ram,st,cpu]=pick(laps),cond=R()<.3?"new":"used",val=r100(base*(cond==="new"?1.05:.76));
    add({cat:"elec",sub:1,title:`${b} ${m}, ${ram}/${st>=1000?"1TB":st+"GB"}${cond==="new"?", новый":""}`,price:r100(val*(.85+R()*.3)),val,cond,attrs:{brand:b,ram,storage:st,cpu}});}
  // PCs — главный полигон для ИИ
  const cpuV={"Intel Core i3-12100F":1500,"AMD Ryzen 5 5600":2000,"Intel Core i5-12400F":2300,"AMD Ryzen 5 7600":3600,"Intel Core i5-13600K":5000,"AMD Ryzen 7 5800X3D":5600,"Intel Core i7-13700K":7000,"AMD Ryzen 7 7800X3D":7600,"Intel Core i9-13900K":9800};
  const gpuV={"GTX 1660 Super":2600,"RX 6600":3500,"RTX 3060":4500,"RX 7600":4800,"RTX 4060":5800,"RTX 3070":6400,"RTX 4060 Ti":7600,"RX 7800 XT":9600,"RTX 4070":10800,"RTX 4070 Super":12400,"RTX 4080 Super":19500};
  const PC_CPU=["Intel Core i3-12100F","AMD Ryzen 5 5600","Intel Core i5-12400F","AMD Ryzen 5 7600","Intel Core i5-13600K","AMD Ryzen 7 5800X3D","Intel Core i7-13700K","AMD Ryzen 7 7800X3D","Intel Core i9-13900K"];
  const PC_GPU=["GTX 1660 Super","RX 6600","RTX 3060","RX 7600","RTX 4060","RTX 3070","RTX 4060 Ti","RX 7800 XT","RTX 4070","RTX 4070 Super","RTX 4080 Super"];
  const tiers=[[0,3,0,3],[1,5,1,5],[2,6,3,7],[3,7,4,9],[4,8,6,10]];
  for(let i=0;i<46;i++){
    const tr=pick(tiers), cpu=PC_CPU[ri(tr[0],tr[1])], gpu=PC_GPU[ri(tr[2],tr[3])];
    const ram=pick([16,16,32,32,64]), storage=pick([512,1000,1000,2000]), cond=R()<.25?"new":"used";
    const val=r100((cpuV[cpu]+gpuV[gpu]+ram*55+storage*1.1+3200)*(cond==="new"?1.08:.8));
    const price=r100(val*(.78+R()*.42));
    const kind = gpuV[gpu]>=4500 ? "Игровой ПК" : pick(["ПК","Системный блок","Компьютер"]);
    add({cat:"elec",sub:2,title:`${kind}: ${cpu.replace(/^(Intel Core |AMD )/,"")} / ${gpu} / ${ram}GB / ${storage>=1000?(storage/1000)+"TB":storage+"GB"} SSD${cond==="new"?", новый":""}`,price,val,cond,
      desc: pick(cond==="new"?["Новая сборка, гарантия 2 года, Windows 11.","Собран под заказ, тесты в играх по запросу."]:["Сборка 2023 года, ни разу не разгонялся. Причина продажи — переезд.","Использовался для работы и игр, чистил от пыли полгода назад.","Отдам с монитором за доплату. Торг."]),
      attrs:{cpu,gpu,ram,storage}});
  }
  [["Apple","iPad Air M2 11\"",11500,8,128],["Samsung","Galaxy Tab S9",9800,8,128],["Xiaomi","Pad 6",4900,8,256],["Apple","iPad 10.9 2022",6900,4,64]].forEach(([b,m,p,ram,st])=>{for(let k=0;k<2;k++)add({cat:"elec",sub:3,title:`${b==="Apple"?"":b+" "}${m}, ${st}GB`,price:r100(p*(.8+R()*.3)),attrs:{brand:b,ram,storage:st}});});
  [["LG","OLED C3",55,19900],["Samsung","QLED Q80C",65,21500],["Sony","Bravia X85L",55,15900],["Xiaomi","TV A Pro",43,5400],["Samsung","Crystal UHD",50,7200],["LG","NanoCell",65,14500]].forEach(([b,m,sc,p])=>add({cat:"elec",sub:4,title:`Телевизор ${b} ${m} ${sc}"`,price:r100(p*(.85+R()*.25)),attrs:{brand:b,screen:sc}}));
  [["Наушники Sony WH-1000XM5",4200],["AirPods Pro 2",3600],["Колонка JBL Charge 5",2100],["Саундбар Samsung HW-Q600C",5200],["Виниловый проигрыватель Audio-Technica LP60X",3300]].forEach(([t,p])=>add({cat:"elec",sub:5,title:t,price:p}));
  [["Canon EOS R6, body, пробег 12k",1350,"EUR"],["Sony A7 III + 28-70",1200,"EUR"],["Объектив Sigma 35mm f/1.4 Art (Canon)",8900,"MDL"],["Экшн-камера GoPro HERO12",5900,"MDL"],["Дрон DJI Mini 4 Pro",13500,"MDL"]].forEach(([t,p,c])=>add({cat:"elec",sub:6,title:t,price:p,cur:c}));
  [["PlayStation 5 Slim + 2 джойстика",8900],["Xbox Series X 1TB",8200],["Nintendo Switch OLED",5600],["Steam Deck OLED 512GB",9500],["PlayStation 4 Pro 1TB",3800]].forEach(([t,p])=>add({cat:"elec",sub:7,title:t,price:r100(p*(.85+R()*.25))}));
  ["RTX 3060","RTX 4060","RTX 4070","RX 6600","RTX 3070"].forEach(g=>add({cat:"elec",sub:8,title:`Видеокарта ${g}`,price:r100(gpuV[g]*(.75+R()*.3)),val:Math.round(gpuV[g]*.85),attrs:{gpu:g}}));
  [["Монитор Samsung Odyssey G5 27\" 165Hz",4300],["SSD Samsung 990 Pro 2TB",3500],["Оперативная память Kingston Fury 32GB DDR5",2200],["Блок питания Corsair RM750e",1900]].forEach(([t,p])=>add({cat:"elec",sub:8,title:t,price:p}));
})();
// --- Other categories: [sub, title, price, cur?, attrs?]
const LIST = {
 job:[[0,"Требуется продавец-консультант в магазин электроники",12000,0,{schedule:"shift",sphere:"sales"}],[0,"Водитель категории CE, международные рейсы",1900,"EUR",{schedule:"full",sphere:"transport"}],
  [0,"Junior frontend-разработчик (React)",900,"EUR",{schedule:"remote",sphere:"it"}],[0,"Повар горячего цеха, ресторан в центре",15000,0,{schedule:"shift",sphere:"food"}],[0,"Бригада плиточников на объект",25000,0,{schedule:"full",sphere:"build"}],
  [0,"Офис-менеджер со знанием румынского и английского",13000,0,{schedule:"full",sphere:"office"}],[0,"Senior Java Developer, гибрид",3200,"EUR",{schedule:"remote",sphere:"it"}],[0,"Курьер с личным авто",11000,0,{schedule:"part",sphere:"transport"}],
  [1,"Бухгалтер, опыт 8 лет, 1С",0,0,{schedule:"full",sphere:"office"}],[1,"Ищу работу водителем кат. B, C",0,0,{schedule:"full",sphere:"transport"}],[1,"QA-инженер, ищу удалённую работу",0,0,{schedule:"remote",sphere:"it"}],
  [2,"Промоутер на выходные, 150 лей/час",150,0,{schedule:"part",sphere:"sales"}],[2,"Подработка: сборка мебели вечером",8000,0,{schedule:"part",sphere:"build"}]],
 home:[[0,"Угловой диван раскладной, серый велюр",7500,0,{material:"fabric"}],[0,"Шкаф-купе 2.2 м с зеркалом",5200,0,{material:"chip"}],[0,"Кровать 160×200 с ортопедическим матрасом",6000,0,{material:"wood"}],[0,"Комод из массива дуба",4800,0,{material:"wood"}],[0,"Кресло-реклайнер, кожа",3900,0,{material:"fabric"}],[0,"Стеллаж в стиле лофт",1700,0,{material:"metal"}],
  [1,"Кухонный гарнитур 2.6 м с мойкой и столешницей",14500,0,{material:"chip"}],[1,"Обеденный стол + 4 стула, дуб",4300,0,{material:"wood"}],[2,"Люстра хрустальная, 8 рожков",2600],[2,"Торшер лофт, чёрный",900],
  [3,"Ковёр 2×3 м, шерсть",1800],[3,"Зеркало напольное 80×180",1500],[4,"Газонокосилка Bosch Rotak 37",2900],[4,"Мангал кованый с крышей",3500],[4,"Садовая мебель из ротанга, комплект",7900],[5,"Шторы блэкаут, 2 шт по 3 м",850]],
 appl:[[0,"Холодильник Samsung No Frost, 2 м",8900,0,{brand:"Samsung"}],[0,"Холодильник LG DoorCooling+",11500,0,{brand:"LG"}],[0,"Холодильник Beko, 1.8 м",5200,0,{brand:"Beko"}],
  [1,"Стиральная машина Bosch Serie 6, 8 кг",6200,0,{brand:"Bosch"}],[1,"Стиральная машина LG 9 кг, паровая",7400,0,{brand:"LG"}],[1,"Стиральная машина Electrolux 7 кг",4300,0,{brand:"Electrolux"}],
  [2,"Духовой шкаф Bosch Serie 4",6900,0,{brand:"Bosch"}],[2,"Газовая плита Beko 4 конфорки",3800,0,{brand:"Beko"}],[3,"Кондиционер Gree 12 BTU с установкой",9500,0,{brand:"Gree"}],[3,"Кондиционер Samsung WindFree 9 BTU",11500,0,{brand:"Samsung"}],
  [4,"Робот-пылесос Xiaomi S10+",6900,0,{brand:"Xiaomi"}],[4,"Пылесос Philips PowerPro",1900,0,{brand:"Philips"}],[5,"Кофемашина Philips 3200 LatteGo",7800,0,{brand:"Philips"}],[5,"Микроволновка Samsung, гриль",1500,0,{brand:"Samsung"}]],
 cloth:[[0,"Пуховик женский, новый",1500,0,{size:"M"}],[0,"Платье вечернее, один раз",1200,0,{size:"S"}],[0,"Пальто шерстяное бежевое",2400,0,{size:"L"}],[1,"Костюм мужской классика",2200,0,{size:"L"}],[1,"Куртка зимняя The North Face",3200,0,{size:"XL"}],[1,"Джинсы Levi's 501",700,0,{size:"M"}],
  [2,"Кроссовки Nike Air Max 90",1900,0,{shoe:43}],[2,"Сапоги зимние кожаные",1300,0,{shoe:38}],[2,"Ботинки Timberland",2500,0,{shoe:44}],[3,"Сумка кожаная, Италия",1600],[3,"Часы Casio G-Shock",1400]],
 kids:[[0,"Коляска 2в1 Cybex, полный комплект",7500,0,{age:"0"}],[0,"Прогулочная коляска Yoyo",4200,0,{age:"1"}],[1,"Автокресло 0–18 кг, isofix",2100,0,{age:"0"}],[1,"Автокресло-бустер 15–36 кг",900,0,{age:"3"}],
  [2,"Конструктор LEGO Technic 42143",1400,0,{age:"7"}],[2,"Детский электромобиль",3500,0,{age:"3"}],[3,"Кроватка с маятником + матрас",1800,0,{age:"0"}],[3,"Двухъярусная кровать",5900,0,{age:"7"}],[4,"Комбинезон зимний 92 см",450,0,{age:"1"}]],
 build:[[0,"Газоблок 600×300×200, паллет",2700],[0,"Металлочерепица, за м², доставка",145],[0,"Ламинат 33 класс, 24 м²",3100],[1,"Перфоратор Makita HR2470",1900],[1,"Шуруповёрт DeWalt 18V, 2 АКБ",2600],[1,"Бетономешалка 180 л",4200],
  [2,"Смеситель Grohe для ванной",1600],[2,"Унитаз подвесной с инсталляцией",3900],[3,"Кабель ВВГ 3×2.5, бухта 100 м",2400],[4,"Окна ПВХ под заказ, замер бесплатно",2500],[4,"Входная дверь металлическая",5500]],
 serv:[[0,"Ремонт квартир под ключ, гарантия",0],[0,"Укладка плитки, опыт 15 лет",250],[1,"Грузоперевозки, грузчики, 24/7",300],[1,"Переезды по Молдове и в Румынию",0],[2,"Репетитор по английскому, онлайн",250],[2,"Подготовка к БАК по математике",300],
  [3,"Маникюр с выездом на дом",200],[3,"Стрижка и окрашивание",400],[4,"Создание сайтов и интернет-магазинов",0],[4,"Настройка компьютеров и сетей",300],[5,"Ремонт стиральных машин на дому",350],[5,"Ремонт телефонов, замена экрана",500],[6,"Уборка квартир и офисов",600]],
 pets:[[0,"Щенки лабрадора, с документами",9000],[0,"Щенки немецкой овчарки",6500],[1,"Британские котята, привиты",2500],[1,"Мейн-кун, котёнок",6000],[2,"Волнистые попугаи",250],[3,"Аквариум 120 л с оборудованием",1700],[4,"Переноска для кошки + лежак",500],[4,"Корм Royal Canin 15 кг",1450]],
 sport:[[6,"Карповое удилище 3.6 м, 3.5 lb, комплект из 2 шт",1400],[6,"Фидерное удилище 3.9 м с тремя вершинками",900],[6,"Катушка для фидера и карпа, байтраннер",1100],
   [6,"Эхолот беспроводной для берега и лодки",3200],[6,"Набор воблеров и блёсен, 30 шт",450],[6,"Лодка ПВХ 2.8 м + мотор 5 л.с.",9800],[6,"Спиннинг 2.4 м, тест 5–25 г",700],
   [0,"Велосипед Trek Marlin 7, рама L",11000],[0,"Велосипед детский 20\"",1600],[0,"Электровелосипед Xiaomi",9500],[1,"Беговая дорожка Kettler",8500],[1,"Гантели разборные 2×20 кг",1300],[2,"Палатка 4-местная Coleman",2100],
  [3,"Сноуборд Burton 155 + крепления",4500],[3,"Горные лыжи Atomic 170",3800],[4,"Гитара Yamaha F310 + чехол",2400],[4,"Цифровое пианино Casio CDP-S110",6200],[5,"Книги, фантастика, 40 шт.",600]],
 agro:[[0,"Трактор МТЗ-82 1998, рабочий",9500,"EUR"],[0,"Мотоблок Нева МБ-2",14500],[0,"Плуг 3-корпусный",12000],[1,"Пшеница фуражная, тонна",3800],[1,"Вино домашнее, Изабелла, литр",30],[1,"Мёд акациевый, 3 л",450],
  [2,"Корова дойная, 4 года",22000],[2,"Цыплята бройлеры, суточные",25],[3,"Саженцы черешни и абрикоса",80],[4,"Комбикорм для кур, мешок 40 кг",420]],
 biz:[[0,"Кофемашина La Marzocco, 2 группы",3900,"EUR"],[0,"Холодильная витрина 1.5 м",12000],[0,"Печь для пиццы конвейерная",4500,"EUR"],[1,"Готовый бизнес: кофейня в центре",35000,"EUR"],[1,"Автомойка самообслуживания",60000,"EUR"],[2,"Помещение 60 м² на первой линии, аренда",900,"EUR"]],
 free:[[0,"Отдам детские вещи 1–2 года, пакет",0],[0,"Отдам книги и журналы",0],[1,"Отдам старый диван, самовывоз",0],[1,"Отдам шкаф, нужен самовывоз",0],[2,"Отдам котёнка в добрые руки",0],[2,"Отдам щенка, привит",0]],
 misc:[[0,"Коллекция монет СССР, 120 шт.",3500],[0,"Марки Молдовы 1991–2000",1200],[1,"2 билета на концерт, Арена Кишинёв",1200],[1,"Билет Кишинёв — Бухарест, на завтра",450],[2,"Пиротехника к празднику, оптом",0],[2,"Подарочные сертификаты в спа",900]]
};
for (const [cat,items] of Object.entries(LIST)) for (let rep=0; rep<2; rep++) for (const [sub,title,price,cur,attrs] of items){
  if (rep && R()<.5) continue;
  const p = price===0?0: price<100?price: r10(price*(rep?(.85+R()*.3):1));
  add({cat,sub,title,price:p,cur:cur==="EUR"?"EUR":"MDL",attrs:attrs||{},cond:cat==="serv"||cat==="job"||cat==="free"?"used":undefined,priv:cat==="serv"?R()<.3:undefined});
}
ADS.forEach(a=>{ if(a.priv===undefined) a.priv=R()<.7; });


/* ---- Подробные демо-объявления: оригинальные тексты, написанные для макета (не взяты с других сайтов) ---- */
const RICH = [
 {cat:"auto",sub:0,title:"Volkswagen Golf 7 2016, 1.6 TDI, механика",price:9800,cur:"EUR",val:10600,cond:"used",reg:"chi",attrs:{brand:"Volkswagen",model:"Golf",gen:"Mk7",year:2016,mileage:198000,fuel:"diesel",engine:1.6,power:110,gearbox:"manual",drive:"fwd",body:"hatch",color:"blue",wheel:"left",damage:"ok",owners:"2",reg:"md",trade:false,credit:false,opts:["ac","cruise","park","carplay","heat"]},
  desc:"Привезена из Германии в 2021 году, с тех пор я единственный владелец в Молдове. Расход по трассе около 4,5 л, по городу 5,5.\nВ прошлом месяце поменял ГРМ, помпу и все фильтры, чеки сохранены. Зимняя резина на дисках в подарок.\nКузов без ржавчины, перекрашено только заднее правое крыло после мелкой царапины. Торг у машины."},
 {cat:"auto",sub:0,title:"Toyota RAV4 2019, 2.5 гибрид, полный привод",price:27500,cur:"EUR",val:28900,cond:"used",reg:"chi",attrs:{brand:"Toyota",model:"RAV4",gen:"XA50",year:2019,mileage:86000,fuel:"hybrid",engine:2.5,power:218,gearbox:"cvt",drive:"awd",body:"suv",color:"silver",wheel:"left",damage:"ok",owners:"1",reg:"md",trade:false,credit:true,opts:["climate","cam","heat","cruise","led","carplay","park","keyless"]},
  desc:"Официальная машина, обслуживалась только у дилера, вся история есть. Гибрид экономичный: зимой около 6,5 л на сотню.\nКомплектация с камерой заднего вида, подогревом сидений и адаптивным круиз-контролем. Не бита, не крашена — можно проверить толщиномером.\nПродаю, потому что переезжаем, нужен минивэн."},
 {cat:"auto",sub:0,title:"Dacia Logan 2018, 1.2 газ/бензин, механика",price:6300,cur:"EUR",val:6500,cond:"used",reg:"bal",attrs:{brand:"Dacia",model:"Logan",gen:"II",year:2018,mileage:142000,fuel:"gas",engine:1.2,power:73,gearbox:"manual",drive:"fwd",body:"sedan",color:"white",wheel:"left",damage:"ok",owners:"2",reg:"md",trade:true,credit:false,opts:["ac"]},
  desc:"Простая и неубиваемая машина на каждый день. Газовое оборудование поставлено в сервисе, документы на ГБО в порядке.\nКондиционер работает, новый аккумулятор. Есть небольшие сколы на капоте — на фото видно.\nСмотреть в Бельцах, после 17:00."},
 {cat:"auto",sub:2,title:"Yamaha MT-07 2020, ABS",price:6400,cur:"EUR",val:6900,cond:"used",reg:"chi",attrs:{brand:"Yamaha",mtype:"naked",year:2020,mileage:14000,cc:689,power:74,color:"blue",damage:"ok",reg:"md",trade:false},
  desc:"Мотоцикл хранился в тёплом гараже, ни разу не падал. Стоят слайдеры и короткий хвост, родной хвост тоже отдам.\nМасло меняю каждые 5000 км. Отличный вариант как первый мотоцикл после категории A."},
 {cat:"real",sub:0,title:"2-комн. квартира, Ботаника, 54 м², 6/9 эт.",price:68500,cur:"EUR",val:71000,cond:"used",reg:"chi",attrs:{rooms:"2",area:54,floor:6,sector:"Ботаника",state:"euro",building:"old"},
  desc:"Светлая квартира после ремонта два года назад: новая проводка, пластиковые окна, автономное отопление.\nОстаётся встроенная кухня с техникой и шкаф-купе в спальне. Рядом парк, школа, садик и остановка троллейбуса.\nСобственник, без комиссии. Документы готовы к продаже."},
 {cat:"real",sub:0,title:"1-комн. квартира в новострое, Чеканы, 46 м², белый вариант",price:44000,cur:"EUR",val:45500,cond:"new",reg:"chi",attrs:{rooms:"1",area:46,floor:11,sector:"Чеканы",state:"white",building:"new"},
  desc:"Дом сдан в этом году, кадастр уже есть. Белый вариант: стяжка, штукатурка, разводка коммуникаций — можно сразу делать ремонт под себя.\nБольшая лоджия с видом на лес, подземный паркинг можно докупить. Возможна рассрочка от застройщика."},
 {cat:"real",sub:2,title:"Сдаю 2-комн. квартиру в Центре, 62 м², длительно",price:450,cur:"EUR",val:470,cond:"used",reg:"chi",attrs:{rooms:"2",area:62,floor:3,sector:"Центр"},
  desc:"Квартира полностью меблирована: стиральная и посудомоечная машины, кондиционеры в обеих комнатах, быстрый интернет.\nСдаю на длительный срок, оплата помесячно плюс коммунальные платежи по счётчикам. Без животных, пожалуйста."},
 {cat:"real",sub:1,title:"Дом 120 м² в Дурлештах, 6 соток, гараж",price:98000,cur:"EUR",val:102000,cond:"used",reg:"chi",attrs:{area:120,land:6,state:"euro"},
  desc:"Двухэтажный дом из котельца, утеплён в 2022 году. Газ, центральная вода и канализация подключены.\nВо дворе гараж на одну машину, летняя кухня и виноградник. До центра Кишинёва 15 минут на машине."},
 {cat:"elec",sub:0,title:"iPhone 14 Pro 256GB, Deep Purple, аккумулятор 89%",price:12900,val:14200,cond:"used",reg:"chi",attrs:{brand:"Apple",model:"iPhone 14 Pro",ram:6,storage:"256",color:"grey",warranty:false,box:true},
  desc:"Пользовался аккуратно, всё время был в чехле и с защитным стеклом — на экране ни одной царапины.\nFace ID и все камеры работают, не ремонтировался. Отдам с коробкой, кабелем и двумя чехлами.\nМогу отправить доставкой или встретиться в центре."},
 {cat:"elec",sub:0,title:"Samsung Galaxy A55 128GB, новый, на гарантии",price:5900,val:6200,cond:"new",reg:"bal",attrs:{brand:"Samsung",model:"Galaxy A55",ram:8,storage:"128",color:"blue",warranty:true,box:true},
  desc:"Подарили, но у меня уже есть телефон. Коробка не вскрывалась, гарантия 12 месяцев от магазина — чек приложу.\nЦвет тёмно-синий."},
 {cat:"elec",sub:2,title:"Игровой ПК: Ryzen 5 7600 / RTX 4060 Ti / 32GB / 1TB SSD",price:16400,val:19800,cond:"used",reg:"chi",attrs:{cpu:"AMD Ryzen 5 7600",gpu:"RTX 4060 Ti",ram:32,storage:"1000",lpurpose:"gaming",warranty:false},
  desc:"Собирал себе в прошлом году, все комплектующие с чеками. Тянет современные игры в 1440p на высоких настройках.\nБлок питания 650 W Gold, тихий корпус с тремя вентиляторами. Windows 11 активирована.\nПродаю, потому что ухожу на ноутбук. Можно проверить в играх при встрече."},
 {cat:"elec",sub:1,title:"Lenovo ThinkPad T14 Gen 3, i5 / 16GB / 512GB",price:10900,val:11500,cond:"used",reg:"chi",attrs:{brand:"Lenovo",ram:16,storage:"512",lcpu:"i5",lpurpose:"office",lscreen:14,dgpu:false,box:false},
  desc:"Рабочий ноутбук, в отличном состоянии. Клавиатура с подсветкой, батарея держит около 7 часов офисной работы.\nОтлично подойдёт студенту или для удалённой работы. Зарядка в комплекте."},
 {cat:"elec",sub:4,title:"Телевизор LG OLED 55\" C2, как новый",price:16900,val:18500,cond:"used",reg:"ung",attrs:{brand:"LG",screen:55,panel:"OLED",res:"4K UHD",smart:true,box:true},
  desc:"Картинка потрясающая, выгораний нет. Пульт с указкой, коробка сохранилась.\nСамовывоз из Унген или отправлю доставкой."},
 {cat:"appl",sub:1,title:"Стиральная машина Bosch Serie 4, 8 кг, A+++",price:5400,val:5900,cond:"used",reg:"chi",attrs:{brand:"Bosch"},
  desc:"Работает тихо, без нареканий, 3 года в эксплуатации. Продаю из-за переезда в квартиру со встроенной техникой.\nПомогу погрузить, в пределах Кишинёва могу привезти за небольшую доплату."},
 {cat:"appl",sub:3,title:"Кондиционер Gree 12 BTU, инвертор, с установкой",price:9900,val:10400,cond:"new",reg:"chi",attrs:{brand:"Gree"},
  desc:"Новый, гарантия 3 года. Цена включает стандартный монтаж до 3 метров трассы.\nУстановка в течение 2–3 дней после звонка. Работаем по всему Кишинёву и пригородам."},
 {cat:"home",sub:0,title:"Угловой диван с механизмом «дельфин», серо-зелёный",price:6800,cond:"used",reg:"chi",attrs:{material:"fabric"},
  desc:"Диван в хорошем состоянии, ткань велюр, без пятен и затяжек. Раскладывается в спальное место 160×200.\nВнутри большой ящик для белья. Самовывоз с 4 этажа, лифт есть."},
 {cat:"kids",sub:0,title:"Коляска 2 в 1, люлька и прогулочный блок",price:4900,cond:"used",reg:"orh",attrs:{age:"0"},
  desc:"Пользовались одним ребёнком, всё целое и чистое. В комплекте дождевик, москитная сетка и сумка для мамы.\nКолёса надувные, отлично едет по нашим дорогам."},
 {cat:"sport",sub:0,title:"Горный велосипед, рама M, 29\", гидравлические тормоза",price:7800,cond:"used",reg:"chi",
  desc:"Катался два сезона, обслуживал в веломастерской. Поменяны цепь и задняя кассета.\nПодойдёт для роста 170–182 см. Подарю замок и фонарь."},
 {cat:"sport",sub:4,title:"Акустическая гитара Yamaha с чехлом и тюнером",price:2300,cond:"used",reg:"cah",
  desc:"Хорошая гитара для обучения, держит строй. Струны новые, поставлены неделю назад.\nМогу показать, как играет, при встрече в Кагуле."},
 {cat:"serv",sub:0,title:"Электрик в Кишинёве: проводка, щитки, розетки",price:200,cond:"used",reg:"chi",
  desc:"Опыт более 10 лет. Замена проводки в квартирах и домах, сборка электрощитов, установка розеток, люстр и тёплого пола.\nВыезд в день обращения, гарантия на работу. Цена указана за вызов, итоговая стоимость — после осмотра."},
 {cat:"serv",sub:2,title:"Репетитор по румынскому языку для школьников и взрослых",price:250,cond:"used",reg:"chi",
  desc:"Занятия онлайн и в центре Кишинёва. Помогу подготовиться к экзамену BAC, улучшить разговорную речь или сдать собеседование.\nЦена за 60 минут, первое занятие — знакомство, бесплатно."},
 {cat:"job",sub:0,title:"Требуется кассир в супермаркет, график 2/2",price:11000,cond:"used",reg:"bal",attrs:{schedule:"shift",sphere:"sales"},
  desc:"Официальное трудоустройство, зарплата дважды в месяц, обучение на месте.\nОпыт не обязателен, важны внимательность и вежливость. Знание румынского и русского."},
 {cat:"pets",sub:1,title:"Котята шотландские вислоухие, приучены к лотку",price:1800,cond:"used",reg:"sor",
  desc:"Два мальчика и девочка, 2,5 месяца. Обработаны от паразитов, едят сухой и влажный корм.\nОтдаём только в добрые руки, можем привезти по Сорокам."},
 {cat:"agro",sub:1,title:"Мёд подсолнечниковый, свой, 3-литровая банка",price:420,cond:"new",reg:"edi",
  desc:"Собственная пасека в Единецком районе. Мёд этого сезона, без добавок.\nПри покупке от 3 банок — доставка до Бельц бесплатно."}
];
const RICH_ILL = [["car","#2f6fd6","hatch"],["car","#b8bec4","suv"],["car","#f1f2f4","sedan"],["moto","#1f4fd1"],["flat","#efe2d0"],["building"],["flat","#dce9f2"],["house"],
 ["phone","#5b4a7a"],["phone","#1f2a4a"],["pc"],["laptop","#2b2b2b"],["tv"],["washer"],["ac"],["sofa","#7c9a86"],["stroller","#3c4a5c"],["bike","#e0572a"],["guitar"],["tools"],["lesson"],["register"],["cat"],["honey"]];
RICH.forEach((o,i)=> add(Object.assign({t: NOW - (i*37+5)*60e3, views: ri(20,900), priv: o.cat!=="appl"||o.sub!==3, rich:true, ill: RICH_ILL[i]}, o)));

/* ---- Перенос в структуру из 23 разделов (как на крупных досках Молдовы).
   a.oc / a.os — исходный раздел генератора, по нему подбираются рисунок и тексты описания. ---- */
(function(){
  const T = a => a.title.toLowerCase();
  const MAP = {
    elec:{0:["phones",0],3:["phones",1],1:["comp",0],2:["comp",1],7:["comp",14],4:["av",0],
      5:a=>/наушник|airpods/.test(T(a))?["av",2]:["av",1], 6:a=>/дрон/.test(T(a))?["av",5]:/экшн|gopro/.test(T(a))?["av",4]:["av",3],
      8:a=>/видеокарт/.test(T(a))?["comp",3]:/монитор/.test(T(a))?["comp",10]:/ssd/.test(T(a))?["comp",7]:/памят/.test(T(a))?["comp",6]:["comp",8]},
    home:{0:["furn",0],1:["furn",1],2:["furn",2],3:["furn",3],4:["agro",5],5:["furn",4]},
    sport:{0:["sport",0],1:["sport",1],2:["tour",4],3:["sport",2],4:a=>/пианино/.test(T(a))?["music",1]:["music",0],5:["misc",1],6:["sport",3]},
    misc:{0:["misc",0],1:a=>/концерт/.test(T(a))?["tour",3]:["tour",2],2:["misc",2]},
    pets:{4:["pets",5]}, cloth:{3:a=>/час/.test(T(a))?["cloth",4]:["cloth",3]}
  };
  ADS.forEach(a=>{
    const m = MAP[a.cat] && MAP[a.cat][a.sub]; if (!m) return;
    const [c,s] = typeof m==="function" ? m(a) : m;
    a.oc = a.cat; a.os = a.sub; a.cat = c; a.sub = s;
  });
  ADS.forEach(a=>{ // переименование характеристик под новые фильтры
    const at = a.attrs;
    if (a.cat==="comp" && a.sub===3 && at.gpu){ at.gmodel = at.gpu; delete at.gpu; }
    if (a.cat==="music" && a.sub===0) at.gtype = /электро/.test(T(a)) ? "electric" : "acoustic";
    if (a.cat==="music" && a.sub===1) at.ktype = "dpiano";
    if (a.cat==="tour" && a.sub===4 && !at.gear) at.gear = "tent";
    if (a.cat==="sport" && a.sub===2) at.wtype = /сноуборд/.test(T(a)) ? "board" : "ski";
    if (a.cat==="cloth" && a.sub===4) at.jtype = "watch";
    if (a.cat==="agro" && a.sub===5) at.gtype = /газонокос/.test(T(a)) ? "mower" : "garden_furn";
  });
})();

/* ---- Видеокарты и процессоры: характеристики из справочников, цены — ориентировочные для макета ---- */
(function(){
  const gBase = m => /^GTX 9/.test(m)?700:/^GTX 10/.test(m)?1300:/^GTX 16/.test(m)?2100:/^RTX 20/.test(m)?3200:/^RTX 30/.test(m)?4300:/^RTX 40/.test(m)?7000:/^RTX 50/.test(m)?9800
    :/^RX [45]\d0$/.test(m)?1100:/^RX 5\d00/.test(m)?2600:/^RX 6\d00/.test(m)?3900:/^RX 7\d00/.test(m)?6600:/^RX 9\d/.test(m)?9500:/^Arc/.test(m)?3300:/Vega|VII/.test(m)?2600:2500;
  const gTier = m => /90/.test(m)?3.6:/80 Ti|80 Super|XTX/.test(m)?2.6:/80/.test(m)?2.2:/70 Ti|70 Super|XT$/.test(m)?1.6:/70/.test(m)?1.35:/60 Ti/.test(m)?1:/60|A750|A770|B580/.test(m)?.8:/50/.test(m)?.55:/30|40|A380|B570/.test(m)?.5:1;
  const titles = ["Видеокарта","Видеокарта","Продаю видеокарту","Игровая видеокарта"];
  const models = take(GPU_ALL, 46).concat(["RTX 4060","RTX 4070 Super","RTX 3060","RX 7800 XT","RTX 5070","RTX 4060 Ti"]);
  models.forEach(m=>{
    const v = GPU_VENDOR_OF(m), sp = GPU_SPEC[m]; if (!v || !sp) return;
    const brand = v==="NVIDIA" ? pick(GPU_BRANDS.filter(b=>!/Sapphire|PowerColor|XFX/.test(b))) : v==="AMD" ? pick(["Sapphire","PowerColor","XFX","ASUS","MSI","Gigabyte","ASRock"]) : pick(["ASRock","Intel Limited Edition","Sparkle","Gunnir"]);
    const cond = /^RTX 50|^RX 9/.test(m) ? (R()<.6?"new":"used") : R()<.15 ? "new" : "used";
    const val = r100(gBase(m)*gTier(m)*(cond==="new"?1.15:1)), price = r100(val*(.8+R()*.38));
    const outs = v==="NVIDIA" && /^GTX (9|10)/.test(m) ? ["HDMI","DisplayPort","DVI"] : ["HDMI","DisplayPort"];
    const clock = /^RTX 50|^RX 9/.test(m) ? ri(2400,2900) : /^RTX 40|^RX 7/.test(m) ? ri(2300,2700) : /^RTX 30|^RX 6/.test(m) ? ri(1650,2500) : ri(1400,1900);
    add({cat:"comp",sub:3,title:`${pick(titles)} ${brand==="NVIDIA Founders Edition"?"NVIDIA":brand} ${v==="NVIDIA"?"GeForce ":v==="AMD"?"Radeon ":"Intel "}${m} ${sp[0]}GB`,
      price, val, cond, attrs:{gvendor:v, gseries:GPU_SERIES_OF(m), gmodel:m, gbrand:brand==="Intel Limited Edition"||brand==="Sparkle"||brand==="Gunnir"?undefined:brand,
        vram:String(sp[0]), vtype:sp[1], bus:String(sp[2]), gclock:clock, outputs:outs, gpower:GPU_POWER_OF(m), mined: cond==="new" ? true : R()<.65},
      ill:["gpu"]});
  });
  const cBase = m => /Ultra 9|i9|Ryzen 9/.test(m)?6200:/Ultra 7|i7|Ryzen 7/.test(m)?3800:/Ultra 5|i5|Ryzen 5/.test(m)?2100:1100;
  const cAge = m => /1[01]\d{3}|[23]\d{3}(?!X3D)/.test(m.replace(/^.*?(i\d-|Ryzen \d )/,"")) ? .55 : /12\d{3}|5\d{3}/.test(m) ? .8 : 1.05;
  take(CPU_ALL, 40).forEach(full=>{
    const short = full.replace(/^(Intel|AMD) /,""), sp = CPU_SPEC[short]; if (!sp) return;
    const brand = full.startsWith("Intel") ? "Intel" : "AMD", cond = R()<.2 ? "new" : "used", box = R()<.35;
    const val = r100(cBase(short)*cAge(short)*(/X3D/.test(short)?1.45:1)*(cond==="new"?1.15:1)), price = r100(val*(.8+R()*.35));
    add({cat:"comp",sub:4,title:`Процессор ${full}${box?" BOX":" OEM"}`,price,val,cond,
      attrs:{cbrand:brand, cseries:CPU_SERIES_OF(full), cmodel:full, cgen:CPU_GEN_OF(full), cores:sp[0], threads:sp[1], socket:CPU_SOCKET_OF(full), box}, ill:["chip"]});
  });
})();

/* ---- Объявления для новых подразделов. Тексты придуманы для макета. [раздел, подраздел, заголовок, цена, валюта?, характеристики?, рисунок?] ---- */
const LIST2 = [
 ["real",7,"Сдаётся комната студентке, Рышкановка, рядом с университетом",2500,0,{rooms:"1",sector:"Рышкановка",area:14}],["real",7,"Комната в общежитии 18 м², с ремонтом, продажа",14500,"EUR",{area:18,sector:"Ботаника"}],
 ["real",7,"Комната в 3-комнатной квартире, хозяйка проживает отдельно",2200,0,{area:12,sector:"Центр"}],
 ["real",8,"Сдаётся дом в Ставченах, 3 спальни, двор и мангал",650,"EUR",{rooms:"3",area:140,land:6}],["real",8,"Дом в аренду в Дурлештах, на длительный срок",500,"EUR",{rooms:"2",area:95,land:4}],
 ["phones",2,"Apple Watch Series 9, 45 мм, аккумулятор 96%",5200,0,{brand:"Apple"}],["phones",2,"Samsung Galaxy Watch6 Classic 47 мм",3900,0,{brand:"Samsung"}],["phones",2,"Фитнес-браслет Xiaomi Smart Band 8",550,0,{brand:"Xiaomi"}],
 ["phones",2,"Garmin Forerunner 265, для бега, полный комплект",5900,0,{brand:"Garmin"}],["phones",2,"Amazfit GTR 4, новые, запечатаны",2900,0,{brand:"Amazfit"},null,"new"],
 ["phones",3,"Чехлы для iPhone 15 Pro, силиконовые, новые",150,0,{acc:"case"},null,"new"],["phones",3,"Зарядка 65W GaN, два USB-C",450,0,{acc:"charger"},null,"new"],["phones",3,"Пауэрбанк Anker 20000 мА·ч",650,0,{acc:"power"}],
 ["phones",4,"Электронная книга Kindle Paperwhite 5, подсветка",1900,0,{}],["phones",4,"PocketBook 629 Verse, в обложке",1500,0,{}],
 ["comp",2,"Мини-ПК Intel NUC, i5, 16 ГБ, SSD 512 ГБ",4900,0,{lcpu:"i5",ram:16,storage:"512",lpurpose:"office"}],["comp",2,"Моноблок Apple iMac 24″ M1, 8/256",15500,0,{lcpu:"m1",ram:8,storage:"256",lscreen:24}],
 ["comp",2,"Моноблок Lenovo IdeaCentre AIO 3, 27″",9800,0,{lcpu:"r5",ram:16,storage:"512",lscreen:27}],
 ["comp",5,"Материнская плата ASUS TUF B650-Plus WiFi",3300,0,{chipset:"B650",socket:"AM5",form:"ATX",ramtype:"DDR5"}],["comp",5,"MSI PRO B760M-A DDR4",2100,0,{chipset:"B760",socket:"LGA1700",form:"Micro-ATX",ramtype:"DDR4"}],
 ["comp",5,"Gigabyte B550 Aorus Elite V2",1900,0,{chipset:"B550",socket:"AM4",form:"ATX",ramtype:"DDR4"}],["comp",5,"ASRock Z790 Steel Legend",4600,0,{chipset:"Z790",socket:"LGA1700",form:"ATX",ramtype:"DDR5"}],
 ["comp",5,"Gigabyte B450M DS3H, с заглушкой",900,0,{chipset:"B450",socket:"AM4",form:"Micro-ATX",ramtype:"DDR4"}],
 ["comp",6,"Kingston Fury Beast 32 ГБ (2×16) DDR5 6000",2100,0,{ramgb:"32",ramtype:"DDR5",ramfreq:6000}],["comp",6,"Corsair Vengeance LPX 16 ГБ (2×8) DDR4 3200",850,0,{ramgb:"16",ramtype:"DDR4",ramfreq:3200}],
 ["comp",6,"G.Skill Trident Z5 RGB 64 ГБ DDR5 6400",4300,0,{ramgb:"64",ramtype:"DDR5",ramfreq:6400}],["comp",6,"Оперативная память 8 ГБ DDR4 2666 для ноутбука",350,0,{ramgb:"8",ramtype:"DDR4",ramfreq:2666}],
 ["comp",7,"SSD Samsung 980 Pro 1 ТБ NVMe",1700,0,{dtype:"nvme",dcap:"1000"}],["comp",7,"SSD Kingston A400 480 ГБ SATA",550,0,{dtype:"sata",dcap:"512"}],["comp",7,"HDD WD Blue 2 ТБ, 7200 об/мин",900,0,{dtype:"hdd",dcap:"2000"}],
 ["comp",7,"Внешний диск Seagate 4 ТБ USB 3.0",1600,0,{dtype:"ext",dcap:"4000"}],["comp",7,"SSD WD Black SN850X 2 ТБ",3000,0,{dtype:"nvme",dcap:"2000"},null,"new"],
 ["comp",8,"Блок питания be quiet! Pure Power 12 M 850W",2300,0,{pwtype:"psu",watt:850,cert:"Gold"}],["comp",8,"Корпус Lian Li Lancool 216, белый",1900,0,{pwtype:"case",form:"ATX"}],
 ["comp",8,"Блок питания Chieftec 600W, Bronze",800,0,{pwtype:"psu",watt:600,cert:"Bronze"}],["comp",8,"Корпус Fractal Design North, дерево",2600,0,{pwtype:"case",form:"ATX"}],
 ["comp",9,"Кулер DeepCool AK620, башенный",1100,0,{cool:"air",socket:"AM5"}],["comp",9,"СЖО Arctic Liquid Freezer III 360",2100,0,{cool:"aio",socket:"LGA1700"}],["comp",9,"Вентиляторы Arctic P12, набор 5 шт",450,0,{cool:"fans"}],
 ["comp",10,"Монитор LG UltraGear 27GP850, 2K 165 Гц",4900,0,{brand:"LG",mres:"2K (QHD)",mpanel:"IPS",refresh:"165 Гц",lscreen:27}],["comp",10,"Монитор Dell P2422H 24″ Full HD",2300,0,{brand:"Dell",mres:"Full HD",mpanel:"IPS",refresh:"60 Гц",lscreen:24}],
 ["comp",10,"Samsung Odyssey G5 32″ изогнутый 144 Гц",4200,0,{brand:"Samsung",mres:"2K (QHD)",mpanel:"VA",refresh:"144 Гц",lscreen:32}],["comp",10,"ASUS ROG Swift OLED 27″ 240 Гц",14500,0,{brand:"ASUS",mres:"2K (QHD)",mpanel:"OLED",refresh:"240 Гц",lscreen:27}],
 ["comp",10,"Монитор AOC 24G2 24″ 144 Гц",2200,0,{brand:"AOC",mres:"Full HD",mpanel:"IPS",refresh:"144 Гц",lscreen:23.8}],["comp",10,"LG 34WP65C ультраширокий 34″",5600,0,{brand:"LG",mres:"Ultrawide",mpanel:"VA",refresh:"144 Гц",lscreen:34}],
 ["comp",11,"Механическая клавиатура Keychron K2, коричневые свитчи",1400,0,{kmtype:"kb",mech:true,wireless:true}],["comp",11,"Мышь Logitech G Pro X Superlight",1600,0,{kmtype:"mouse",wireless:true,mech:false}],
 ["comp",11,"Комплект Logitech MK270, беспроводной",350,0,{kmtype:"set",wireless:true,mech:false}],["comp",11,"Игровая гарнитура HyperX Cloud II",1100,0,{kmtype:"headset",wireless:false,mech:false}],
 ["comp",12,"Лазерный принтер HP LaserJet Pro M15w",1700,0,{prtype:"laser",colorprint:false,brand:"HP"}],["comp",12,"МФУ Epson L3250, СНПЧ, Wi-Fi",3300,0,{prtype:"mfu",colorprint:true,brand:"Epson"}],
 ["comp",12,"МФУ Canon i-SENSYS MF3010",2200,0,{prtype:"mfu",colorprint:false,brand:"Canon"}],["comp",12,"3D-принтер Bambu Lab A1 mini",5600,0,{prtype:"3d",colorprint:true}],
 ["comp",13,"Роутер TP-Link Archer AX55, Wi-Fi 6",1200,0,{ntype:"router"}],["comp",13,"Mesh-система Xiaomi, 2 модуля",1500,0,{ntype:"mesh"}],["comp",13,"Коммутатор на 8 портов, гигабитный",400,0,{ntype:"switch"}],["comp",13,"4G-модем Huawei, разблокирован",600,0,{ntype:"modem"}],
 ["av",5,"DJI Mini 3, Fly More Combo, 3 батареи",9900,0,{brand:"DJI",vres:"4K",flight:38}],["av",6,"Проектор Xiaomi Wanbo T2 Max",2700,0,{brand:"Xiaomi",res:"Full HD",smart:true}],["av",6,"Проектор Epson EH-TW750, Full HD",6500,0,{res:"Full HD",smart:false}],
 ["av",4,"Экшн-камера DJI Osmo Action 4",5400,0,{brand:"DJI",vres:"4K"}],["av",2,"Наушники Sony WF-1000XM5, TWS",3900,0,{htype:"tws",anc:true,brand:"Sony"}],["av",2,"Marshall Major IV, коричневые",1600,0,{htype:"over",anc:false,brand:"Marshall"}],
 ["build",5,"Газовый котёл Ariston двухконтурный 24 кВт",9500,0,{heat:"boiler"}],["build",5,"Радиаторы алюминиевые, 10 секций, 6 шт",3600,0,{heat:"rad"}],["build",5,"Камин-печь чугунная, с трубой",7800,0,{heat:"stove"}],["build",5,"Рекуператор для квартиры",4200,0,{heat:"vent"}],
 ["cloth",4,"Золотое кольцо 585, размер 17",4300,0,{jtype:"ring",metal:"gold",gender:"w"}],["cloth",4,"Серебряная цепочка 925, 55 см",900,0,{jtype:"chain",metal:"silver",gender:"u"}],
 ["cloth",4,"Часы Seiko 5 Sports, автоподзавод",3400,0,{jtype:"watch",metal:"steel",gender:"m"}],["cloth",4,"Серьги с фианитами, серебро",650,0,{jtype:"ear",metal:"silver",gender:"w"}],
 ["furn",5,"Офисное кресло эргономичное, сетка",2400,0,{ftype:"chair"}],["furn",5,"Стол руководителя с тумбой",4900,0,{ftype:"desk",material:"chip"}],["furn",5,"Стеллаж для офиса, металл, 5 полок",900,0,{ftype:"shelf",material:"metal"}],["furn",5,"Стол-трансформер с электроприводом",5600,0,{ftype:"desk",material:"metal"},null,"new"],
 ["agro",5,"Теплица из поликарбоната 3×6 м",8900,0,{gtype:"greenhouse"},null,"new"],["agro",5,"Триммер бензиновый Husqvarna",3200,0,{gtype:"mower"}],["agro",5,"Садовый инвентарь: лопаты, грабли, тяпки",350,0,{gtype:"tools"}],
 ["pets",4,"Шиншиллы, мальчик и девочка, с клеткой",1500,0,{sex:"m"}],["pets",4,"Декоративные кролики, 2 месяца",350,0,{sex:"f"}],["pets",4,"Морская свинка с домиком",400,0,{sex:"f"}],
 ["pets",6,"Монстера большая, 1.2 м",650,0,{plant:"indoor"}],["pets",6,"Фикус Бенджамина в горшке",350,0,{plant:"indoor"}],["pets",6,"Розы, саженцы, 20 сортов",60,0,{plant:"garden"}],["pets",6,"Коллекция кактусов и суккулентов",250,0,{plant:"succ"}],
 ["sport",4,"Электросамокат Xiaomi Mi 4 Pro",7400,0,{rtype:"escoot"}],["sport",4,"Ролики детские раздвижные 31–34",500,0,{rtype:"roller"}],["sport",4,"Скейтборд, дека клён",650,0,{rtype:"skate"}],["sport",4,"Самокат трюковой",900,0,{rtype:"kick"}],
 ["sport",5,"Тонометр Omron M3, автомат",750,0,{mtype:"bp"}],["sport",5,"Ходунки для взрослых, складные",600,0,{mtype:"walk"}],["sport",5,"Массажёр для шеи и спины",900,0,{mtype:"massage"}],
 ["sport",6,"Мяч футбольный Adidas, размер 5",450,0,{}],["sport",6,"Баскетбольная стойка уличная",3800,0,{}],["sport",6,"Ракетки для настольного тенниса, комплект",500,0,{}],
 ["beauty",0,"Набор корейской косметики для лица, новый",650,0,{btype:"kbeauty",gender:"w",sealed:true},null,"new"],["beauty",0,"Палетка теней, использовалась 2 раза",300,0,{btype:"makeup",gender:"w",sealed:false}],
 ["beauty",0,"Крем La Roche-Posay Cicaplast, 100 мл",250,0,{btype:"face",bbrand:"La Roche-Posay",gender:"u",sealed:true},null,"new"],["beauty",1,"Парфюмерная вода, 100 мл, оригинал с чеком",1900,0,{ptype:"edp",gender:"w",vol:100,bbrand:"Dior"}],
 ["beauty",1,"Мужская туалетная вода, 50 мл",1200,0,{ptype:"edt",gender:"m",vol:50,bbrand:"Chanel"}],["beauty",1,"Отливанты нишевой парфюмерии, 5 мл",120,0,{ptype:"sample",gender:"u",vol:5}],
 ["beauty",2,"Набор для ухода за волосами, шампунь и маска",350,0,{gender:"w"}],["beauty",3,"Фен Dyson Supersonic, полный комплект",6900,0,{dtype:"dryer",bbrand:"Dyson"}],
 ["beauty",3,"Эпилятор Braun Silk-épil 9",1300,0,{dtype:"epil",bbrand:"Braun"}],["beauty",3,"Триммер Philips OneBlade",650,0,{dtype:"shaver",bbrand:"Philips"}],
 ["beauty",4,"Лампа для маникюра UV/LED 48 Вт",450,0,{}],["beauty",4,"Набор гель-лаков, 24 цвета",600,0,{},null,"new"],
 ["tour",0,"Тур в Анталью, 7 ночей, всё включено, вылет из Кишинёва",780,"EUR",{to:"Анталья",nights:7,meals:"ai",pax:2}],["tour",0,"Египет, Хургада, 10 ночей, отель 5*",920,"EUR",{to:"Хургада",nights:10,meals:"ai",pax:2}],
 ["tour",0,"Автобусный тур Будапешт — Вена, 5 дней",390,"EUR",{to:"Будапешт",nights:4,meals:"bb",pax:1}],["tour",0,"Выходные в Батуми, перелёт и отель",450,"EUR",{to:"Батуми",nights:3,meals:"bb",pax:1}],
 ["tour",1,"Авиабилет Кишинёв — Рим, туда и обратно",3200,0,{from:"Кишинёв",to:"Рим",ticket:"round",class:"eco",pax:1}],["tour",1,"Билет Кишинёв — Стамбул, в одну сторону",2100,0,{from:"Кишинёв",to:"Стамбул",ticket:"oneway",class:"eco",pax:1}],
 ["tour",1,"Два билета Кишинёв — Лондон, возврат через неделю",9800,0,{from:"Кишинёв",to:"Лондон",ticket:"round",class:"eco",pax:2}],["tour",1,"Бизнес-класс Кишинёв — Дубай",18500,0,{from:"Кишинёв",to:"Дубай",ticket:"round",class:"biz",pax:1}],
 ["tour",2,"Автобус Кишинёв — Яссы, ежедневно",250,0,{from:"Кишинёв",to:"Яссы",ticket:"oneway",carrier:"Автовокзал (рейсовый)",pax:1}],["tour",2,"Поезд Кишинёв — Бухарест, купе",650,0,{from:"Кишинёв",to:"Бухарест",ticket:"oneway",carrier:"CFM (поезд)",pax:1}],
 ["tour",2,"Пассажирские перевозки Бельцы — Варшава",1500,0,{from:"Бельцы",to:"Варшава",ticket:"oneway",carrier:"Частный перевозчик",pax:1}],["tour",2,"Микроавтобус Кишинёв — Одесса, от двери до двери",400,0,{from:"Кишинёв",to:"Одесса",ticket:"oneway",carrier:"Частный перевозчик",pax:1}],
 ["tour",3,"Билеты в оперу, 2 места в партере",900,0,{etype:"theatre",venue:"Национальный театр оперы и балета",tcat:"seat"}],["tour",3,"Билет на фестиваль, 3 дня",1100,0,{etype:"festival",venue:"Другое",tcat:"fan"}],
 ["tour",3,"Детский спектакль, 3 билета",300,0,{etype:"kids",venue:"Дворец Республики",tcat:"seat"}],["tour",3,"Футбол: 2 билета на матч сборной",600,0,{etype:"sport",venue:"Стадион Зимбру",tcat:"seat"}],
 ["tour",4,"Рюкзак туристический 65 л",1100,0,{gear:"bag"}],["tour",4,"Спальник до −5°, лёгкий",700,0,{gear:"sleep"}],["tour",5,"База отдыха у озера, домики на выходные",1200,0,{rest:"base",nights:2}],
 ["tour",5,"Экскурсия по винодельне с дегустацией",550,0,{rest:"winery",nights:2}],["tour",5,"Коттедж в Вадул-луй-Водэ, до 8 гостей",2500,0,{rest:"cottage",nights:2}],
 ["biz",3,"Франшиза кофейни «с собой», готовая модель",15000,"EUR",{bsphere:"food",payback:18}],["biz",3,"Франшиза пункта выдачи заказов",4000,"EUR",{bsphere:"retail",payback:12}],
 ["music",2,"Ударная установка Pearl Roadshow, полный комплект",7500,0,{mbrand:"Pearl"}],["music",2,"Электронные барабаны Roland TD-07",11500,0,{mbrand:"Roland"}],
 ["music",3,"Скрипка 4/4 с футляром и смычком",2400,0,{case:true}],["music",3,"Саксофон альт Yamaha YAS-280",14500,0,{mbrand:"Yamaha",case:true}],["music",3,"Укулеле сопрано",650,0,{}],
 ["music",4,"Комбоусилитель Fender Champion 40",2600,0,{stype:"amp",mbrand:"Fender"}],["music",4,"Микшер Behringer Xenyx 1202",1500,0,{stype:"mixer",mbrand:"Behringer"}],["music",4,"Микрофон Shure SM58",1600,0,{stype:"mic",mbrand:"Shure"}],
 ["music",0,"Электрогитара Fender Stratocaster Player",13500,0,{gtype:"electric",mbrand:"Fender"}],["music",0,"Классическая гитара Cort, для учёбы",1600,0,{gtype:"classic",mbrand:"Cort"}],["music",1,"Синтезатор Yamaha PSR-E373",3900,0,{ktype:"synth",keys:"61",mbrand:"Yamaha"}],
 ["appl",6,"Посудомоечная машина Bosch, 60 см, встраиваемая",7900,0,{brand:"Bosch",install:"built",dwidth:"60 см"}],["appl",6,"Посудомойка Beko 45 см",4600,0,{brand:"Beko",install:"free",dwidth:"45 см"}],
 ["appl",7,"Бойлер Ariston 80 л",3200,0,{volume:80}],["appl",7,"Проточный водонагреватель 5.5 кВт",1300,0,{}],["appl",5,"Аэрогриль Philips XXL",2900,0,{brand:"Philips",kitch:"multi"}],
 ["party",0,"Свадебное платье, ручная вышивка, размер S",8500,0,{size:"S",deal:"sale",color:"white"}],["party",0,"Прокат свадебных платьев, более 40 моделей",2500,0,{deal:"rent",color:"white"}],["party",0,"Мужской свадебный костюм-тройка",3200,0,{size:"L",deal:"sale",color:"blue"}],
 ["party",1,"Вечернее платье в пол, изумрудное",1900,0,{size:"M",deal:"sale",color:"green"}],["party",1,"Платье на выпускной, прокат",700,0,{size:"S",deal:"rent",color:"red"}],
 ["party",2,"Оформление шарами и фотозона",1500,0,{occasion:"birthday"}],["party",2,"Декор зала к свадьбе под ключ",9000,0,{occasion:"wedding"}],["party",2,"Новогодние украшения, ёлка 2 м",1200,0,{occasion:"newyear"}],
 ["party",3,"Подарочные корзины на заказ",600,0,{occasion:"corporate"}],["party",3,"Именные подарки для крестин",350,0,{occasion:"christen"}],
 ["party",4,"Букеты на заказ, доставка по Кишинёву",450,0,{}],["party",4,"Пионы оптом, сезон",35,0,{}],["party",4,"101 роза в коробке",3500,0,{}],
 ["party",5,"Зал на 120 гостей для свадеб и крестин",0,0,{rent:"hall",deal:"rent",occasion:"wedding"}],["party",5,"Ретро-автомобиль на свадьбу",3000,0,{rent:"car",deal:"rent",occasion:"wedding"}],["party",5,"Аренда шатра и мебели для праздника",4500,0,{rent:"equip",deal:"rent",occasion:"birthday"}],
 ["kids",5,"Школьный рюкзак ортопедический",700,0,{age:"7"}],["kids",5,"Школьная форма на мальчика, 128 см",500,0,{age:"7"}],["kids",5,"Набор канцелярии к 1 сентября",250,0,{age:"7"},null,"new"],
 ["kids",6,"Молокоотсос Philips Avent электрический",1400,0,{age:"0"}],["kids",6,"Радионяня с камерой",1100,0,{age:"0"}],["kids",6,"Стульчик для кормления",900,0,{age:"0"}],
 ["homeoffice",0,"Набор кастрюль из нержавейки, 6 предметов",1300,0,{dish:"pots"},null,"new"],["homeoffice",0,"Сервиз столовый на 6 персон",900,0,{dish:"sets"}],["homeoffice",0,"Набор кухонных ножей с подставкой",750,0,{dish:"knives"}],
 ["homeoffice",0,"Бокалы для вина, 6 шт, хрусталь",500,0,{dish:"glass"}],["homeoffice",1,"Бытовая химия оптом, для офиса",0,0,{wholesale:true}],["homeoffice",1,"Пароочиститель для дома",1600,0,{}],
 ["homeoffice",2,"Бумага A4, коробка 5 пачек",450,0,{office:"paper",wholesale:true}],["homeoffice",2,"Маркерная доска 90×120",800,0,{office:"boards"}],["homeoffice",2,"Папки и органайзеры для офиса",150,0,{office:"folders"}],
 ["homeoffice",3,"Система хранения для гардероба",1900,0,{}],["homeoffice",3,"Контейнеры для хранения, 10 шт",400,0,{}],["homeoffice",4,"Сейф мебельный с кодовым замком",1800,0,{}],["homeoffice",4,"Камера видеонаблюдения Wi-Fi, 2 шт",900,0,{}],
 ["misc",1,"Учебники для 9 класса, комплект",400,0,{genre:"edu",blang:"ru"}],["misc",1,"Детские книги, 25 штук",350,0,{genre:"kids",blang:"ro"}],["misc",1,"Манга, 12 томов",900,0,{genre:"comics",blang:"en"}],["misc",1,"Книги по бизнесу и саморазвитию",500,0,{genre:"business",blang:"ru"}],
 ["misc",0,"Картина маслом, пейзаж Молдовы, 60×80",3500,0,{coll:"art"}],["misc",0,"Значки СССР, коллекция 200 шт",1500,0,{coll:"badges"}],
 ["dating",0,"Мужчина 38 лет ищет спутницу для серьёзных отношений",0,0,{dage:38,goal:"serious"}],["dating",0,"Познакомлюсь с девушкой для прогулок и путешествий",0,0,{dage:31,goal:"hobby"}],
 ["dating",1,"Женщина 45 лет, хочу встретить надёжного человека",0,0,{dage:45,goal:"family"}],["dating",1,"Ищу спутника для походов в горы и на природу",0,0,{dage:29,goal:"hobby"}],
 ["dating",2,"Ищу компанию для настольных игр по выходным",0,0,{dage:27,goal:"friends"}],["dating",2,"Клуб общения на английском, приглашаю всех",0,0,{dage:35,goal:"friends"}],
 ["serv",7,"СТО: ремонт ходовой и двигателя",0,0,{astype:"service"}],["serv",7,"Шиномонтаж с выездом",150,0,{astype:"tires"}],["serv",7,"Химчистка салона авто",900,0,{astype:"wash"}],["serv",7,"Компьютерная диагностика авто",300,0,{astype:"diag"}],
 ["serv",8,"Фото и видеосъёмка свадеб",6000,0,{etype:"photo"}],["serv",8,"Ведущий и диджей на праздник",5000,0,{etype:"host"}],["serv",8,"Кейтеринг на мероприятия",0,0,{etype:"cater"}]
];
LIST2.forEach(([cat,sub,title,price,cur,attrs,ill,cond])=>{
  for (let rep=0; rep<(R()<.55?2:1); rep++){
    const p = price===0||price<100||cat==="dating" ? price : r10(price*(rep?(.85+R()*.3):1));
    add({cat,sub,title,price:p,cur:cur||"MDL",attrs:Object.assign({},attrs),ill:ill||undefined,
      cond: cond || (["serv","dating","tour","biz"].includes(cat) ? "used" : undefined), priv: cat==="dating" ? true : undefined});
  }
});
/* даты для билетов и туров: от ближайших дней до трёх месяцев вперёд */
(function(){
  const iso = d => new Date(d).toISOString().slice(0,10);
  ADS.forEach(a=>{
    if (a.cat!=="tour") return; const at=a.attrs;
    if ([0,1,2].includes(a.sub) && !at.depart){ const d = NOW + ri(3,90)*864e5; at.depart = iso(d); if (a.sub===0 || at.ticket==="round") at.ret = iso(d + (at.nights||ri(3,10))*864e5); }
    if (a.sub===3 && !at.edate) at.edate = iso(NOW + ri(5,80)*864e5);
  });
})();

/* ---- Продавцы: рейтинг, отзывы, проверка документов ---- */
const SHOPS = [["TechPoint","phones"],["PC Master","comp"],["AutoLux Chișinău","auto"],["Casa Mobila","furn"],["Kids World MD","kids"],["Imobil Expert","real"],["Fashion Hub","cloth"],["BuildPro","build"],["Electro Casa","appl"],["Sport Life","sport"],["Foto Video Pro","av"],["Beauty Box","beauty"],["Travel Point","tour"],["Music Store MD","music"],["Flori & Decor","party"]];
const SELLERS = [];
for (let i=0;i<80;i++){
  const r = Math.round((3.7 + R()*1.3)*10)/10;
  SELLERS.push({id:i+1, name:NAMES[i%NAMES.length]+(i>=NAMES.length?" "+String.fromCharCode(1040+(i%28))+".":""), type:"private",
    rating: Math.min(5,r), reviews: R()<.15?0:ri(1,140), since: ri(2015,2025), verified: R()<.5, reply: pick(["min","hour","day"]), sold: ri(0,260)});
}
SHOPS.forEach(([name,cat],i)=>SELLERS.push({id:100+i, name, type:"company", cat, rating: Math.round((4.5+R()*.5)*10)/10, reviews: ri(60,900), since: ri(2014,2022), verified:true, reply:"min", sold: ri(400,5000)}));
const sellerOf = a => SELLERS.find(s=>s.id===a.seller) || {id:0,name:a.name,type:"private",rating:0,reviews:0,since:2026,verified:false,reply:"day",sold:0};
const DELIVERABLE = {phones:[0,1,2,3,4], comp:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], av:[0,1,2,3,4,5,6], cloth:[0,1,2,3,4], kids:[1,2,4,5,6], furn:[2,3,4], appl:[4,5], sport:[0,1,3,4,5,6], build:[1,2,3], pets:[5], misc:[0,1,2], auto:[6,7], beauty:[0,1,2,3,4], music:[0,1,2,3,4], homeoffice:[0,1,2,3,4], party:[3,4], tour:[4]};
ADS.forEach(a=>{
  if (a.priv) a.seller = 1 + Math.floor(R()*80);
  else { const shops = SELLERS.filter(s=>s.type==="company" && s.cat===a.cat); a.seller = shops.length ? pick(shops).id : 1 + Math.floor(R()*80); }
  a.name = sellerOf(a).name;
  a.delivery = !!(DELIVERABLE[a.cat] && DELIVERABLE[a.cat].includes(a.sub) && R()<.65);
  a.hl = a.top ? R()<.5 : R()<.03;
});
const REVIEW_TXT = {
  5:["Всё отлично, товар как в описании. Рекомендую!","Быстро ответил, встретились вовремя. Спасибо!","Честный продавец, всё работает идеально.","Отправил в тот же день, упаковка надёжная.","Приятный человек, сделка прошла гладко."],
  4:["Всё хорошо, немного задержался со встречей.","Товар нормальный, есть мелкие потёртости, но об этом предупредили.","В целом доволен, торговаться не захотел."],
  3:["Состояние чуть хуже, чем на фото.","Долго отвечал, но в итоге договорились."],
  2:["Опоздал на час, товар с дефектом, о котором не сказал."]};
function reviewsOf(s){
  let x = (s.id*48271 + 12345) % 2147483647; const r = () => (x = (x*16807)%2147483647)/2147483647;
  for (let i=0;i<8;i++) r();
  const n = Math.min(s.reviews, 8), out=[];
  for (let i=0;i<n;i++){
    const roll = r(), p5 = Math.max(.2,(s.rating-3.5)/1.5);
    const stars = roll < p5 ? 5 : roll < p5+(1-p5)*.65 ? 4 : (roll < .97 || s.rating>=4.5) ? 3 : 2;
    out.push({stars, name: NAMES[Math.floor(r()*NAMES.length)], text: REVIEW_TXT[stars][Math.floor(r()*REVIEW_TXT[stars].length)],
      days: Math.floor(r()*300)+1, item: ADS[Math.floor(r()*ADS.length)].title});
  }
  return out.sort((a,b)=>a.days-b.days);
}


/* ---- Картинки и живые описания для всех демо-объявлений ---- */
const PALETTE = ["#2f6fd6","#c0392b","#2d2f33","#e9ebee","#1f8a5b","#7a5cc4","#d98a1f","#5f6b75","#b8bec4","#0f5c45"];
function illFor(a){
  const col = PALETTE[a.id % PALETTE.length], t = a.title.toLowerCase();
  const NEW = {
    real:{7:()=>["flat","#f3e3e3"],8:()=>["house"]},
    phones:{0:()=>["phone",["#1d1d22","#5b4a7a","#1f2a4a","#d9dce0","#2f6b4f"][a.id%5]],1:()=>["tablet","#2b2b2b"],2:()=>["watch",["#2a2d33","#c9ced3","#1f2a4a"][a.id%3]],3:()=>/пауэр|заряд/.test(t)?["gear"]:["phone","#e5484d",true],4:()=>["tablet","#5f6b75"]},
    comp:{2:()=>/imac|моноблок/.test(t)?["monitor","#c9ced3"]:["pc"],5:()=>["chip","#16181d"],6:()=>["ram",col],7:()=>/hdd|внешн/.test(t)?["box"]:["ram","#16181d"],8:()=>/корпус/.test(t)?["pc"]:["box"],9:()=>["gpu"],
      10:()=>["monitor"],11:()=>["keyboard",["#2a2d33","#e9ebee","#5f6b75"][a.id%3]],12:()=>["printer"],13:()=>["router"]},
    av:{2:()=>["headphones",col],4:()=>["camera"],5:()=>["camera"],6:()=>["tv"]},
    build:{5:()=>["tools"]}, cloth:{4:()=>/час/.test(t)?["watch","#b8bec4"]:["coin"]},
    furn:{5:()=>/кресл/.test(t)?["sofa","#2a2d33"]:["table","#5f6b75"]},
    agro:{5:()=>/теплиц/.test(t)?["land",true]:/триммер/.test(t)?["tools"]:["tools"]},
    pets:{4:()=>["cat"],5:()=>["bag","#e5484d"],6:()=>["plant",["#3aa34d","#2f8f5b","#65a30d"][a.id%3]]},
    sport:{4:()=>/электро/.test(t)?["bike","#2a2d33"]:["bike",col],5:()=>["box"],6:()=>["dumbbell","#e5484d"]},
    beauty:{0:()=>["beauty"],1:()=>["perfume",["#c026d3","#d4a017","#2f6fd6"][a.id%3]],2:()=>["perfume","#1f8a5b"],3:()=>["beauty"],4:()=>["beauty"]},
    tour:{0:()=>["plane","#0284c7"],1:()=>["plane",col],2:()=>/поезд/.test(t)?["ticket"]:["van","#0f5c45"],3:()=>["ticket"],4:()=>["tent",col],5:()=>["house"]},
    biz:{3:()=>["briefcase","#334155"]},
    music:{0:()=>["guitar"],1:()=>["piano"],2:()=>["drum"],3:()=>["guitar"],4:()=>["headphones","#2a2d33"]},
    appl:{6:()=>["washer"],7:()=>["fridge","#f4f6f8"]},
    party:{0:()=>["dress",/костюм/.test(t)?"#1f2a4a":"#f8fafc"],1:()=>["dress",["#1f8a5b","#e5484d","#7a5cc4"][a.id%3]],2:()=>["hearts","#f59e0b"],3:()=>["box"],4:()=>["bouquet",["#e5484d","#f472b6","#f59e0b"][a.id%3]],5:()=>/авто/.test(t)?["car","#f4f6f8","sedan"]:["building"]},
    kids:{5:()=>/рюкзак/.test(t)?["bag","#2f6fd6"]:/форм/.test(t)?["shirt","#1f2a4a"]:["book"],6:()=>["stroller","#f4f6f8"]},
    homeoffice:{0:()=>["dishes"],1:()=>["vacuum"],2:()=>/доск/.test(t)?["monitor","#f4f6f8"]:["book","#5f6b75"],3:()=>["box"],4:()=>/камер/.test(t)?["camera"]:["box"]},
    misc:{1:()=>["book",col]},
    dating:{0:()=>["hearts"],1:()=>["hearts","#e11d48"],2:()=>["hearts","#7a5cc4"]},
    serv:{7:()=>["car",col,"sedan"],8:()=>["camera"]}
  };
  if (!a.oc && NEW[a.cat] && NEW[a.cat][a.sub]) return NEW[a.cat][a.sub]();
  const oc = a.oc || a.cat, os = a.oc ? a.os : a.sub;
  const m = {
    auto:[()=>["car",col,a.attrs.body==="suv"||a.attrs.body==="van"?"suv":a.attrs.body==="sedan"?"sedan":"hatch"],()=>["van",col],()=>["moto",col],()=>["van","#f2c94c"],()=>["tractor","#f5a524"],()=>["van","#8f989f"],
      ()=>/шин|колод|аккум/.test(t)?["tire"]:["gear"],()=>["tire"],()=>["boat",col],()=>["van","#e9ebee"]],
    real:[()=>a.attrs.building==="new"&&a.id%2?["building"]:["flat",["#efe2d0","#dce9f2","#e7efe0","#f3e3e3"][a.id%4]],()=>["house"],()=>["flat",["#dce9f2","#efe2d0"][a.id%2]],()=>["flat","#f3e3e3"],()=>["land"],()=>["building"],()=>["house"]],
    job:[()=>/продав|кассир|промоут/.test(t)?["register"]:/водит|курьер/.test(t)?["van",col]:/разработ|developer|it|qa/.test(t)?["laptop","#2b2b2b"]:/повар/.test(t)?["coffee"]:/плиточ|сборк|бригад/.test(t)?["drill","#f5a524"]:["briefcase","#5b4636"]],
    elec:[()=>["phone",["#1d1d22","#5b4a7a","#1f2a4a","#d9dce0","#2f6b4f"][a.id%5]],()=>["laptop",a.attrs.brand==="Apple"?"#c9ced3":"#2b2b2b"],()=>["pc"],()=>["tablet","#2b2b2b"],()=>["tv"],
      ()=>/колонк|саундбар|проигр/.test(t)?["headphones","#2a2d33"]:["headphones",col],()=>/дрон/.test(t)?["camera"]:["camera"],()=>["gamepad",/xbox/.test(t)?"#2f8f5b":/switch|nintendo/.test(t)?"#e5484d":"#f4f6f8"],
      ()=>/видеокарт/.test(t)?["gpu"]:/монитор/.test(t)?["pc"]:["gear"]],
    home:[()=>/кроват|шкаф|комод|стеллаж/.test(t)?["table","#8a5a3a"]:["sofa",["#7c9a86","#9aa3ab","#b5523b","#4f6d9a"][a.id%4]],()=>["table","#a0703f"],()=>["lamp"],()=>["flat","#efe2d0"],()=>["land",true],()=>["flat","#e7efe0"]],
    appl:[()=>["fridge",a.id%2?"#f4f6f8":"#b8bec4"],()=>["washer"],()=>["fridge","#2d2f33"],()=>["ac"],()=>["vacuum"],()=>/кофе/.test(t)?["coffee"]:["coffee"]],
    cloth:[()=>["shirt",col],()=>["shirt",["#2d2f33","#1f2a4a","#5f6b75"][a.id%3]],()=>["shoe",col],()=>/час/.test(t)?["coin"]:["bag",["#8a5a3a","#2d2f33","#c0392b"][a.id%3]]],
    kids:[()=>["stroller",col],()=>["stroller","#2d2f33"],()=>["blocks"],()=>["blocks"],()=>["shirt","#f5a524"]],
    build:[()=>["bricks"],()=>["drill",["#1f8a5b","#f5a524","#2f6fd6"][a.id%3]],()=>["tools"],()=>["tools"],()=>["house"]],
    serv:[()=>["drill","#f5a524"],()=>["van","#0f5c45"],()=>["lesson"],()=>["beauty"],()=>["laptop","#2b2b2b"],()=>["tools"],()=>["flat","#e7efe0"]],
    pets:[()=>["dog"],()=>["cat"],()=>["bird"],()=>["aquarium"],()=>["bag","#e5484d"]],
    sport:[()=>["bike",col],()=>["dumbbell","#2d2f33"],()=>["tent",col],()=>["tent","#e5484d"],()=>["guitar"],()=>["lesson"],()=>/лодк/.test(t)?["boat","#e9ebee"]:["fishing"]],
    agro:[()=>["tractor",["#c0392b","#1f8a5b","#2f6fd6"][a.id%3]],()=>/мёд|мед/.test(t)?["honey"]:["land"],()=>["land"],()=>["land",true],()=>["bag","#a3cf7c"]],
    biz:[()=>["coffee"],()=>["building"],()=>["building"]],
    free:[()=>["box"],()=>["box"],()=>/кот/.test(t)?["cat"]:["dog"]],
    misc:[()=>["coin"],()=>["ticket"],()=>["box"]]
  }[oc];
  return m ? (m[os]||m[0])() : ["box"];
}
const DESC_BANK = {
  open_used:["Пользовался аккуратно, всё полностью рабочее.","Состояние хорошее: есть небольшие следы использования, на работу никак не влияют.","В отличном состоянии, без ремонтов и вскрытий.","Был в использовании около года, всё исправно."],
  open_new:["Новое, в заводской упаковке, с чеком.","Новое — подарили, но не пригодилось.","Новое, с гарантией магазина."],
  auto:["Растаможена, на учёте в Молдове, документы в порядке.","Техосмотр пройден, страховка действует до конца года.","Масло и все фильтры менял недавно, есть чеки.","Салон чистый, некурящий, кондиционер работает.","Подвеска без стуков, двигатель работает ровно.","Второй комплект резины в подарок.","Можно проверить на СТО за мой счёт."],
  real:["Солнечная сторона, тёплая квартира.","Рядом остановки, магазины, школа и садик.","Собственник, без посредников и комиссии.","Тихий двор, есть где поставить машину.","Счётчики на все коммунальные услуги, платежи небольшие.","Документы готовы, можно оформлять сразу."],
  job:["Официальное трудоустройство с первого дня.","Обучение на месте, дружный коллектив.","Зарплата без задержек, премии по результатам.","Знание румынского и русского приветствуется.","Звоните или пишите в чат — ответим в течение дня."],
  elec:["Не ремонтировался и не вскрывался.","Все функции проверены, можно протестировать при встрече.","Есть чек и коробка."],
  elec_sub:{0:["Экран без царапин — с первого дня в защитном стекле.","Аккумулятор держит день активного использования.","Face ID / отпечаток и камеры работают отлично.","Отдам с чехлом и зарядкой."],
    1:["Батарея держит 5–7 часов работы.","Клавиатура и тачпад без нареканий, корпус без вмятин.","Зарядка в комплекте.","Отлично подойдёт для учёбы и работы."],
    2:["Собран аккуратно, температуры в играх в норме.","Windows 11 активирована, драйверы обновлены.","Тихий корпус, вентиляторы чистил недавно.","Можно проверить в играх при встрече.","Монитор и клавиатуру могу отдать за доплату."],
    3:["Экран без царапин, всегда был в чехле.","Отлично для фильмов, учёбы и рисования.","Зарядка в комплекте."],
    4:["Картинка яркая, битых пикселей нет.","Smart TV: YouTube и Netflix работают.","Пульт и подставка в комплекте."],
    5:["Звук чистый, без хрипов.","Bluetooth подключается без проблем."],
    6:["Пробег затвора небольшой.","Матрица чистая, без пятен.","Отдам с сумкой и картой памяти."],
    7:["Джойстики без дрифта.","Отдам с несколькими играми."],
    8:["Не майнила, работала только в играх.","Коробка сохранилась."]},
  home:["Самовывоз, помогу погрузить.","Могу привезти по городу за небольшую доплату.","Продаю из-за ремонта, освобождаем место.","Без пятен, дом без животных."],
  appl:["Работает тихо, без нареканий.","Продаю, потому что переезжаем в квартиру со встроенной техникой.","Помогу погрузить, в пределах города могу привезти.","Все режимы работают, инструкция сохранилась."],
  cloth:["Размер соответствует, носили буквально пару раз.","Оригинал, покупали в магазине.","Без пятен, затяжек и потёртостей.","Могу отправить доставкой или встретиться в центре."],
  kids:["Ребёнок вырос — отдаём недорого.","Всё чистое и постиранное.","Из дома без животных и курящих.","В комплекте все аксессуары."],
  build:["Остаток после ремонта, хранилось в сухом месте.","Есть нужное количество, возможна доставка на объект.","Инструмент проверен, работает исправно.","При покупке оптом — скидка."],
  serv:["Работаю без выходных, выезжаю в день обращения.","Гарантия на выполненную работу.","Выезд по городу и пригородам.","Цена зависит от объёма — напишите, посчитаю бесплатно.","Опыт больше 7 лет, есть отзывы клиентов."],
  pets:["Приучены к лотку и корму.","Привиты по возрасту, есть ветпаспорт.","Отдаём только в хорошие руки.","Родители спокойного характера, можно посмотреть."],
  sport:["Обслуживалось вовремя, всё исправно.","Снасти в рабочем состоянии, ловил пару сезонов.","Подойдёт и новичку, и любителю.","Отдам вместе с аксессуарами.","Можно проверить при встрече."],
  agro:["Своё хозяйство, без лишней химии.","Есть в наличии, отгрузка сразу.","Доставка по району — договоримся.","Цена указана за единицу, оптом дешевле."],
  biz:["Оборудование рабочее, можно посмотреть в действии.","Подробности и документы — в чате.","Помогу с перевозкой и подключением."],
  free:["Отдам сегодня-завтра, самовывоз.","Просто освобождаем место — заберите, пожалуйста.","Подробности в чате."],
  comp_3:["Температуры под нагрузкой в норме, вентиляторы без треска.","Термопасту и прокладки менял недавно.","Можно проверить в тестах и играх при встрече.","Коробка и чек сохранились."],
  comp_4:["Работал без разгона, температуры в норме.","Можно проверить на моей материнской плате.","Термопаста свежая, ножки / контакты целые."],
  comp_5:["Все слоты и порты рабочие, BIOS обновлён.","Комплект: коробка, заглушка, Wi-Fi антенны."],comp_6:["Тест памяти проходит без ошибок.","Профиль XMP / EXPO работает стабильно."],
  comp_7:["Здоровье накопителя по SMART — 100%.","Отдам с переходником и винтами."],comp_8:["Не шумит, все кабели в комплекте.","Модульные кабели, коробка есть."],
  comp_10:["Битых пикселей нет, засветы минимальные.","Подставка регулируется по высоте и наклону.","Кабель DisplayPort в комплекте."],
  comp_12:["Печатает чисто, картридж / чернила почти полные.","Подключается по Wi-Fi к телефону."],
  phones_2:["Ремешок в комплекте, второй — в подарок.","Аккумулятор держит 2–3 дня."],
  beauty:["Срок годности в порядке, хранилось без солнца.","Оригинал, могу показать коды и чек.","Подойдёт в подарок."],
  tour:["Цена указана на одного человека, если не сказано иное.","Помогу с документами и трансфером.","Даты можно сдвинуть по договорённости.","Билеты оформляются на ваше имя."],
  music:["Строй держит, звук чистый.","Подойдёт и для начинающих, и для выступлений.","Можно попробовать на месте."],
  party:["Работаем по всей Молдове.","Фото работ пришлю в чат.","Бронируйте заранее — в сезон всё быстро занимают."],
  homeoffice:["Можно забрать в центре или отправить доставкой.","Оптом — скидка."],furn:["Без сколов и пятен, из некурящей квартиры.","Помогу с погрузкой."],
  phones:["Не ремонтировался и не вскрывался.","Все функции проверены, можно протестировать при встрече."],comp:["Всё проверено, работает стабильно.","Можно проверить при встрече."],av:["Работает отлично, всё проверено.","Есть коробка и документы."],
  dating:["Не курю, работаю, люблю путешествия и хорошую музыку.","Спокойный характер, ценю честность и чувство юмора.","Люблю природу, книги и прогулки по вечернему Кишинёву."],
  dating2:["Хочу познакомиться с человеком со схожими интересами.","Буду рад(а) переписке, а потом встрече за чашкой кофе.","Без спешки — сначала пообщаемся."],
  misc:["Подробности в чате.","Могу отправить доставкой.","Торг уместен при быстрой сделке."],
  close:["Торг уместен.","Звоните или пишите в чат.","Смотреть можно в любой день после 17:00.","Пишите — отвечу быстро.","Без перекупщиков, пожалуйста.","Возможен обмен — предлагайте."]
};
function descFor(a){
  const c = catOf(a.cat), lines = [];
  if (a.cat==="dating") return [said(DESC_BANK.dating), said(DESC_BANK.dating2), "Пишите в чат сайта — номер телефона дам после знакомства."].join("\n");
  if (!["job","serv","free","real","agro","tour"].includes(a.cat)) lines.push(said(a.cond==="new"?DESC_BANK.open_new:DESC_BANK.open_used));
  const sl = specLine(a, 5);
  if (sl.split(" · ").length >= 2) lines.push("Коротко о главном: " + sl + ".");
  const oc = a.oc || a.cat, os = a.oc ? a.os : a.sub;
  const bank = oc==="elec" ? [...(DESC_BANK.elec_sub[os]||[]), ...DESC_BANK.elec] : DESC_BANK[a.cat+"_"+a.sub] || DESC_BANK[oc] || DESC_BANK[a.cat] || DESC_BANK.misc;
  lines.push(...take(bank, a.cat==="serv"||a.cat==="job"?3:2));
  lines.push(said(DESC_BANK.close));
  return lines.join("\n");
}
