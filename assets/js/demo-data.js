/* Gata.md — демо-объявления (заменяются данными с сервера) */
let seed = 11; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const ri = (a,b) => a + Math.floor(R()*(b-a+1));
const pick = a => a[Math.floor(R()*a.length)];
const r100 = n => Math.round(n/100)*100, r10 = n => Math.round(n/10)*10, r500 = n => Math.round(n/500)*500;
const NOW = Date.now();
const DESCS = {
 used:["Состояние отличное, всё работает. Торг уместен.","Продаю в связи с переездом. Возможен обмен.","Один владелец, без вложений. Покажу в удобное время.","Есть мелкие следы использования, на работу не влияют.","Обслуживался вовремя, все документы на руках."],
 new:["Новое, в упаковке, с гарантией и чеком.","Новое, не подошло по размеру/цвету. Возможна доставка.","Магазин. Гарантия 12 месяцев, доставка по Молдове."]};
const NAMES = ["Андрей","Мария","Ion","Елена","Victor","Наталья","Sergiu","Ольга","Mihai","Дмитрий","Ana","Игорь","Cristina","Павел"];
let ADS = [], uid = 1;
function add(o){
  const cond = o.cond || (R()<.3?"new":"used");
  ADS.push(Object.assign({id:uid++, cur:"MDL", val:0, reg: R()<.55?"chi":REG[2+Math.floor(R()*(REG.length-2))][0],
    cond, priv:R()<.72, photos: R()<.9?ri(1,14):0, t: NOW - Math.floor(R()*14*864e5), views:ri(5,3200), top:R()<.06,
    desc:pick(DESCS[cond]), name:pick(NAMES), phone:"+373 6"+ri(0,9)+" "+ri(100,999)+" "+ri(100,999), imgs:[], attrs:{}}, o, {cond}));
}
// --- Transport
(function(){
  const cars=[["Toyota","Camry",23000,"sedan"],["Toyota","RAV4",27000,"suv"],["Toyota","Corolla",17000,"sedan"],["Volkswagen","Passat",19000,"wagon"],["Volkswagen","Golf",15000,"hatch"],["Volkswagen","Touran",14000,"van"],
   ["BMW","5 Series",33000,"sedan"],["BMW","X5",42000,"suv"],["Mercedes-Benz","E-Class",34000,"sedan"],["Mercedes-Benz","GLC",40000,"suv"],["Skoda","Octavia",16000,"wagon"],["Skoda","Superb",21000,"sedan"],
   ["Dacia","Logan",9500,"sedan"],["Dacia","Duster",13000,"suv"],["Renault","Megane",12000,"hatch"],["Hyundai","Tucson",22000,"suv"],["Kia","Sportage",22000,"suv"],["Ford","Focus",11000,"hatch"],["Opel","Astra",10500,"wagon"],["Lexus","RX",39000,"suv"],["Tesla","Model 3",32000,"sedan"]];
  const fuelW=["petrol","petrol","diesel","diesel","gas","hybrid"];
  for(let i=0;i<90;i++){
    const [b,m,base,body]=pick(cars), year=ri(2006,2023);
    const fuel = b==="Tesla"?"electric": (b==="Toyota"||b==="Lexus")&&R()<.5?"hybrid":pick(fuelW);
    const gearbox = R()<.6?"auto":"manual", mileage = Math.round((2025-year)*ri(9,24))*1000;
    const val = r100(base*Math.pow(0.9,2024-year)*(gearbox==="auto"?1.04:.96)*(1-Math.max(0,mileage-150000)/1e6));
    const price = r100(val*(0.8+R()*0.38));
    const eng = fuel==="electric"?"":((base>=30000?pick(["2.0","3.0"]):base>=20000?pick(["2.0","2.5"]):pick(["1.4","1.5","1.6","2.0"]))+" ");
    add({cat:"auto",sub:0,title:`${b} ${m} ${year}, ${eng}${lbl(FUEL,fuel).toLowerCase()}, ${lbl(GEAR,gearbox).toLowerCase()}`,cur:"EUR",price,val,cond:"used",
      attrs:{brand:b,year,mileage,fuel,gearbox,body}});
  }
  const trucks=[["Mercedes-Benz","Sprinter",14000],["MAN","TGX 18.440",32000],["DAF","XF 480",35000],["Iveco","Daily",12000],["Volkswagen","Crafter",15000],["Ford","Transit",11000]];
  for(let i=0;i<12;i++){const [b,m,base]=pick(trucks),year=ri(2008,2021),mileage=(2025-year)*ri(40,110)*1000,val=r100(base*Math.pow(.9,2022-year));
    add({cat:"auto",sub:R()<.35&&(m==="Sprinter"||m==="Crafter"||m==="Transit")?3:1,title:`${b} ${m} ${year}, ${R()<.5?"грузовой":"тент"}`,cur:"EUR",price:r100(val*(0.85+R()*.3)),val,cond:"used",attrs:{brand:b,year,mileage,fuel:"diesel",gearbox:R()<.6?"manual":"auto"}});}
  const moto=[["Honda","CB500F",5500],["Yamaha","MT-07",6500],["Kawasaki","Ninja 650",6200],["BMW","R 1250 GS",16000],["Suzuki","V-Strom 650",6000],["Yamaha","Aerox 50 (скутер)",1200]];
  for(let i=0;i<10;i++){const [b,m,base]=pick(moto),year=ri(2012,2023),val=r100(base*Math.pow(.92,2024-year));
    add({cat:"auto",sub:2,title:`${b} ${m}, ${year}`,cur:"EUR",price:r100(val*(.85+R()*.3)),val,cond:"used",attrs:{brand:b,year,mileage:(2025-year)*ri(2,6)*1000}});}
  [["Микроавтобус Mercedes Sprinter 516, 20 мест",3,"EUR",21500],["Volkswagen Crafter пассажирский 2017",3,"EUR",18900],["Автобус Iveco Daily 50C, 2015",3,"EUR",16500],["Экскаватор-погрузчик JCB 3CX 2012",4,"EUR",38000],["Мини-погрузчик Bobcat S175",4,"EUR",17500],["Прицеп легковой 2×1.3 м, документы",5,"MDL",14000],["Прицеп для лодки, усиленный",5,"MDL",19000],
   ["Фара левая Skoda Octavia A7, оригинал",6,"MDL",2300],["Двигатель 1.9 TDI в сборе, VW",6,"MDL",18000],["Тормозные колодки Bosch, Passat B8",6,"MDL",650],["Аккумулятор Varta 74Ah, новый",6,"MDL",1900],["Коробка передач DSG7, Golf 7",6,"MDL",12500],
   ["Зимние шины Michelin 205/55 R16, 4 шт",7,"MDL",5200],["Литые диски R17 5×112, оригинал Audi",7,"MDL",8900],["Летние шины Continental 225/45 R17",7,"MDL",6800],["Моторная лодка Казанка + мотор Yamaha 30",8,"EUR",4200],["Гидроцикл Sea-Doo Spark 2019",8,"EUR",6900]]
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
  const phones=[["Apple","iPhone 16 Pro",23000,8],["Apple","iPhone 15 Pro",17500,8],["Apple","iPhone 15",13500,6],["Apple","iPhone 14",10500,6],["Apple","iPhone 13",8200,4],["Apple","iPhone 12",6000,4],
   ["Samsung","Galaxy S24 Ultra",19000,12],["Samsung","Galaxy S24",12500,8],["Samsung","Galaxy S23",9200,8],["Samsung","Galaxy A55",6200,8],["Samsung","Galaxy A35",4600,6],
   ["Xiaomi","Redmi Note 13 Pro",5200,8],["Xiaomi","Redmi Note 13",3500,6],["Xiaomi","14T",9800,12],["Google","Pixel 8",9000,8],["Google","Pixel 8 Pro",12500,12]];
  for(let i=0;i<34;i++){const [b,m,base,ram]=pick(phones),st=pick([128,128,256,256,512]),cond=R()<.3?"new":"used";
    const val=r100(base*(st===256?1.12:st===512?1.3:1)*(cond==="new"?1.08:.78));
    add({cat:"elec",sub:0,title:`${b==="Apple"?"":b+" "}${m} ${st}GB${cond==="new"?", новый":""}`,price:r100(val*(.86+R()*.3)),val,cond,attrs:{brand:b,ram,storage:st}});}
  const laps=[["Apple","MacBook Air 13 M2",16500,8,256,"Apple M2"],["Apple","MacBook Air 15 M3",22500,8,512,"Apple M3"],["Apple","MacBook Pro 14 M3 Pro",34000,18,512,"Apple M3 Pro"],
   ["Lenovo","ThinkPad T14 Gen 3",11500,16,512,"Intel Core i5-1245U"],["Lenovo","Legion 5 RTX 4060",21000,16,1000,"AMD Ryzen 7 7840HS"],["Lenovo","IdeaPad 5",9500,16,512,"AMD Ryzen 5 7530U"],
   ["ASUS","ROG Strix G16 RTX 4070",28000,16,1000,"Intel Core i7-13650HX"],["ASUS","TUF Gaming F15 RTX 3050",13000,16,512,"Intel Core i5-11400H"],["ASUS","Zenbook 14 OLED",15500,16,512,"Intel Core Ultra 5"],
   ["HP","Pavilion 15",9800,16,512,"Intel Core i5-1335U"],["HP","Victus 16 RTX 4060",19500,16,512,"AMD Ryzen 7 7840HS"],["Acer","Nitro 5 RTX 3060",15500,16,512,"Intel Core i5-12500H"],["Acer","Aspire 3",6500,8,256,"Intel Core i3-1215U"],["Dell","XPS 13 Plus",24000,16,512,"Intel Core i7-1360P"]];
  for(let i=0;i<24;i++){const [b,m,base,ram,st,cpu]=pick(laps),cond=R()<.3?"new":"used",val=r100(base*(cond==="new"?1.05:.76));
    add({cat:"elec",sub:1,title:`${b} ${m}, ${ram}/${st>=1000?"1TB":st+"GB"}${cond==="new"?", новый":""}`,price:r100(val*(.85+R()*.3)),val,cond,attrs:{brand:b,ram,storage:st,cpu}});}
  // PCs — главный полигон для ИИ
  const cpuV={"Intel Core i3-12100F":1500,"AMD Ryzen 5 5600":2000,"Intel Core i5-12400F":2300,"AMD Ryzen 5 7600":3600,"Intel Core i5-13600K":5000,"AMD Ryzen 7 5800X3D":5600,"Intel Core i7-13700K":7000,"AMD Ryzen 7 7800X3D":7600,"Intel Core i9-13900K":9800};
  const gpuV={"GTX 1660 Super":2600,"RX 6600":3500,"RTX 3060":4500,"RX 7600":4800,"RTX 4060":5800,"RTX 3070":6400,"RTX 4060 Ti":7600,"RX 7800 XT":9600,"RTX 4070":10800,"RTX 4070 Super":12400,"RTX 4080 Super":19500};
  const tiers=[[0,3,0,3],[1,5,1,5],[2,6,3,7],[3,7,4,9],[4,8,6,10]];
  for(let i=0;i<46;i++){
    const tr=pick(tiers), cpu=CPU[ri(tr[0],tr[1])], gpu=GPU[ri(tr[2],tr[3])];
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
 sport:[[0,"Велосипед Trek Marlin 7, рама L",11000],[0,"Велосипед детский 20\"",1600],[0,"Электровелосипед Xiaomi",9500],[1,"Беговая дорожка Kettler",8500],[1,"Гантели разборные 2×20 кг",1300],[2,"Палатка 4-местная Coleman",2100],
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
 {cat:"auto",sub:0,title:"Volkswagen Golf 7 2016, 1.6 TDI, механика",price:9800,cur:"EUR",val:10600,cond:"used",reg:"chi",attrs:{brand:"Volkswagen",year:2016,mileage:198000,fuel:"diesel",gearbox:"manual",body:"hatch"},
  desc:"Привезена из Германии в 2021 году, с тех пор я единственный владелец в Молдове. Расход по трассе около 4,5 л, по городу 5,5.\nВ прошлом месяце поменял ГРМ, помпу и все фильтры, чеки сохранены. Зимняя резина на дисках в подарок.\nКузов без ржавчины, перекрашено только заднее правое крыло после мелкой царапины. Торг у машины."},
 {cat:"auto",sub:0,title:"Toyota RAV4 2019, 2.5 гибрид, полный привод",price:27500,cur:"EUR",val:28900,cond:"used",reg:"chi",attrs:{brand:"Toyota",year:2019,mileage:86000,fuel:"hybrid",gearbox:"auto",body:"suv"},
  desc:"Официальная машина, обслуживалась только у дилера, вся история есть. Гибрид экономичный: зимой около 6,5 л на сотню.\nКомплектация с камерой заднего вида, подогревом сидений и адаптивным круиз-контролем. Не бита, не крашена — можно проверить толщиномером.\nПродаю, потому что переезжаем, нужен минивэн."},
 {cat:"auto",sub:0,title:"Dacia Logan 2018, 1.0 газ/бензин, механика",price:6300,cur:"EUR",val:6500,cond:"used",reg:"bal",attrs:{brand:"Dacia",year:2018,mileage:142000,fuel:"gas",gearbox:"manual",body:"sedan"},
  desc:"Простая и неубиваемая машина на каждый день. Газовое оборудование поставлено в сервисе, документы на ГБО в порядке.\nКондиционер работает, новый аккумулятор. Есть небольшие сколы на капоте — на фото видно.\nСмотреть в Бельцах, после 17:00."},
 {cat:"auto",sub:2,title:"Yamaha MT-07 2020, ABS",price:6400,cur:"EUR",val:6900,cond:"used",reg:"chi",attrs:{brand:"Yamaha",year:2020,mileage:14000,fuel:"petrol"},
  desc:"Мотоцикл хранился в тёплом гараже, ни разу не падал. Стоят слайдеры и короткий хвост, родной хвост тоже отдам.\nМасло меняю каждые 5000 км. Отличный вариант как первый мотоцикл после категории A."},
 {cat:"real",sub:0,title:"2-комн. квартира, Ботаника, 54 м², 6/9 эт.",price:68500,cur:"EUR",val:71000,cond:"used",reg:"chi",attrs:{rooms:"2",area:54,floor:6,sector:"Ботаника",state:"euro",building:"old"},
  desc:"Светлая квартира после ремонта два года назад: новая проводка, пластиковые окна, автономное отопление.\nОстаётся встроенная кухня с техникой и шкаф-купе в спальне. Рядом парк, школа, садик и остановка троллейбуса.\nСобственник, без комиссии. Документы готовы к продаже."},
 {cat:"real",sub:0,title:"1-комн. квартира в новострое, Чеканы, 46 м², белый вариант",price:44000,cur:"EUR",val:45500,cond:"new",reg:"chi",attrs:{rooms:"1",area:46,floor:11,sector:"Чеканы",state:"white",building:"new"},
  desc:"Дом сдан в этом году, кадастр уже есть. Белый вариант: стяжка, штукатурка, разводка коммуникаций — можно сразу делать ремонт под себя.\nБольшая лоджия с видом на лес, подземный паркинг можно докупить. Возможна рассрочка от застройщика."},
 {cat:"real",sub:2,title:"Сдаю 2-комн. квартиру в Центре, 62 м², длительно",price:450,cur:"EUR",val:470,cond:"used",reg:"chi",attrs:{rooms:"2",area:62,floor:3,sector:"Центр"},
  desc:"Квартира полностью меблирована: стиральная и посудомоечная машины, кондиционеры в обеих комнатах, быстрый интернет.\nСдаю на длительный срок, оплата помесячно плюс коммунальные платежи по счётчикам. Без животных, пожалуйста."},
 {cat:"real",sub:1,title:"Дом 120 м² в Дурлештах, 6 соток, гараж",price:98000,cur:"EUR",val:102000,cond:"used",reg:"chi",attrs:{area:120,land:6,state:"euro"},
  desc:"Двухэтажный дом из котельца, утеплён в 2022 году. Газ, центральная вода и канализация подключены.\nВо дворе гараж на одну машину, летняя кухня и виноградник. До центра Кишинёва 15 минут на машине."},
 {cat:"elec",sub:0,title:"iPhone 14 Pro 256GB, Deep Purple, аккумулятор 89%",price:12900,val:14200,cond:"used",reg:"chi",attrs:{brand:"Apple",ram:6,storage:256},
  desc:"Пользовался аккуратно, всё время был в чехле и с защитным стеклом — на экране ни одной царапины.\nFace ID и все камеры работают, не ремонтировался. Отдам с коробкой, кабелем и двумя чехлами.\nМогу отправить доставкой или встретиться в центре."},
 {cat:"elec",sub:0,title:"Samsung Galaxy A55 128GB, новый, на гарантии",price:5900,val:6200,cond:"new",reg:"bal",attrs:{brand:"Samsung",ram:8,storage:128},
  desc:"Подарили, но у меня уже есть телефон. Коробка не вскрывалась, гарантия 12 месяцев от магазина — чек приложу.\nЦвет тёмно-синий."},
 {cat:"elec",sub:2,title:"Игровой ПК: Ryzen 5 7600 / RTX 4060 Ti / 32GB / 1TB SSD",price:16400,val:19800,cond:"used",reg:"chi",attrs:{cpu:"AMD Ryzen 5 7600",gpu:"RTX 4060 Ti",ram:32,storage:1000},
  desc:"Собирал себе в прошлом году, все комплектующие с чеками. Тянет современные игры в 1440p на высоких настройках.\nБлок питания 650 W Gold, тихий корпус с тремя вентиляторами. Windows 11 активирована.\nПродаю, потому что ухожу на ноутбук. Можно проверить в играх при встрече."},
 {cat:"elec",sub:1,title:"Lenovo ThinkPad T14 Gen 3, i5 / 16GB / 512GB",price:10900,val:11500,cond:"used",reg:"chi",attrs:{brand:"Lenovo",ram:16,storage:512,cpu:"Intel Core i5-1245U"},
  desc:"Рабочий ноутбук, в отличном состоянии. Клавиатура с подсветкой, батарея держит около 7 часов офисной работы.\nОтлично подойдёт студенту или для удалённой работы. Зарядка в комплекте."},
 {cat:"elec",sub:4,title:"Телевизор LG OLED 55\" C2, как новый",price:16900,val:18500,cond:"used",reg:"ung",attrs:{brand:"LG",screen:55},
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
RICH.forEach((o,i)=> add(Object.assign({t: NOW - (i*37+5)*60e3, photos: ri(4,12), views: ri(20,900), priv: o.cat!=="appl"||o.sub!==3}, o)));

/* ---- Продавцы: рейтинг, отзывы, проверка документов ---- */
const SHOPS = [["TechPoint","elec"],["PC Master","elec"],["AutoLux Chișinău","auto"],["Casa Mobila","home"],["Kids World MD","kids"],["Imobil Expert","real"],["Fashion Hub","cloth"],["BuildPro","build"],["Electro Casa","appl"],["Sport Life","sport"]];
const SELLERS = [];
for (let i=0;i<80;i++){
  const r = Math.round((3.7 + R()*1.3)*10)/10;
  SELLERS.push({id:i+1, name:NAMES[i%NAMES.length]+(i>=NAMES.length?" "+String.fromCharCode(1040+(i%28))+".":""), type:"private",
    rating: Math.min(5,r), reviews: R()<.15?0:ri(1,140), since: ri(2015,2025), verified: R()<.5, reply: pick(["min","hour","day"]), sold: ri(0,260)});
}
SHOPS.forEach(([name,cat],i)=>SELLERS.push({id:100+i, name, type:"company", cat, rating: Math.round((4.5+R()*.5)*10)/10, reviews: ri(60,900), since: ri(2014,2022), verified:true, reply:"min", sold: ri(400,5000)}));
const sellerOf = a => SELLERS.find(s=>s.id===a.seller) || {id:0,name:a.name,type:"private",rating:0,reviews:0,since:2026,verified:false,reply:"day",sold:0};
const DELIVERABLE = {elec:[0,1,2,3,4,5,6,7,8], cloth:[0,1,2,3], kids:[1,2,4], home:[2,3,5], appl:[4,5], sport:[1,2,3,4,5], build:[1,2,3], pets:[4], misc:[0,1,2], auto:[6,7]};
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
