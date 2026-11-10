/* Project — каталог: регионы, категории, подкатегории, атрибуты для фильтров */
const RATE = 19.5; // лей за 1 € (демо-курс)
const REG = [
 ["all","Вся Молдова","Toată Moldova"],["chi","Кишинёв","Chișinău"],["bal","Бельцы","Bălți"],["cah","Кагул","Cahul"],
 ["com","Комрат","Comrat"],["ung","Унгены","Ungheni"],["orh","Орхей","Orhei"],["sor","Сороки","Soroca"],
 ["edi","Единцы","Edineț"],["hin","Хынчешты","Hîncești"],["str","Страшены","Strășeni"],["tir","Тирасполь","Tiraspol"]
];
// field: k, ru, ro, t: sel|rng, opts: [value] or [value, ru, ro], only: [sub indexes], u: unit
/* подпись значения атрибута на нужном языке */
function lbl(opts,v,lang="ru"){ const o = opts.find(o=>(Array.isArray(o)?o[0]:o)==v); return o==null? String(v) : Array.isArray(o)? o[lang==="ru"?1:2] : o; }
const optV = o => Array.isArray(o)?o[0]:o;
const FUEL=[["petrol","Бензин","Benzină"],["diesel","Дизель","Motorină"],["gas","Газ/бензин","Gaz/benzină"],["hybrid","Гибрид","Hibrid"],["electric","Электро","Electric"]];
const GEAR=[["auto","Автомат","Automată"],["manual","Механика","Manuală"]];
const BODY=[["sedan","Седан","Sedan"],["wagon","Универсал","Universal"],["hatch","Хэтчбек","Hatchback"],["suv","Внедорожник","SUV"],["van","Минивэн","Monovolum"]];
const RSTATE=[["euro","Евроремонт","Euroreparație"],["white","Белый вариант","Variantă albă"],["grey","Серый вариант","Variantă sură"],["needs","Требует ремонта","Necesită reparație"]];
const BUILD=[["new","Новострой","Bloc nou"],["old","Вторичка","Secundar"]];
const CPU=["Intel Core i3-12100F","AMD Ryzen 5 5600","Intel Core i5-12400F","AMD Ryzen 5 7600","Intel Core i5-13600K","AMD Ryzen 7 5800X3D","Intel Core i7-13700K","AMD Ryzen 7 7800X3D","Intel Core i9-13900K"];
const GPU=["GTX 1660 Super","RX 6600","RTX 3060","RX 7600","RTX 4060","RTX 3070","RTX 4060 Ti","RX 7800 XT","RTX 4070","RTX 4070 Super","RTX 4080 Super"];
const CATS = [
 {id:"auto",ic:"car",c:"#2563eb",ru:"Транспорт",ro:"Transport",
  subs:[["Легковые","Autoturisme"],["Грузовые","Camioane"],["Мото","Moto"],["Автобусы и микроавтобусы","Autobuze și microbuze"],["Спецтехника","Tehnică specială"],["Прицепы","Remorci"],["Запчасти","Piese auto"],["Шины и диски","Anvelope și jante"],["Водный транспорт","Transport pe apă"]],
  fields:[
   {k:"brand",ru:"Марка",ro:"Marca",t:"sel",only:[0],opts:["Toyota","Volkswagen","BMW","Mercedes-Benz","Skoda","Dacia","Renault","Hyundai","Kia","Ford","Opel","Lexus","Tesla"]},
   {k:"brand",ru:"Марка",ro:"Marca",t:"sel",only:[1,3],opts:["Mercedes-Benz","MAN","DAF","Iveco","Volkswagen","Ford"]},
   {k:"brand",ru:"Марка",ro:"Marca",t:"sel",only:[2],opts:["Honda","Yamaha","Kawasaki","BMW","Suzuki"]},
   {k:"year",ru:"Год выпуска",ro:"Anul fabricației",t:"rng",only:[0,1,2,3,4]},
   {k:"mileage",ru:"Пробег",ro:"Rulaj",t:"rng",u:"км",only:[0,1,2,3]},
   {k:"fuel",ru:"Топливо",ro:"Combustibil",t:"sel",only:[0,1,3],opts:FUEL},
   {k:"gearbox",ru:"КПП",ro:"Cutia de viteze",t:"sel",only:[0,3],opts:GEAR},
   {k:"body",ru:"Кузов",ro:"Caroserie",t:"sel",only:[0],opts:BODY}]},
 {id:"real",ic:"house",c:"#0f766e",ru:"Недвижимость",ro:"Imobiliare",
  subs:[["Квартиры","Apartamente"],["Дома и дачи","Case și vile"],["Аренда квартир","Chirie apartamente"],["Посуточно","Chirie pe zi"],["Участки","Terenuri"],["Коммерческая","Spații comerciale"],["Гаражи","Garaje"]],
  fields:[
   {k:"rooms",ru:"Комнат",ro:"Camere",t:"sel",only:[0,2,3],opts:[["1","1","1"],["2","2","2"],["3","3","3"],["4","4+","4+"]]},
   {k:"area",ru:"Площадь",ro:"Suprafața",t:"rng",u:"м²",only:[0,1,2,3,5]},
   {k:"floor",ru:"Этаж",ro:"Etaj",t:"rng",only:[0,2]},
   {k:"sector",ru:"Район",ro:"Sector",t:"sel",only:[0,2,3],opts:[["Центр","Центр","Centru"],["Ботаника","Ботаника","Botanica"],["Рышкановка","Рышкановка","Râșcani"],["Чеканы","Чеканы","Ciocana"],["Буюканы","Буюканы","Buiucani"],["Телецентр","Телецентр","Telecentru"],["Скулянка","Скулянка","Sculeni"]]},
   {k:"state",ru:"Ремонт",ro:"Starea",t:"sel",only:[0,1],opts:RSTATE},
   {k:"building",ru:"Тип дома",ro:"Tip bloc",t:"sel",only:[0],opts:BUILD},
   {k:"land",ru:"Участок",ro:"Teren",t:"rng",u:"соток",only:[1,4]}]},
 {id:"job",ic:"briefcase",c:"#7c3aed",ru:"Работа",ro:"Job",
  subs:[["Вакансии","Locuri de muncă"],["Резюме","CV-uri"],["Подработка","Part-time"]],
  fields:[
   {k:"schedule",ru:"График",ro:"Program",t:"sel",opts:[["full","Полный день","Normă întreagă"],["shift","Сменный","În ture"],["remote","Удалённо","La distanță"],["part","Частичная занятость","Parțial"]]},
   {k:"sphere",ru:"Сфера",ro:"Domeniu",t:"sel",opts:[["sales","Продажи","Vânzări"],["it","IT","IT"],["transport","Транспорт","Transport"],["food","Общепит","HoReCa"],["build","Строительство","Construcții"],["office","Офис","Birou"]]}]},
 {id:"elec",ic:"smartphone",c:"#0891b2",ru:"Электроника",ro:"Electronice",
  subs:[["Телефоны","Telefoane"],["Ноутбуки","Laptopuri"],["Компьютеры (ПК)","Calculatoare (PC)"],["Планшеты","Tablete"],["Телевизоры","Televizoare"],["Аудио","Audio"],["Фото и видео","Foto și video"],["Игровые приставки","Console de jocuri"],["Комплектующие","Componente"]],
  fields:[
   {k:"brand",ru:"Бренд",ro:"Brand",t:"sel",only:[0,3],opts:["Apple","Samsung","Xiaomi","Google"]},
   {k:"brand",ru:"Бренд",ro:"Brand",t:"sel",only:[1],opts:["Apple","Lenovo","ASUS","HP","Acer","Dell"]},
   {k:"brand",ru:"Бренд",ro:"Brand",t:"sel",only:[4],opts:["Samsung","LG","Sony","Xiaomi"]},
   {k:"cpu",ru:"Процессор",ro:"Procesor",t:"sel",only:[2],opts:CPU},
   {k:"gpu",ru:"Видеокарта",ro:"Placă video",t:"sel",only:[2,8],opts:GPU},
   {k:"ram",ru:"Оперативная память",ro:"Memorie RAM",t:"rng",u:"ГБ",only:[0,1,2,3]},
   {k:"storage",ru:"Накопитель",ro:"Stocare",t:"rng",u:"ГБ",only:[0,1,2,3]},
   {k:"screen",ru:"Диагональ",ro:"Diagonala",t:"rng",u:"\"",only:[4]}]},
 {id:"home",ic:"sofa",c:"#b45309",ru:"Дом и сад",ro:"Casă și grădină",
  subs:[["Мебель","Mobilă"],["Кухни","Bucătării"],["Освещение","Iluminat"],["Декор и ковры","Decor și covoare"],["Сад и огород","Grădină"],["Текстиль","Textile"]],
  fields:[{k:"material",ru:"Материал",ro:"Material",t:"sel",only:[0,1],opts:[["wood","Дерево","Lemn"],["chip","ДСП/МДФ","PAL/MDF"],["metal","Металл","Metal"],["fabric","Ткань","Țesătură"]]}]},
 {id:"appl",ic:"washing-machine",c:"#475569",ru:"Бытовая техника",ro:"Electrocasnice",
  subs:[["Холодильники","Frigidere"],["Стиральные машины","Mașini de spălat"],["Плиты и духовки","Aragaze și cuptoare"],["Кондиционеры","Aparate de aer condiționat"],["Пылесосы","Aspiratoare"],["Мелкая техника","Electrocasnice mici"]],
  fields:[{k:"brand",ru:"Бренд",ro:"Brand",t:"sel",opts:["Bosch","Samsung","LG","Electrolux","Beko","Gree","Xiaomi","Philips"]}]},
 {id:"cloth",ic:"shirt",c:"#db2777",ru:"Одежда и обувь",ro:"Haine și încălțăminte",
  subs:[["Женская одежда","Haine pentru femei"],["Мужская одежда","Haine pentru bărbați"],["Обувь","Încălțăminte"],["Сумки и аксессуары","Genți și accesorii"]],
  fields:[{k:"size",ru:"Размер",ro:"Mărime",t:"sel",only:[0,1],opts:["XS","S","M","L","XL","XXL"]},{k:"shoe",ru:"Размер обуви",ro:"Mărime încălțăminte",t:"rng",only:[2]}]},
 {id:"kids",ic:"baby",c:"#f59e0b",ru:"Детский мир",ro:"Lumea copiilor",
  subs:[["Коляски","Cărucioare"],["Автокресла","Scaune auto"],["Игрушки","Jucării"],["Детская мебель","Mobilă pentru copii"],["Детская одежда","Haine pentru copii"]],
  fields:[{k:"age",ru:"Возраст",ro:"Vârsta",t:"sel",opts:[["0","0–1 год","0–1 an"],["1","1–3 года","1–3 ani"],["3","3–7 лет","3–7 ani"],["7","7+ лет","7+ ani"]]}]},
 {id:"build",ic:"hammer",c:"#a16207",ru:"Стройка и ремонт",ro:"Construcții și reparații",
  subs:[["Стройматериалы","Materiale"],["Инструменты","Unelte"],["Сантехника","Sanitare"],["Электрика","Electrice"],["Двери и окна","Uși și geamuri"]]},
 {id:"serv",ic:"wrench",c:"#0d9488",ru:"Услуги",ro:"Servicii",
  subs:[["Ремонт и отделка","Reparații și finisări"],["Перевозки","Transportări"],["Обучение","Educație"],["Красота","Frumusețe"],["IT-услуги","Servicii IT"],["Ремонт техники","Reparație tehnică"],["Уборка","Curățenie"]]},
 {id:"pets",ic:"paw-print",c:"#ea580c",ru:"Животные",ro:"Animale",
  subs:[["Собаки","Câini"],["Кошки","Pisici"],["Птицы","Păsări"],["Аквариумистика","Acvaristică"],["Товары для животных","Accesorii"]]},
 {id:"sport",ic:"bike",c:"#16a34a",ru:"Спорт и хобби",ro:"Sport și hobby",
  subs:[["Велосипеды","Biciclete"],["Тренажёры","Aparate fitness"],["Туризм","Turism"],["Зимний спорт","Sporturi de iarnă"],["Музыкальные инструменты","Instrumente muzicale"],["Книги","Cărți"]]},
 {id:"agro",ic:"tractor",c:"#65a30d",ru:"Сельхоз",ro:"Agricultură",
  subs:[["Сельхозтехника","Tehnică agricolă"],["Урожай","Recoltă"],["Скот и птица","Animale și păsări"],["Саженцы","Puieți"],["Корма и удобрения","Furaje și îngrășăminte"]]},
 {id:"biz",ic:"building-2",c:"#334155",ru:"Бизнес",ro:"Business",
  subs:[["Оборудование","Echipament"],["Готовый бизнес","Afacere gata"],["Помещения","Spații"]]},
 {id:"free",ic:"gift",c:"#e11d48",ru:"Отдам даром",ro:"Gratuit",
  subs:[["Вещи","Lucruri"],["Мебель","Mobilă"],["Животные","Animale"]]},
 {id:"misc",ic:"package",c:"#64748b",ru:"Разное",ro:"Diverse",
  subs:[["Коллекции","Colecții"],["Билеты","Bilete"],["Другое","Altele"]]}
];
CATS.forEach(c=>c.fields=c.fields||[]);
const SIC={auto:["car","truck","bike","bus","tractor","caravan","wrench","disc","sailboat"],real:["building","house","key","bed","trees","store","warehouse"],
 elec:["smartphone","laptop","monitor","tablet","tv","headphones","camera","gamepad-2","cpu"]};
const icOf = a => (SIC[a.cat]||[])[a.sub] || catOf(a.cat).ic;

