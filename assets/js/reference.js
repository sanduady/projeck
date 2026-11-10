/* Project — справочники: города, марки и модели авто, электроника, породы и т.д.
   Это общеизвестные факты (названия, поколения, годы выпуска). В настоящем проекте эти данные
   будут храниться в базе и редактироваться в админ-панели. */

/* ---- Города и районы Молдовы (с примерными координатами для карты) ---- */
const REG_DB = [
 ["chi","Кишинёв","Chișinău",28.86,47.01],["bal","Бельцы","Bălți",27.93,47.76],["tir","Тирасполь","Tiraspol",29.63,46.84],["ben","Бендеры","Bender",29.48,46.83],
 ["cah","Кагул","Cahul",28.19,45.90],["ung","Унгены","Ungheni",27.80,47.21],["sor","Сороки","Soroca",28.30,48.16],["orh","Орхей","Orhei",28.82,47.38],
 ["com","Комрат","Comrat",28.66,46.30],["edi","Единцы","Edineț",27.30,48.17],["hin","Хынчешты","Hîncești",28.59,46.83],["str","Страшены","Strășeni",28.61,47.14],
 ["ial","Яловены","Ialoveni",28.78,46.94],["ane","Анений Ной","Anenii Noi",29.23,46.88],["cau","Каушаны","Căușeni",29.41,46.64],["cri","Криуляны","Criuleni",29.04,47.21],
 ["flo","Флорешты","Florești",28.30,47.89],["dro","Дрокия","Drochia",27.81,48.03],["fal","Фалешты","Fălești",27.71,47.57],["glo","Глодяны","Glodeni",27.51,47.77],
 ["ris","Рышкань","Rîșcani",27.55,47.95],["sin","Сынжерей","Sîngerei",28.15,47.64],["tel","Теленешты","Telenești",28.37,47.50],["rez","Резина","Rezina",28.96,47.75],
 ["sol","Шолданешты","Șoldănești",28.80,47.82],["dub","Дубоссары","Dubăsari",29.16,47.27],["cal","Калараш","Călărași",28.31,47.25],["nis","Ниспорены","Nisporeni",28.18,47.08],
 ["leo","Леова","Leova",28.25,46.48],["cim","Чимишлия","Cimișlia",28.78,46.52],["bas","Бессарабка","Basarabeasca",28.96,46.33],["can","Кантемир","Cantemir",28.20,46.28],
 ["tar","Тараклия","Taraclia",28.67,45.90],["cea","Чадыр-Лунга","Ceadîr-Lunga",28.83,46.06],["vul","Вулканешты","Vulcănești",28.40,45.68],["ocn","Окница","Ocnița",27.48,48.38],
 ["bri","Бричаны","Briceni",27.08,48.36],["don","Дондюшаны","Dondușeni",27.58,48.22],["ste","Штефан Водэ","Ștefan Vodă",29.66,46.51],["rib","Рыбница","Rîbnița",29.00,47.77]
];

/* ---- Легковые: марка → модели → поколения (код и годы выпуска) ---- */
const parseModels = s => Object.fromEntries(s.split(";").map(x=>{ const [m,g] = x.split("="); return [m.trim(), g ? g.split(",").map(y=>{ y=y.trim(); const i=y.lastIndexOf(" "); return [y.slice(0,i), y.slice(i+1)]; }) : []]; }));
const CAR_DB = Object.fromEntries(Object.entries({
 "Acura":"MDX;RDX;TLX",
 "Alfa Romeo":"147;156;159;Giulia;Giulietta;Stelvio",
 "Audi":"A1=8X 2010–2018,GB 2018–;A3=8P 2003–2012,8V 2012–2020,8Y 2020–;A4=B7 2004–2008,B8 2007–2015,B9 2015–;A5=8T 2007–2016,F5 2016–;A6=C6 2004–2011,C7 2011–2018,C8 2018–;A7=4G 2010–2018,4K 2018–;A8=D3 2002–2010,D4 2010–2017,D5 2017–;Q2;Q3=8U 2011–2018,F3 2018–;Q5=8R 2008–2017,FY 2017–;Q7=4L 2005–2015,4M 2015–;Q8;e-tron;TT",
 "BMW":"1 Series=E87 2004–2011,F20 2011–2019,F40 2019–;2 Series;3 Series=E46 1998–2006,E90 2005–2011,F30 2012–2019,G20 2019–;4 Series=F32 2013–2020,G22 2020–;5 Series=E39 1995–2004,E60 2003–2010,F10 2010–2016,G30 2017–2023,G60 2023–;7 Series=E65 2001–2008,F01 2008–2015,G11 2015–2022;X1=E84 2009–2015,F48 2015–2022,U11 2022–;X3=E83 2003–2010,F25 2010–2017,G01 2017–;X4;X5=E53 1999–2006,E70 2006–2013,F15 2013–2018,G05 2018–;X6=E71 2008–2014,F16 2014–2019,G06 2019–;X7;i3;iX",
 "BYD":"Atto 3;Dolphin;Han;Seal;Song Plus;Tang",
 "Cadillac":"CTS;Escalade;SRX;XT5",
 "Chery":"Arrizo 8;Tiggo 4;Tiggo 7 Pro;Tiggo 8 Pro",
 "Chevrolet":"Aveo;Bolt;Camaro;Captiva;Cruze;Epica;Lacetti;Malibu;Orlando;Spark;Trax;Volt",
 "Chrysler":"300C;Pacifica;Voyager",
 "Citroen":"Berlingo;C1;C3;C4;C4 Picasso;C5;C5 Aircross;C-Elysee;Jumper;Jumpy",
 "Cupra":"Born;Formentor;Leon",
 "Dacia":"Dokker;Duster=I 2010–2017,II 2017–2023,III 2024–;Jogger;Lodgy;Logan=I 2004–2012,II 2012–2020,III 2020–;Sandero=I 2008–2012,II 2012–2020,III 2020–;Spring",
 "Daewoo":"Gentra;Lanos;Matiz;Nexia;Nubira",
 "Dodge":"Caliber;Challenger;Charger;Durango;Journey;RAM",
 "DS":"DS 3;DS 4;DS 7",
 "Fiat":"500;Bravo;Doblo;Ducato;Grande Punto;Linea;Panda;Punto;Qubo;Tipo",
 "Ford":"C-Max;EcoSport;Edge;Explorer;Fiesta=Mk6 2008–2017,Mk7 2017–2023;Focus=II 2004–2011,III 2011–2018,IV 2018–;Fusion;Galaxy;Kuga=I 2008–2012,II 2012–2019,III 2019–;Mondeo=IV 2007–2014,V 2014–2022;Mustang;Ranger;S-Max;Transit;Transit Connect",
 "Geely":"Atlas;Coolray;Emgrand;Monjaro;Tugella",
 "Genesis":"G70;G80;GV70;GV80",
 "Great Wall":"Hover;Poer;Wingle",
 "Haval":"Dargo;F7;H6;Jolion",
 "Honda":"Accord=VIII 2008–2015,IX 2012–2017;Civic=VIII 2005–2011,IX 2011–2016,X 2015–2021,XI 2021–;CR-V=III 2006–2012,IV 2012–2018,V 2016–2022;HR-V;Insight;Jazz;Pilot",
 "Hyundai":"Accent;Elantra=HD 2006–2010,MD 2010–2015,AD 2015–2020,CN7 2020–;i10;i20;i30=FD 2007–2012,GD 2012–2017,PD 2017–;Ioniq;ix35;Kona;Santa Fe=CM 2006–2012,DM 2012–2018,TM 2018–;Sonata;Tucson=JM 2004–2010,TL 2015–2020,NX4 2020–",
 "Infiniti":"FX;G;Q50;QX50;QX70",
 "Jaguar":"E-Pace;F-Pace;XE;XF;XJ",
 "Jeep":"Cherokee;Compass;Grand Cherokee;Renegade;Wrangler",
 "Kia":"Carens;Ceed=ED 2006–2012,JD 2012–2018,CD 2018–;EV6;Niro;Optima;Picanto;Rio;Sorento=XM 2009–2014,UM 2014–2020,MQ4 2020–;Soul;Sportage=KM 2004–2010,SL 2010–2015,QL 2015–2021,NQ5 2021–;Stinger",
 "Lada (ВАЗ)":"2101;2104;2105;2106;2107;2109;21099;2110;2112;2114;2115;Granta;Kalina;Largus;Niva (4x4);Niva Travel;Priora;Vesta;XRAY",
 "Land Rover":"Defender;Discovery;Discovery Sport;Freelander;Range Rover;Range Rover Evoque;Range Rover Sport;Range Rover Velar",
 "Lexus":"CT;ES=XV60 2012–2018,XV70 2018–;GS;GX;IS;LS;LX;NX=AZ10 2014–2021,AZ20 2021–;RX=AL10 2008–2015,AL20 2015–2022,AL30 2022–;UX",
 "Lincoln":"MKZ;Navigator",
 "Mazda":"2;3=BK 2003–2009,BL 2009–2013,BM 2013–2019,BP 2019–;5;6=GH 2007–2013,GJ 2012–2023;CX-3;CX-30;CX-5=KE 2011–2017,KF 2017–;CX-7;CX-9;MX-5",
 "Mercedes-Benz":"A-Class=W169 2004–2012,W176 2012–2018,W177 2018–;B-Class;C-Class=W203 2000–2007,W204 2007–2014,W205 2014–2021,W206 2021–;CLA;CLS;E-Class=W210 1995–2003,W211 2002–2009,W212 2009–2016,W213 2016–2023,W214 2023–;G-Class;GLA;GLC=X253 2015–2022,X254 2022–;GLE=W166 2015–2019,V167 2019–;GLS;ML=W164 2005–2011,W166 2011–2015;S-Class=W221 2005–2013,W222 2013–2020,W223 2020–;Sprinter;V-Class;Vito",
 "MG":"HS;MG4;MG5;ZS",
 "Mini":"Clubman;Countryman;Hatch",
 "Mitsubishi":"ASX;Colt;Eclipse Cross;L200;Lancer=X 2007–2017;Outlander=II 2005–2012,III 2012–2021,IV 2021–;Pajero;Pajero Sport;Space Star",
 "Nissan":"Almera;Juke;Leaf;Micra;Murano;Navara;Note;Pathfinder;Patrol;Qashqai=J10 2006–2013,J11 2013–2021,J12 2021–;Teana;Tiida;X-Trail=T31 2007–2014,T32 2013–2022,T33 2022–",
 "Opel":"Antara;Astra=H 2004–2014,J 2009–2015,K 2015–2021,L 2021–;Combo;Corsa=D 2006–2014,E 2014–2019,F 2019–;Grandland;Insignia=A 2008–2017,B 2017–;Meriva;Mokka;Vectra=C 2002–2008;Vivaro;Zafira=B 2005–2014,C 2011–2019",
 "Peugeot":"107;206;207;208;301;307;308;406;407;508;2008;3008;5008;Boxer;Expert;Partner",
 "Porsche":"911;Cayenne;Macan;Panamera;Taycan",
 "Renault":"Captur;Clio=III 2005–2012,IV 2012–2019,V 2019–;Fluence;Grand Scenic;Kadjar;Kangoo;Koleos;Laguna=III 2007–2015;Megane=II 2002–2009,III 2008–2016,IV 2016–;Scenic;Talisman;Trafic;Zoe",
 "Rover":"25;45;75",
 "Saab":"9-3;9-5",
 "Seat":"Alhambra;Altea;Arona;Ateca;Ibiza;Leon;Tarraco;Toledo",
 "Skoda":"Enyaq;Fabia=I 1999–2007,II 2007–2014,III 2014–2021;Kamiq;Karoq;Kodiaq=I 2016–2024;Octavia=A5 2004–2013,A7 2013–2020,A8 2020–;Rapid;Roomster;Superb=B6 2008–2015,B8 2015–2023;Yeti",
 "Smart":"ForFour;ForTwo",
 "SsangYong":"Actyon;Korando;Kyron;Rexton;Tivoli",
 "Subaru":"Forester;Impreza;Legacy;Outback;XV",
 "Suzuki":"Baleno;Grand Vitara;Ignis;Jimny;SX4;Swift;Vitara",
 "Tesla":"Model 3=I 2017–2023,Highland 2023–;Model S;Model X;Model Y=I 2020–",
 "Toyota":"Auris=E150 2006–2012,E180 2012–2018;Avensis=T250 2003–2009,T270 2009–2018;C-HR;Camry=XV40 2006–2011,XV50 2011–2017,XV70 2017–;Corolla=E120 2000–2007,E150 2006–2013,E170 2013–2019,E210 2019–;Highlander;Hilux;Land Cruiser=J100 1998–2007,J200 2007–2021,J300 2021–;Land Cruiser Prado=J120 2002–2009,J150 2009–2024;Prius=XW20 2003–2009,XW30 2009–2015,XW50 2015–2022;RAV4=XA30 2005–2012,XA40 2012–2018,XA50 2018–;Yaris=XP90 2005–2011,XP130 2011–2020,XP210 2020–",
 "Volkswagen":"Arteon;Caddy;Golf=Mk5 2003–2008,Mk6 2008–2012,Mk7 2012–2019,Mk8 2019–;ID.3;ID.4;Jetta=Mk5 2005–2010,Mk6 2010–2018;Passat=B5 1996–2005,B6 2005–2010,B7 2010–2014,B8 2014–2023;Passat CC;Polo=Mk4 2001–2009,Mk5 2009–2017,Mk6 2017–;Sharan;T-Roc;Tiguan=I 2007–2016,II 2016–2024;Touareg=I 2002–2010,II 2010–2018,III 2018–;Touran=1T 2003–2015,5T 2015–;Transporter",
 "Volvo":"S40;S60;S80;S90;V40;V50;V60;V70;V90;XC40;XC60=I 2008–2017,II 2017–;XC70;XC90=I 2002–2014,II 2014–",
 "Aito":"M5;M7;M9",
 "Aston Martin":"DB11;DBX;Vantage",
 "Avatr":"11;12",
 "BAIC":"BJ40;X35",
 "Bentley":"Bentayga;Continental GT;Flying Spur",
 "Brilliance":"V5",
 "Buick":"Enclave;Encore",
 "Changan":"CS55 Plus;CS75 Plus;UNI-K;UNI-V",
 "Daihatsu":"Sirion;Terios",
 "Deepal":"L07;S7",
 "Denza":"D9;N7",
 "Dongfeng":"580;Aeolus",
 "Exeed":"TXL;VX",
 "Ferrari":"488;F8;Purosangue;Roma;SF90",
 "GAC":"Aion S;GS3;GS8",
 "GMC":"Acadia;Sierra;Yukon",
 "Hongqi":"E-HS9;H5;H9",
 "Hummer":"EV;H2;H3",
 "Isuzu":"D-Max;Trooper",
 "JAC":"J7;JS4",
 "Jaecoo":"J7",
 "Jetour":"Dashing;X70",
 "Lamborghini":"Aventador;Huracan;Urus",
 "Lancia":"Delta;Ypsilon",
 "Leapmotor":"C10;C11",
 "Li Auto":"L7;L8;L9",
 "Lifan":"Solano;X60",
 "Lotus":"Eletre;Emira",
 "Lynk & Co":"01;05;09",
 "Mahindra":"Scorpio;XUV500",
 "Maserati":"Ghibli;Grecale;Levante;Quattroporte",
 "McLaren":"720S;Artura;GT",
 "Omoda":"C5;S5",
 "Polestar":"2;3;4",
 "Ravon":"Gentra;Nexia R3;R2",
 "Rolls-Royce":"Cullinan;Ghost;Phantom;Wraith",
 "Tank":"300;500",
 "Voyah":"Dream;Free",
 "Xpeng":"G6;G9;P7",
 "Zeekr":"001;7X;X",
 "Zotye":"T600",
 "ЕРАЗ":"762",
 "ИЖ":"2126 Ода;2715",
 "ЛуАЗ":"969",
 "РАФ":"2203",
 "ГАЗ":"24 Волга;3110;31105;Газель;Соболь",
 "Москвич":"2140;2141;412",
 "УАЗ":"469;Буханка;Патриот;Хантер",
 "ЗАЗ":"Sens;Vida;Запорожец;Таврия"
}).map(([b,s])=>[b, parseModels(s)]));
const CAR_BRANDS = Object.keys(CAR_DB).sort((a,b)=>a.localeCompare(b,"ru"));
const CAR_MODELS = Object.fromEntries(CAR_BRANDS.map(b=>[b,Object.keys(CAR_DB[b])]));
const CAR_GENS = {}; CAR_BRANDS.forEach(b=>Object.entries(CAR_DB[b]).forEach(([m,gs])=>{ if (gs.length) CAR_GENS[m] = gs.map(([g,y])=>[g,`${g} (${y})`,`${g} (${y})`]); }));
const CAR_CLASS = b => ["Audi","BMW","Mercedes-Benz","Lexus","Tesla","Porsche","Land Rover","Jaguar","Volvo","Infiniti","Genesis","Cadillac","Lincoln","Acura","DS","Ferrari","Lamborghini","Maserati","Bentley","Rolls-Royce","Aston Martin","McLaren","Lotus","Zeekr","Li Auto","Polestar","Hummer","Voyah","Denza","Avatr","Aito","Hongqi","GMC"].includes(b) ? "prem"
  : ["Dacia","Lada (ВАЗ)","Daewoo","Chery","Geely","ГАЗ","УАЗ","ЗАЗ","Москвич","Fiat","Great Wall","Haval","Rover","Smart","Ravon","Lifan","Zotye","Brilliance","ЕРАЗ","ИЖ","ЛуАЗ","РАФ","Daihatsu","Dongfeng","JAC","Changan"].includes(b) ? "bud" : "mid";
const SUV_RE = /^(X[1-7]|Q[2-8]|GL[ABCES]|ML|G-Class|Touareg|Tiguan|T-Roc|ID\.4|Kodiaq|Karoq|Kamiq|Yeti|Enyaq|Duster|Jogger|Tucson|Santa Fe|ix35|Kona|Sportage|Sorento|Niro|Soul|Kuga|EcoSport|Edge|Explorer|Ranger|RAV4|Land Cruiser.*|Highlander|Hilux|C-HR|RX|NX|GX|LX|UX|Model [XY]|CR-V|HR-V|Pilot|CX-\d+|Qashqai|X-Trail|Juke|Murano|Navara|Pathfinder|Patrol|Outlander|ASX|Eclipse Cross|Pajero.*|L200|XC\d+|3008|5008|2008|C5 Aircross|Captur|Kadjar|Koleos|Antara|Mokka|Grandland|Cayenne|Macan|Range Rover.*|Defender|Discovery.*|Freelander|[EF]-Pace|Cherokee|Grand Cherokee|Compass|Renegade|Wrangler|Countryman|FX|QX\d+|Actyon|Korando|Kyron|Rexton|Tivoli|Forester|Outback|XV|Grand Vitara|Jimny|Vitara|SX4|Escalade|SRX|XT5|Navigator|MDX|RDX|GV\d+|Atto 3|Song Plus|Tang|Tiggo.*|Atlas|Coolray|Monjaro|Tugella|Dargo|F7|H6|Jolion|Hover|HS|ZS|Niva.*|469|Патриот|Хантер|Arona|Ateca|Tarraco|Formentor|Trax|Captiva|Durango|Journey|DS 7|Urus|Purosangue|Bentayga|Cullinan|DBX|Eletre|Grecale|Levante|E-HS9|H9|L7|L8|L9|G6|G9|Free|Dream|7X|M5|M7|M9|C10|C11|CS55 Plus|CS75 Plus|UNI-K|TXL|VX|GS8|JS4|Dashing|X70|BJ40|X35|Yukon|Acadia|Enclave|Encore|H2|H3|D-Max|Trooper|Scorpio|XUV500|Terios|X60|T600|969)$/;
const VAN_RE = /^(Touran|Sharan|Zafira|Meriva|Kangoo|Scenic|Grand Scenic|Galaxy|S-Max|C-Max|Lodgy|Dokker|Berlingo|Partner|Combo|Caddy|Carens|Orlando|Alhambra|Altea|Roomster|C4 Picasso|Doblo|Qubo|Largus|V-Class|Vito|Voyager|Pacifica|Transporter|Trafic|Vivaro|Expert|Jumpy)$/;
const HATCH_RE = /^(Golf|Polo|ID\.3|Fabia|Clio|Megane|Ceed|Focus|Fiesta|Astra|Corsa|1 Series|A-Class|A1|A3|Sandero|Prius|Auris|Yaris|i10|i20|i30|Picanto|Rio|Leaf|Micra|Note|Tiida|Jazz|Civic|2|3|Swift|Baleno|Ignis|Colt|Space Star|107|206|207|208|307|308|C1|C3|C4|Hatch|Clubman|500|Panda|Punto|Grande Punto|Bravo|Ibiza|Leon|Born|Spark|Aveo|Matiz|ForFour|ForTwo|Zoe|Spring|Dolphin|MG4|Kalina|Granta|2109|21099|2112|2114|i3|CT|V40|DS 3|DS 4|25|45|Impreza|Ioniq|Bolt|Insight)$/;

/* ---- Грузовые, автобусы, мото ---- */
const TRUCK_BRANDS = ["DAF","Ford","ГАЗ","Isuzu","Iveco","КамАЗ","МАЗ","MAN","Mercedes-Benz","Renault Trucks","Scania","Volkswagen","Volvo","ЗИЛ"];
const BUS_BRANDS = ["Citroen","Fiat","Ford","Iveco","Mercedes-Benz","Neoplan","Peugeot","Renault","Setra","Volkswagen","Богдан","ПАЗ"];
const MOTO_BRANDS = ["Aprilia","Benelli","BMW","CFMoto","Ducati","Harley-Davidson","Honda","Husqvarna","Kawasaki","KTM","Piaggio","Royal Enfield","Suzuki","Triumph","Vespa","Viper","Yamaha","Днепр","ИЖ","Минск","Урал"];

/* ---- Электроника ---- */
const GPU_DB = {
 "NVIDIA":["GTX 750 Ti","GTX 950","GTX 960","GTX 970","GTX 980","GTX 980 Ti","GTX 1050","GTX 1050 Ti","GTX 1060 3GB","GTX 1060 6GB","GTX 1070","GTX 1070 Ti","GTX 1080","GTX 1080 Ti",
   "GTX 1630","GTX 1650","GTX 1650 Super","GTX 1660","GTX 1660 Super","GTX 1660 Ti","RTX 2060","RTX 2060 Super","RTX 2070","RTX 2070 Super","RTX 2080","RTX 2080 Super","RTX 2080 Ti",
   "RTX 3050","RTX 3060","RTX 3060 Ti","RTX 3070","RTX 3070 Ti","RTX 3080","RTX 3080 Ti","RTX 3090","RTX 3090 Ti",
   "RTX 4060","RTX 4060 Ti","RTX 4070","RTX 4070 Super","RTX 4070 Ti","RTX 4070 Ti Super","RTX 4080","RTX 4080 Super","RTX 4090",
   "RTX 5050","RTX 5060","RTX 5060 Ti","RTX 5070","RTX 5070 Ti","RTX 5080","RTX 5090"],
 "AMD":["RX 460","RX 470","RX 480","RX 550","RX 560","RX 570","RX 580","RX 590","RX Vega 56","RX Vega 64","RX 5500 XT","RX 5600 XT","RX 5700","RX 5700 XT",
   "RX 6400","RX 6500 XT","RX 6600","RX 6600 XT","RX 6650 XT","RX 6700 XT","RX 6750 XT","RX 6800","RX 6800 XT","RX 6900 XT","RX 6950 XT",
   "RX 7600","RX 7600 XT","RX 7700 XT","RX 7800 XT","RX 7900 GRE","RX 7900 XT","RX 7900 XTX","RX 9060 XT","RX 9070","RX 9070 XT"],
 "Intel":["Arc A380","Arc A580","Arc A750","Arc A770","Arc B570","Arc B580"]
};
const GPU_ALL = Object.values(GPU_DB).flat();
const CPU_DB = {
 "Intel":["Core i3-10100F","Core i3-12100F","Core i3-13100F","Core i5-9400F","Core i5-10400F","Core i5-11400F","Core i5-12400F","Core i5-12600K","Core i5-13400F","Core i5-13600K","Core i5-14400F","Core i5-14600K",
   "Core i7-9700K","Core i7-10700K","Core i7-11700K","Core i7-12700K","Core i7-13700K","Core i7-14700K","Core i9-9900K","Core i9-10900K","Core i9-12900K","Core i9-13900K","Core i9-14900K",
   "Core Ultra 5 245K","Core Ultra 7 265K","Core Ultra 9 285K"],
 "AMD":["Ryzen 3 3200G","Ryzen 5 1600","Ryzen 5 2600","Ryzen 5 3600","Ryzen 5 5500","Ryzen 5 5600","Ryzen 5 5600X","Ryzen 5 7500F","Ryzen 5 7600","Ryzen 5 7600X","Ryzen 5 9600X",
   "Ryzen 7 2700X","Ryzen 7 3700X","Ryzen 7 5700X","Ryzen 7 5800X","Ryzen 7 5800X3D","Ryzen 7 7700X","Ryzen 7 7800X3D","Ryzen 7 9700X","Ryzen 7 9800X3D","Ryzen 9 5900X","Ryzen 9 5950X","Ryzen 9 7900X","Ryzen 9 7950X","Ryzen 9 9900X","Ryzen 9 9950X"]
};
const CPU_ALL = [...CPU_DB.Intel.map(x=>"Intel "+x), ...CPU_DB.AMD.map(x=>"AMD "+x)];
const PHONE_DB = {
 "Apple":["iPhone 8","iPhone 8 Plus","iPhone X","iPhone XR","iPhone XS","iPhone XS Max","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone SE (2020)","iPhone 12 mini","iPhone 12","iPhone 12 Pro","iPhone 12 Pro Max",
   "iPhone 13 mini","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max","iPhone SE (2022)","iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max",
   "iPhone 16e","iPhone 16","iPhone 16 Plus","iPhone 16 Pro","iPhone 16 Pro Max","iPhone 17","iPhone Air","iPhone 17 Pro","iPhone 17 Pro Max"],
 "Samsung":["Galaxy A15","Galaxy A16","Galaxy A25","Galaxy A34","Galaxy A35","Galaxy A54","Galaxy A55","Galaxy A56","Galaxy S20","Galaxy S20 FE","Galaxy S21","Galaxy S21 FE","Galaxy S21 Ultra","Galaxy S22","Galaxy S22 Ultra",
   "Galaxy S23","Galaxy S23 FE","Galaxy S23 Ultra","Galaxy S24","Galaxy S24 FE","Galaxy S24 Ultra","Galaxy S25","Galaxy S25 Ultra","Galaxy Note 20 Ultra","Galaxy Z Flip5","Galaxy Z Flip6","Galaxy Z Fold5","Galaxy Z Fold6"],
 "Xiaomi":["Xiaomi 12","Xiaomi 13","Xiaomi 13T","Xiaomi 14","Xiaomi 14T","Xiaomi 14T Pro","Xiaomi 15","Redmi 13C","Redmi 14C","Redmi Note 12","Redmi Note 13","Redmi Note 13 Pro","Redmi Note 14","Redmi Note 14 Pro","POCO F5","POCO F6","POCO M6 Pro","POCO X5 Pro","POCO X6 Pro"],
 "Google":["Pixel 6","Pixel 6 Pro","Pixel 7","Pixel 7 Pro","Pixel 7a","Pixel 8","Pixel 8 Pro","Pixel 8a","Pixel 9","Pixel 9 Pro","Pixel 9a"],
 "OnePlus":["OnePlus 10 Pro","OnePlus 11","OnePlus 12","OnePlus 13","Nord 3","Nord 4"],
 "Huawei":["P30 Pro","P40","P60 Pro","Mate 20","Mate 50","nova 11"],
 "Honor":["Honor 90","Honor 200","Magic5 Pro","Magic6 Pro","X8b"],
 "Motorola":["Edge 40","Edge 50 Pro","Moto G54","Moto G84","Razr 40"],
 "Nothing":["Phone (1)","Phone (2)","Phone (2a)"],
 "Oppo":["A78","Find X5","Reno 10","Reno 11"],
 "Realme":["C55","GT 6","11 Pro","12 Pro"],
 "Vivo":["V29","X100","Y36"],
 "Sony":["Xperia 1 V","Xperia 10 V"],
 "Nokia":["C32","G21","G42"]
};
const LAPTOP_DB = {"Apple":["MacBook Air 13","MacBook Air 15","MacBook Pro 13","MacBook Pro 14","MacBook Pro 16"],"Lenovo":["IdeaPad","ThinkPad","ThinkBook","Legion","LOQ","Yoga"],
 "ASUS":["VivoBook","ZenBook","TUF Gaming","ROG Strix","ROG Zephyrus","ExpertBook"],"HP":["Pavilion","Victus","Omen","EliteBook","ProBook","Envy","Spectre"],
 "Dell":["Inspiron","Vostro","Latitude","XPS","G15","Alienware"],"Acer":["Aspire","Swift","Nitro","Predator","TravelMate"],"MSI":["Katana","Cyborg","GF63","Modern","Prestige","Raider","Stealth"],
 "Huawei":["MateBook D","MateBook X"],"Xiaomi":["RedmiBook","Mi Notebook"],"Microsoft":["Surface Laptop","Surface Pro"],"Samsung":["Galaxy Book"],"Gigabyte":["Aorus","G5"],"Razer":["Blade"]};
const TABLET_BRANDS = ["Apple","Samsung","Xiaomi","Lenovo","Huawei","Honor","Microsoft"];
const TV_BRANDS = ["Samsung","LG","Sony","Xiaomi","Philips","TCL","Hisense","Panasonic","Toshiba","Thomson","Haier","Telefunken"];
const CONSOLE_DB = {"PlayStation":["PS3","PS4","PS4 Slim","PS4 Pro","PS5","PS5 Digital","PS5 Slim","PS5 Pro","PS Vita","PS Portal"],"Xbox":["Xbox 360","Xbox One","Xbox One S","Xbox One X","Xbox Series S","Xbox Series X"],
 "Nintendo":["Switch","Switch Lite","Switch OLED","Switch 2","3DS"],"Steam Deck":["Steam Deck LCD","Steam Deck OLED"],"Другие":["ASUS ROG Ally","Lenovo Legion Go","Retro-консоль"]};
const AUDIO_BRANDS = ["Apple","Sony","JBL","Marshall","Bose","Sennheiser","Samsung","Xiaomi","Yamaha","Pioneer","Audio-Technica","Edifier"];
const PHOTO_BRANDS = ["Canon","Nikon","Sony","Fujifilm","Panasonic","Olympus","GoPro","DJI","Insta360"];

/* ---- Техника, одежда, животные, инструмент ---- */
const APPL_BRANDS = ["AEG","Beko","Bosch","Candy","Daikin","De'Longhi","Dyson","Electrolux","Gorenje","Gree","Haier","Hotpoint","Indesit","LG","Midea","Miele","Mitsubishi Electric","Philips","Rowenta","Samsung","Siemens","Tefal","Whirlpool","Xiaomi","Zanussi"];
const CLOTH_BRANDS = ["Adidas","Armani","Bershka","Calvin Klein","Columbia","Converse","Guess","H&M","Hugo Boss","Lacoste","Levi's","Mango","Massimo Dutti","Michael Kors","New Balance","Nike","Puma","Pull&Bear","Ralph Lauren","Reebok","Reserved","The North Face","Timberland","Tommy Hilfiger","Under Armour","Vans","Zara","Другой"];
const DOG_BREEDS = [["lab","Лабрадор","Labrador"],["golden","Золотистый ретривер","Golden retriever"],["shep","Немецкая овчарка","Ciobănesc german"],["malinois","Малинуа","Malinois"],["caucas","Кавказская овчарка","Ciobănesc caucazian"],
 ["alabai","Алабай","Alabai"],["husky","Хаски","Husky"],["malamute","Маламут","Malamut"],["rott","Ротвейлер","Rottweiler"],["doberman","Доберман","Doberman"],["cane","Кане-корсо","Cane Corso"],["boxer","Боксёр","Boxer"],
 ["amstaff","Амстафф","Amstaff"],["pitbull","Питбуль","Pitbull"],["beagle","Бигль","Beagle"],["corgi","Корги","Corgi"],["dachs","Такса","Teckel"],["spitz","Шпиц","Spitz"],["york","Йоркширский терьер","Yorkshire terrier"],
 ["chihuahua","Чихуахуа","Chihuahua"],["pug","Мопс","Pug"],["bulldog","Французский бульдог","Bulldog francez"],["shih","Ши-тцу","Shih Tzu"],["maltese","Мальтезе","Maltez"],["poodle","Пудель","Pudel"],["cocker","Кокер-спаниель","Cocker spaniel"],["mix","Метис","Metis"]];
const CAT_BREEDS = [["brit","Британская","Britanică"],["scot","Шотландская вислоухая","Scottish fold"],["scots","Шотландская прямоухая","Scottish straight"],["maine","Мейн-кун","Maine coon"],["sphynx","Сфинкс","Sphynx"],
 ["bengal","Бенгальская","Bengaleză"],["persian","Персидская","Persană"],["siam","Сиамская","Siameză"],["ragdoll","Рэгдолл","Ragdoll"],["russianblue","Русская голубая","Albastră rusească"],["exotic","Экзотическая","Exotică"],["siberian","Сибирская","Siberiană"],["none","Беспородная","Fără rasă"]];
const TOOL_BRANDS = ["Bosch","DeWalt","Einhell","Hilti","Hitachi / HiKOKI","Makita","Metabo","Milwaukee","Ryobi","Stanley","Stihl","Total","Другой"];
const HOUSE_SERIES = [["102","Серия 102","Seria 102"],["135","Серия 135","Seria 135"],["143","Серия 143","Seria 143"],["ms","Серия MS (чешка)","Seria MS (cehă)"],["khr","Хрущёвка","Hrușciovka"],["brezh","Брежневка","Brejnevka"],["stalin","Сталинка","Stalinka"],["indiv","Индивидуальный проект","Proiect individual"]];
