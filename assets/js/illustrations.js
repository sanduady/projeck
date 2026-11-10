/* Project — собственные векторные иллюстрации товаров для демо-объявлений.
   Нарисованы для макета (не фотографии и не взяты из сторонних источников).
   Реальные объявления будут показывать фотографии, загруженные продавцами. */

const svgURI = s => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s).replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/'/g,"%27");
const shade = (hex, k) => { const n = parseInt(hex.slice(1),16); const f = c => Math.max(0,Math.min(255,Math.round(c*k)));
  return "#"+[f(n>>16),f((n>>8)&255),f(n&255)].map(x=>x.toString(16).padStart(2,"0")).join(""); };
const SH = (cx=200, cy=240, rx=150) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="12" fill="#000" opacity=".13"/>`;

const DRAW = {
  car(c, type="hatch"){
    const suv = type==="suv", sedan = type==="sedan", up = suv ? 14 : 0, d = shade(c,.78);
    const roofEnd = sedan ? 250 : 268, rear = sedan ? `L300 150 L346 152 Q352 158 352 170` : `Q284 104 296 118 L326 150 Q346 152 350 166`;
    return `${SH(205,240,160)}
    <path d="M56 205 L62 165 Q70 152 104 150 L144 ${114-up} Q154 ${104-up} 176 ${104-up} L${roofEnd} ${104-up} ${rear} L352 205 Z" fill="${c}"/>
    <path d="M150 ${120-up} L188 ${117-up} L188 147 L126 147 Z" fill="#d7ecf7" stroke="${d}" stroke-width="3"/>
    <path d="M196 ${117-up} L${sedan?244:262} ${117-up} L${sedan?280:288} 147 L196 147 Z" fill="#d7ecf7" stroke="${d}" stroke-width="3"/>
    <rect x="56" y="192" width="296" height="14" rx="4" fill="${d}"/>
    <rect x="58" y="164" width="18" height="10" rx="3" fill="#ffd66b"/><rect x="334" y="164" width="16" height="10" rx="3" fill="#e5484d"/>
    <rect x="196" y="160" width="20" height="4" rx="2" fill="${d}"/><rect x="250" y="160" width="20" height="4" rx="2" fill="${d}"/>
    ${[118,292].map(x=>`<circle cx="${x}" cy="206" r="${suv?30:27}" fill="#1f2326"/><circle cx="${x}" cy="206" r="${suv?15:13}" fill="#c9ced3"/><circle cx="${x}" cy="206" r="4" fill="#6b7177"/>`).join("")}`;
  },
  moto(c){ const d = shade(c,.7);
    return `${SH(205,252,150)}
    ${[118,292].map(x=>`<circle cx="${x}" cy="212" r="38" fill="none" stroke="#1f2326" stroke-width="12"/><circle cx="${x}" cy="212" r="8" fill="#9aa1a7"/>`).join("")}
    <path d="M118 212 L180 160 L250 160 L292 212" fill="none" stroke="#3b4046" stroke-width="8" stroke-linejoin="round"/>
    <path d="M250 160 L272 112" stroke="#3b4046" stroke-width="7"/><path d="M258 108 L296 102" stroke="#1f2326" stroke-width="7" stroke-linecap="round"/>
    <path d="M170 150 Q172 120 214 120 L246 124 Q256 140 246 156 L176 160 Z" fill="${c}"/>
    <path d="M120 146 Q150 134 178 142 L176 156 L122 158 Z" fill="#1f2326"/>
    <rect x="186" y="164" width="48" height="26" rx="6" fill="${d}"/><circle cx="276" cy="124" r="9" fill="#ffd66b"/>`; },
  phone(c, back=false){
    return `${SH(200,262,80)}<rect x="146" y="34" width="108" height="222" rx="22" fill="${c}"/>` + (back
      ? `<rect x="160" y="48" width="56" height="56" rx="14" fill="${shade(c,.7)}"/>${[[176,64],[200,64],[176,88]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#111" stroke="#666" stroke-width="2"/>`).join("")}<circle cx="200" cy="88" r="4" fill="#ffe9a8"/>`
      : `<rect x="154" y="42" width="92" height="206" rx="16" fill="#0f1115"/><rect x="158" y="46" width="84" height="198" rx="13" fill="url(#scr)"/>
         <rect x="184" y="52" width="32" height="10" rx="5" fill="#0f1115"/>
         ${[0,1,2,3].map(r=>[0,1,2].map(k=>`<rect x="${168+k*24}" y="${80+r*28}" width="16" height="16" rx="5" fill="#fff" opacity=".75"/>`).join("")).join("")}`)
      + `<defs><linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#2fb4c9"/></linearGradient></defs>`; },
  laptop(c){ return `${SH(200,236,150)}<rect x="96" y="58" width="208" height="140" rx="10" fill="${c}"/><rect x="106" y="68" width="188" height="120" rx="4" fill="#2d6fcf"/>
    <rect x="116" y="80" width="90" height="56" rx="4" fill="#fff" opacity=".9"/><rect x="214" y="80" width="70" height="26" rx="4" fill="#fff" opacity=".6"/><rect x="214" y="112" width="70" height="64" rx="4" fill="#fff" opacity=".45"/><rect x="116" y="144" width="90" height="32" rx="4" fill="#fff" opacity=".55"/>
    <path d="M70 200 L330 200 L350 224 Q350 228 344 228 L56 228 Q50 228 50 224 Z" fill="#cfd4da"/><rect x="176" y="200" width="48" height="6" rx="3" fill="#a9b0b8"/><circle cx="160" cy="214" r="3" fill="#e5484d"/>`; },
  pc(){ return `${SH(200,250,170)}<rect x="40" y="56" width="210" height="136" rx="8" fill="#16181d"/><rect x="48" y="64" width="194" height="118" rx="3" fill="url(#gm)"/>
    <path d="M48 160 L110 118 L150 140 L200 100 L242 132 L242 182 L48 182Z" fill="#0d3b2f" opacity=".85"/><circle cx="200" cy="88" r="12" fill="#ffd66b"/>
    <rect x="132" y="192" width="26" height="30" fill="#2a2d33"/><rect x="104" y="220" width="82" height="10" rx="4" fill="#2a2d33"/>
    <rect x="270" y="70" width="92" height="170" rx="10" fill="#1d2026"/><rect x="278" y="80" width="76" height="150" rx="6" fill="#0c0e12" stroke="#7b5cff" stroke-width="2"/>
    ${[110,150,190].map(y=>`<circle cx="316" cy="${y}" r="16" fill="none" stroke="#c6f24e" stroke-width="4" opacity=".9"/><circle cx="316" cy="${y}" r="5" fill="#7b5cff"/>`).join("")}
    <defs><linearGradient id="gm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a5c"/><stop offset="1" stop-color="#7b5cff"/></linearGradient></defs>`; },
  tv(){ return `${SH(200,248,140)}<rect x="40" y="42" width="320" height="186" rx="8" fill="#101216"/><rect x="48" y="50" width="304" height="170" rx="3" fill="url(#sky)"/>
    <circle cx="282" cy="96" r="22" fill="#ffe08a"/><path d="M48 186 Q120 130 190 168 T352 150 L352 220 L48 220Z" fill="#1f7a5a"/><path d="M48 205 Q150 168 250 196 T352 190 L352 220 L48 220Z" fill="#0f5c45"/>
    <rect x="150" y="228" width="100" height="8" rx="4" fill="#2a2d33"/>
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8f6b"/><stop offset="1" stop-color="#ffd3a1"/></linearGradient></defs>`; },
  washer(){ return `${SH(200,256,90)}<rect x="122" y="40" width="156" height="210" rx="14" fill="#fbfcfd" stroke="#cfd6dc" stroke-width="3"/>
    <line x1="122" y1="80" x2="278" y2="80" stroke="#cfd6dc" stroke-width="3"/><rect x="136" y="54" width="54" height="14" rx="4" fill="#e3e8ec"/><circle cx="252" cy="61" r="10" fill="#e3e8ec" stroke="#aab4bc" stroke-width="2"/>
    <circle cx="200" cy="160" r="58" fill="#e3e8ec"/><circle cx="200" cy="160" r="46" fill="#9fcbe8" stroke="#7fa7c2" stroke-width="4"/><path d="M162 168 Q200 150 238 168 L238 180 Q200 206 162 180Z" fill="#6aa9d6" opacity=".7"/>`; },
  ac(){ return `<rect x="0" y="0" width="400" height="300" fill="#f3f6f8" opacity=".35"/><rect x="62" y="70" width="276" height="92" rx="24" fill="#fff" stroke="#d3dbe1" stroke-width="3"/>
    <rect x="80" y="136" width="240" height="10" rx="5" fill="#e3e8ec"/><circle cx="310" cy="100" r="5" fill="#2fb4c9"/><text x="96" y="108" font-family="Arial" font-size="18" font-weight="700" fill="#9aa6af">22°</text>
    ${[0,1,2].map(i=>`<path d="M${130+i*60} 176 q12 16 0 32 q-12 16 0 32" fill="none" stroke="#7cc4e8" stroke-width="5" stroke-linecap="round" opacity=".8"/>`).join("")}`; },
  sofa(c){ const d = shade(c,.8); return `${SH(200,236,165)}<rect x="40" y="96" width="320" height="70" rx="20" fill="${d}"/>
    <rect x="60" y="76" width="96" height="70" rx="16" fill="${c}"/><rect x="164" y="76" width="96" height="70" rx="16" fill="${c}"/><rect x="268" y="76" width="80" height="70" rx="16" fill="${c}"/>
    <rect x="34" y="150" width="332" height="56" rx="18" fill="${c}"/><rect x="34" y="120" width="34" height="86" rx="14" fill="${d}"/><rect x="332" y="120" width="34" height="86" rx="14" fill="${d}"/>
    <rect x="84" y="128" width="50" height="30" rx="10" fill="#f2c94c"/><rect x="60" y="206" width="10" height="20" fill="#5b4636"/><rect x="330" y="206" width="10" height="20" fill="#5b4636"/>`; },
  stroller(c){ return `${SH(200,256,120)}<path d="M110 120 A90 90 0 0 0 290 120 Z" fill="${c}"/><path d="M110 120 A90 90 0 0 1 200 30 L200 120 Z" fill="${shade(c,.75)}"/>
    <path d="M290 120 L330 70" stroke="#2a2d33" stroke-width="8" stroke-linecap="round"/><path d="M322 66 L344 74" stroke="#2a2d33" stroke-width="10" stroke-linecap="round"/>
    <path d="M150 190 L130 226 M250 190 L270 226 M150 190 L250 190" stroke="#2a2d33" stroke-width="6"/>${[130,270].map(x=>`<circle cx="${x}" cy="228" r="22" fill="#1f2326"/><circle cx="${x}" cy="228" r="8" fill="#c9ced3"/>`).join("")}`; },
  bike(c){ return `${SH(200,262,150)}${[120,290].map(x=>`<circle cx="${x}" cy="200" r="54" fill="none" stroke="#1f2326" stroke-width="9"/><circle cx="${x}" cy="200" r="6" fill="#888"/>`).join("")}
    <path d="M120 200 L180 128 L268 128 L290 200 M180 128 L205 200 L268 128 M205 200 L120 200" fill="none" stroke="${c}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M180 128 L170 104" stroke="${c}" stroke-width="8"/><path d="M152 100 L190 100" stroke="#1f2326" stroke-width="9" stroke-linecap="round"/>
    <path d="M268 128 L276 98 L302 92" fill="none" stroke="#1f2326" stroke-width="7" stroke-linecap="round"/><circle cx="205" cy="200" r="12" fill="#3b4046"/>`; },
  guitar(){ return `<g transform="rotate(-28 200 160)">${SH(200,262,90)}<rect x="190" y="8" width="20" height="150" rx="4" fill="#5b3a22"/><rect x="184" y="0" width="32" height="34" rx="6" fill="#3d2616"/>
    <circle cx="200" cy="230" r="66" fill="#c97b3d"/><circle cx="200" cy="160" r="48" fill="#c97b3d"/><circle cx="200" cy="196" r="20" fill="#2a1a10"/>
    <rect x="178" y="250" width="44" height="10" rx="3" fill="#3d2616"/>${[194,198,202,206].map(x=>`<line x1="${x}" y1="20" x2="${x}" y2="254" stroke="#e8e2d6" stroke-width="1.2"/>`).join("")}</g>`; },
  tools(){ return `${SH(200,250,120)}<rect x="120" y="50" width="160" height="180" rx="22" fill="#fff" stroke="#d3dbe1" stroke-width="3"/>
    <rect x="148" y="84" width="104" height="112" rx="18" fill="#f1f4f6"/><circle cx="182" cy="140" r="9" fill="#2a2d33"/><circle cx="218" cy="140" r="9" fill="#2a2d33"/>
    <path d="M300 40 L262 120 L292 120 L270 196 L330 104 L298 104 L318 40 Z" fill="#f5c518" stroke="#d29c00" stroke-width="3" stroke-linejoin="round"/>
    <path d="M60 200 L120 150" stroke="#e5484d" stroke-width="12" stroke-linecap="round"/><path d="M52 210 L70 192" stroke="#2a2d33" stroke-width="14" stroke-linecap="round"/>`; },
  lesson(){ return `${SH(200,250,140)}<path d="M60 90 Q130 70 198 96 L198 236 Q130 210 60 228 Z" fill="#fff" stroke="#cfd6dc" stroke-width="3"/><path d="M340 90 Q270 70 202 96 L202 236 Q270 210 340 228 Z" fill="#fff" stroke="#cfd6dc" stroke-width="3"/>
    ${[0,1,2,3,4].map(i=>`<rect x="80" y="${118+i*20}" width="${96-i*8}" height="6" rx="3" fill="#c5ced5"/><rect x="222" y="${118+i*20}" width="${96-i*6}" height="6" rx="3" fill="#c5ced5"/>`).join("")}
    <rect x="232" y="24" width="120" height="58" rx="16" fill="#0f5c45"/><path d="M256 82 L250 100 L274 82Z" fill="#0f5c45"/><text x="292" y="62" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" fill="#c6f24e">Bună!</text>`; },
  register(){ return `${SH(200,252,140)}<rect x="88" y="130" width="224" height="110" rx="12" fill="#2f3a45"/><rect x="104" y="146" width="120" height="78" rx="6" fill="#3e4b57"/>
    ${[0,1,2].map(r=>[0,1,2,3].map(k=>`<rect x="${112+k*28}" y="${154+r*22}" width="20" height="14" rx="3" fill="#cfd6dc"/>`).join("")).join("")}
    <rect x="236" y="146" width="62" height="78" rx="6" fill="#c6f24e"/><rect x="236" y="50" width="62" height="96" fill="#fff" stroke="#d3dbe1" stroke-width="2"/>
    ${[0,1,2,3].map(i=>`<rect x="246" y="${64+i*16}" width="${40-i*4}" height="5" rx="2" fill="#aab4bc"/>`).join("")}<rect x="120" y="86" width="96" height="40" rx="6" fill="#16181d"/><text x="168" y="113" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#5fe3a1">125.00</text>`; },
  cat(){ return `${SH(200,262,110)}<ellipse cx="200" cy="222" rx="96" ry="44" fill="#9aa3ab"/><circle cx="200" cy="146" r="80" fill="#a9b2ba"/>
    <path d="M128 100 Q120 76 150 82 Q150 96 140 104Z" fill="#8d969e"/><path d="M272 100 Q280 76 250 82 Q250 96 260 104Z" fill="#8d969e"/>
    <circle cx="170" cy="140" r="17" fill="#f5c518"/><circle cx="230" cy="140" r="17" fill="#f5c518"/><ellipse cx="170" cy="142" rx="6" ry="13" fill="#1f2326"/><ellipse cx="230" cy="142" rx="6" ry="13" fill="#1f2326"/>
    <path d="M192 172 L208 172 L200 182Z" fill="#e58a9a"/><path d="M200 182 Q190 194 180 188 M200 182 Q210 194 220 188" fill="none" stroke="#5b6168" stroke-width="3" stroke-linecap="round"/>
    ${[-1,1].map(s=>[0,1].map(i=>`<line x1="${200+s*30}" y1="${176+i*8}" x2="${200+s*82}" y2="${168+i*16}" stroke="#eef1f3" stroke-width="2"/>`).join("")).join("")}`; },
  honey(){ return `${SH(200,256,90)}<rect x="132" y="70" width="136" height="180" rx="30" fill="#f2a516" opacity=".95"/><rect x="132" y="70" width="136" height="180" rx="30" fill="none" stroke="#c98400" stroke-width="3"/>
    <rect x="144" y="40" width="112" height="34" rx="8" fill="#5b3a22"/><rect x="150" y="130" width="100" height="60" rx="10" fill="#fff8e1"/>
    <text x="200" y="168" text-anchor="middle" font-family="Georgia" font-size="22" font-weight="700" fill="#8a5a00">Miere</text><path d="M150 96 Q170 110 160 124" stroke="#ffd36b" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/>`; },
  flat(c){ return `<rect x="0" y="210" width="400" height="90" fill="#c9a27c"/><rect x="0" y="0" width="400" height="210" fill="${c}"/>
    <rect x="232" y="34" width="120" height="132" rx="4" fill="#fff"/><rect x="240" y="42" width="104" height="116" fill="#bfe3f5"/><line x1="292" y1="42" x2="292" y2="158" stroke="#fff" stroke-width="5"/>
    <rect x="28" y="140" width="170" height="54" rx="14" fill="#5f8f7a"/><rect x="38" y="114" width="70" height="40" rx="10" fill="#6fa18a"/><rect x="118" y="114" width="70" height="40" rx="10" fill="#6fa18a"/>
    <rect x="34" y="194" width="8" height="16" fill="#5b4636"/><rect x="184" y="194" width="8" height="16" fill="#5b4636"/>
    <rect x="212" y="122" width="6" height="88" fill="#2a2d33"/><path d="M196 122 L234 122 L224 96 L206 96Z" fill="#f5c518"/>
    <rect x="340" y="176" width="30" height="34" rx="4" fill="#b66a3c"/><circle cx="355" cy="160" r="22" fill="#2f8f5b"/>`; },
  building(){ return `<rect x="0" y="236" width="400" height="64" fill="#cfe3d6"/><rect x="118" y="28" width="164" height="212" fill="#f4efe6" stroke="#d7cdbd" stroke-width="3"/>
    ${[0,1,2,3,4,5,6,7].map(r=>[0,1,2,3].map(k=>`<rect x="${132+k*36}" y="${40+r*24}" width="24" height="15" rx="2" fill="${(r+k)%3?"#a8d1ea":"#ffe3a1"}"/>`).join("")).join("")}
    <rect x="182" y="210" width="36" height="30" fill="#5b4636"/><path d="M300 236 L300 60 L360 60" fill="none" stroke="#f5a524" stroke-width="5"/><line x1="350" y1="60" x2="350" y2="110" stroke="#2a2d33" stroke-width="2"/>
    <circle cx="70" cy="214" r="26" fill="#2f8f5b"/><rect x="66" y="214" width="8" height="24" fill="#5b4636"/>`; },
  house(){ return `<rect x="0" y="232" width="400" height="68" fill="#9fd08a"/><path d="M80 130 L200 50 L320 130 Z" fill="#b5523b"/><rect x="100" y="128" width="200" height="108" fill="#f4e7d3"/>
    <rect x="186" y="176" width="36" height="60" fill="#5b4636"/><rect x="122" y="150" width="44" height="38" fill="#a8d1ea" stroke="#fff" stroke-width="4"/><rect x="242" y="150" width="44" height="38" fill="#a8d1ea" stroke="#fff" stroke-width="4"/>
    <rect x="300" y="168" width="78" height="68" fill="#e6d6be"/><rect x="310" y="186" width="58" height="50" fill="#9aa3ab"/>${[0,1,2,3].map(i=>`<line x1="310" y1="${196+i*10}" x2="368" y2="${196+i*10}" stroke="#7b848c" stroke-width="2"/>`).join("")}
    <circle cx="44" cy="196" r="30" fill="#2f8f5b"/><rect x="40" y="200" width="8" height="34" fill="#5b4636"/>`; }
};
const BGS = [["#eef4f1","#dcebe3"],["#f3eefb","#e3dbf5"],["#fbf3e8","#f3e2c9"],["#eaf2fb","#d6e6f6"]];
function illustrate(name, ...args){
  const body = DRAW[name](...args);
  const mk = (bg, view, mirror) => svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" preserveAspectRatio="xMidYMid slice" width="800" height="600">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>
    <rect x="-200" y="-200" width="800" height="700" fill="url(#bg)"/>${mirror?`<g transform="translate(400 0) scale(-1 1)">${body}</g>`:body}</svg>`);
  const h = name.length;
  return [mk(BGS[h%4],"0 0 400 300",false), mk(BGS[(h+1)%4],"70 40 260 195",false), mk(BGS[(h+2)%4],"0 0 400 300",true)];
}

Object.assign(DRAW, {
  van(c){ return `${SH(200,240,165)}<rect x="36" y="64" width="216" height="134" rx="8" fill="#f4f6f8" stroke="#cfd6dc" stroke-width="3"/><rect x="36" y="150" width="216" height="10" fill="${c}"/>
    <path d="M252 104 L312 104 L352 146 L352 200 L252 200Z" fill="${c}"/><path d="M264 116 L308 116 L336 146 L264 146Z" fill="#d7ecf7"/><rect x="36" y="196" width="318" height="12" rx="4" fill="#3b4046"/>
    <rect x="340" y="164" width="12" height="10" rx="2" fill="#ffd66b"/>${[100,300].map(x=>`<circle cx="${x}" cy="208" r="25" fill="#1f2326"/><circle cx="${x}" cy="208" r="10" fill="#c9ced3"/>`).join("")}`; },
  tire(){ return `${SH(200,262,110)}<circle cx="200" cy="150" r="104" fill="#22262a"/>${Array.from({length:24},(_,i)=>`<rect x="196" y="44" width="8" height="14" rx="2" fill="#3a3f45" transform="rotate(${i*15} 200 150)"/>`).join("")}
    <circle cx="200" cy="150" r="62" fill="#c9ced3"/>${[0,72,144,216,288].map(r=>`<rect x="193" y="96" width="14" height="44" rx="6" fill="#9aa1a7" transform="rotate(${r} 200 150)"/>`).join("")}<circle cx="200" cy="150" r="18" fill="#6b7177"/>`; },
  boat(c){ return `<rect x="0" y="200" width="400" height="100" fill="#6fb3d9"/><path d="M0 214 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>
    <path d="M70 160 L330 160 L300 214 L100 214 Z" fill="${c}"/><rect x="70" y="156" width="260" height="8" fill="#fff"/><path d="M150 160 L170 118 L250 118 L262 160Z" fill="#f4f6f8" stroke="#cfd6dc" stroke-width="3"/>
    <path d="M178 126 L244 126 L252 152 L170 152Z" fill="#a8d1ea"/><rect x="330" y="150" width="18" height="44" rx="4" fill="#2a2d33"/>`; },
  gear(){ return `${SH(200,262,100)}<g fill="#8f989f">${Array.from({length:10},(_,i)=>`<rect x="186" y="42" width="28" height="34" rx="4" transform="rotate(${i*36} 200 150)"/>`).join("")}<circle cx="200" cy="150" r="88"/></g>
    <circle cx="200" cy="150" r="64" fill="#a9b2ba"/><circle cx="200" cy="150" r="28" fill="#5b6168"/><circle cx="200" cy="150" r="12" fill="#2a2d33"/>`; },
  land(trees=false){ return `<rect x="0" y="0" width="400" height="140" fill="#cfe9f7"/><circle cx="330" cy="54" r="24" fill="#ffe08a"/>
    <path d="M0 140 Q100 116 200 132 T400 124 L400 300 L0 300Z" fill="#a3cf7c"/>${[0,1,2,3,4].map(i=>`<path d="M${-40+i*20} 300 L${120+i*60} 150" stroke="#8cbc63" stroke-width="10" opacity=".7"/>`).join("")}
    ${trees?[[60,150],[110,140],[300,146],[350,152]].map(([x,y])=>`<rect x="${x-4}" y="${y}" width="8" height="22" fill="#5b4636"/><circle cx="${x}" cy="${y-6}" r="22" fill="#2f8f5b"/>`).join(""):
      `${Array.from({length:12},(_,i)=>`<rect x="${20+i*32}" y="196" width="6" height="40" fill="#8a6a4a"/>`).join("")}<rect x="16" y="204" width="370" height="5" fill="#8a6a4a"/><rect x="16" y="222" width="370" height="5" fill="#8a6a4a"/>`}`; },
  tablet(c){ return `${SH(200,250,140)}<rect x="66" y="56" width="268" height="186" rx="18" fill="${c}"/><rect x="78" y="68" width="244" height="162" rx="8" fill="url(#tb)"/>
    <rect x="94" y="84" width="100" height="62" rx="8" fill="#fff" opacity=".85"/><rect x="204" y="84" width="102" height="130" rx="8" fill="#fff" opacity=".55"/><rect x="94" y="154" width="100" height="60" rx="8" fill="#fff" opacity=".7"/>
    <defs><linearGradient id="tb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f8bff"/><stop offset="1" stop-color="#7b5cff"/></linearGradient></defs>`; },
  headphones(c){ return `${SH(200,258,110)}<path d="M100 180 Q100 50 200 50 Q300 50 300 180" fill="none" stroke="${c}" stroke-width="18" stroke-linecap="round"/>
    <rect x="72" y="160" width="62" height="88" rx="26" fill="${c}"/><rect x="266" y="160" width="62" height="88" rx="26" fill="${c}"/><rect x="88" y="174" width="30" height="60" rx="14" fill="${shade(c,.7)}"/><rect x="282" y="174" width="30" height="60" rx="14" fill="${shade(c,.7)}"/>`; },
  camera(){ return `${SH(200,250,140)}<rect x="66" y="96" width="268" height="150" rx="18" fill="#22262a"/><rect x="110" y="72" width="80" height="34" rx="8" fill="#22262a"/>
    <circle cx="210" cy="172" r="62" fill="#3a3f45"/><circle cx="210" cy="172" r="46" fill="#111"/><circle cx="210" cy="172" r="28" fill="#2a4a7a"/><circle cx="198" cy="160" r="8" fill="#9cc2ff" opacity=".7"/>
    <rect x="276" y="112" width="40" height="18" rx="4" fill="#cfd6dc"/><circle cx="96" cy="118" r="8" fill="#e5484d"/>`; },
  gamepad(c){ return `${SH(200,250,140)}<path d="M120 100 L280 100 Q330 100 344 160 L356 214 Q360 240 334 240 Q314 240 296 212 L280 190 L120 190 L104 212 Q86 240 66 240 Q40 240 44 214 L56 160 Q70 100 120 100Z" fill="${c}"/>
    <rect x="96" y="132" width="16" height="48" rx="3" fill="#2a2d33"/><rect x="80" y="148" width="48" height="16" rx="3" fill="#2a2d33"/>
    <circle cx="290" cy="134" r="10" fill="#5fe3a1"/><circle cx="314" cy="156" r="10" fill="#e5484d"/><circle cx="266" cy="156" r="10" fill="#4f8bff"/><circle cx="290" cy="178" r="10" fill="#f5c518"/>
    <circle cx="164" cy="176" r="16" fill="#2a2d33"/><circle cx="236" cy="176" r="16" fill="#2a2d33"/>`; },
  gpu(){ return `${SH(200,248,170)}<rect x="30" y="92" width="340" height="124" rx="14" fill="#2a2d33"/><rect x="40" y="102" width="320" height="104" rx="10" fill="#16181d"/>
    ${[110,200,290].map(x=>`<circle cx="${x}" cy="154" r="44" fill="#22262a" stroke="#4a5058" stroke-width="3"/>${[0,60,120,180,240,300].map(r=>`<path d="M${x} 154 q12 -20 0 -38" fill="none" stroke="#7b848c" stroke-width="6" transform="rotate(${r} ${x} 154)"/>`).join("")}<circle cx="${x}" cy="154" r="10" fill="#7b5cff"/>`).join("")}
    <rect x="70" y="216" width="200" height="12" fill="#d4a017"/>`; },
  table(c){ return `${SH(200,250,160)}<rect x="90" y="120" width="220" height="16" rx="4" fill="${c}"/><rect x="104" y="136" width="10" height="100" fill="${shade(c,.75)}"/><rect x="286" y="136" width="10" height="100" fill="${shade(c,.75)}"/>
    ${[[40,0],[330,1]].map(([x,f])=>`<rect x="${x}" y="80" width="12" height="160" fill="${shade(c,.7)}" transform="translate(${f?16:0} 0)"/><rect x="${x-2}" y="160" width="46" height="10" rx="3" fill="${shade(c,.85)}" transform="translate(${f?-14:0} 0)"/><rect x="${x+(f?-14:30)}" y="170" width="8" height="70" fill="${shade(c,.7)}"/>`).join("")}
    <circle cx="200" cy="106" r="14" fill="#2f8f5b"/><rect x="192" y="108" width="16" height="12" fill="#b66a3c"/>`; },
  lamp(){ return `<circle cx="200" cy="96" r="120" fill="#ffe6a8" opacity=".35"/>${SH(200,254,70)}<path d="M150 60 L250 60 L272 120 L128 120Z" fill="#f5c518"/><rect x="196" y="120" width="8" height="120" fill="#2a2d33"/><ellipse cx="200" cy="244" rx="46" ry="10" fill="#2a2d33"/>`; },
  fridge(c){ return `${SH(200,264,80)}<rect x="132" y="20" width="136" height="240" rx="14" fill="${c}" stroke="#cfd6dc" stroke-width="3"/><line x1="132" y1="104" x2="268" y2="104" stroke="#aab4bc" stroke-width="3"/>
    <rect x="148" y="44" width="8" height="44" rx="4" fill="#8f989f"/><rect x="148" y="120" width="8" height="70" rx="4" fill="#8f989f"/><rect x="214" y="124" width="38" height="22" rx="4" fill="#2fb4c9" opacity=".7"/>`; },
  coffee(){ return `${SH(200,250,110)}<rect x="110" y="40" width="180" height="200" rx="16" fill="#2a2d33"/><rect x="126" y="56" width="148" height="50" rx="8" fill="#3e444c"/><circle cx="160" cy="81" r="10" fill="#c6f24e"/><circle cx="196" cy="81" r="10" fill="#cfd6dc"/><circle cx="232" cy="81" r="10" fill="#cfd6dc"/>
    <rect x="176" y="112" width="48" height="22" rx="4" fill="#1a1d21"/><path d="M196 134 L196 156 M204 134 L204 156" stroke="#6b3d1f" stroke-width="4"/><path d="M168 160 L232 160 L226 206 L174 206Z" fill="#fff"/><path d="M232 172 q18 4 0 22" fill="none" stroke="#fff" stroke-width="6"/><rect x="126" y="212" width="148" height="12" rx="4" fill="#4a5058"/>`; },
  vacuum(){ return `${SH(200,250,140)}<circle cx="200" cy="150" r="110" fill="#f4f6f8" stroke="#cfd6dc" stroke-width="4"/><circle cx="200" cy="150" r="80" fill="#e3e8ec"/><circle cx="200" cy="96" r="20" fill="#2a2d33"/><circle cx="200" cy="96" r="8" fill="#2fb4c9"/><path d="M140 200 Q200 230 260 200" fill="none" stroke="#aab4bc" stroke-width="5" stroke-linecap="round"/>`; },
  shirt(c){ return `${SH(200,262,100)}<path d="M150 40 Q200 66 250 40 L330 78 L304 136 L276 124 L276 254 L124 254 L124 124 L96 136 L70 78 Z" fill="${c}"/><path d="M168 46 Q200 76 232 46" fill="none" stroke="${shade(c,.75)}" stroke-width="6"/>`; },
  shoe(c){ return `${SH(200,236,160)}<path d="M54 210 L58 150 Q64 120 98 122 L150 128 Q200 160 260 164 Q330 168 346 196 L348 210Z" fill="${c}"/><rect x="48" y="206" width="304" height="20" rx="8" fill="#f4f6f8" stroke="#cfd6dc" stroke-width="2"/>
    ${[0,1,2,3].map(i=>`<path d="M${130+i*22} ${132+i*8} l18 -8" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`).join("")}<path d="M80 176 Q160 186 230 176" fill="none" stroke="${shade(c,.75)}" stroke-width="5"/>`; },
  bag(c){ return `${SH(200,256,110)}<path d="M150 110 Q150 54 200 54 Q250 54 250 110" fill="none" stroke="${shade(c,.7)}" stroke-width="12"/><path d="M96 110 L304 110 L326 248 L74 248Z" fill="${c}"/><rect x="186" y="132" width="28" height="18" rx="4" fill="#d4a017"/>`; },
  blocks(){ const cs=["#e5484d","#4f8bff","#f5c518","#2f8f5b","#7b5cff"]; return `${SH(200,256,140)}${[[90,176,"A"],[170,176,"B"],[250,176,"C"],[130,96,"D"],[210,96,"E"]].map(([x,y,l],i)=>`<rect x="${x}" y="${y}" width="72" height="72" rx="10" fill="${cs[i]}"/><text x="${x+36}" y="${y+50}" text-anchor="middle" font-family="Arial" font-size="40" font-weight="800" fill="#fff">${l}</text>`).join("")}`; },
  bricks(){ return `${SH(200,256,160)}${[0,1,2,3].map(r=>[0,1,2].map(k=>`<rect x="${56+k*98+(r%2?24:0)}" y="${190-r*44}" width="92" height="40" rx="3" fill="#ece6dc" stroke="#cfc4b3" stroke-width="3"/>`).join("")).join("")}<rect x="40" y="232" width="320" height="16" fill="#8a6a4a"/>`; },
  drill(c){ return `${SH(200,256,120)}<path d="M100 90 L270 90 Q300 90 300 120 L300 140 Q300 150 290 150 L180 150 L170 240 L120 240 L130 150 L100 150 Q86 150 86 136 L86 104 Q86 90 100 90Z" fill="${c}"/><rect x="300" y="108" width="40" height="24" rx="4" fill="#2a2d33"/><rect x="340" y="116" width="40" height="8" fill="#9aa1a7"/><rect x="112" y="216" width="70" height="30" rx="6" fill="#2a2d33"/>`; },
  dog(){ return `${SH(200,262,110)}<ellipse cx="200" cy="226" rx="96" ry="40" fill="#c99a62"/><circle cx="200" cy="140" r="76" fill="#d9ab73"/><path d="M128 100 Q100 150 126 196 Q148 180 146 120Z" fill="#a8743f"/><path d="M272 100 Q300 150 274 196 Q252 180 254 120Z" fill="#a8743f"/>
    <ellipse cx="200" cy="176" rx="40" ry="30" fill="#f1d3a8"/><ellipse cx="200" cy="160" rx="14" ry="10" fill="#2a2d33"/><circle cx="172" cy="128" r="9" fill="#2a2d33"/><circle cx="228" cy="128" r="9" fill="#2a2d33"/><path d="M200 172 L200 186 M188 192 Q200 200 212 192" stroke="#2a2d33" stroke-width="3" fill="none"/>`; },
  aquarium(){ return `${SH(200,258,150)}<rect x="60" y="66" width="280" height="180" rx="8" fill="#9fd4ef" stroke="#7fb3cf" stroke-width="4"/><rect x="60" y="66" width="280" height="22" fill="#cde9f6"/><rect x="60" y="226" width="280" height="20" fill="#d9c49a"/>
    ${[[110,150,"#f2a516"],[230,120,"#e5484d"],[270,180,"#5fe3a1"]].map(([x,y,c])=>`<ellipse cx="${x}" cy="${y}" rx="22" ry="12" fill="${c}"/><path d="M${x+20} ${y} l16 -10 l0 20z" fill="${c}"/><circle cx="${x-10}" cy="${y-3}" r="3" fill="#2a2d33"/>`).join("")}
    <path d="M90 226 Q80 190 96 160 M96 226 Q110 196 100 170 M300 226 Q310 196 296 176" stroke="#2f8f5b" stroke-width="6" fill="none"/>`; },
  dumbbell(c){ return `${SH(200,236,150)}<rect x="110" y="142" width="180" height="16" rx="6" fill="#9aa1a7"/>${[60,96,268,304].map((x,i)=>`<rect x="${x}" y="${i%3?104:92}" width="${i%3?32:36}" height="${i%3?92:116}" rx="8" fill="${c}"/>`).join("")}`; },
  tent(c){ return `<rect x="0" y="0" width="400" height="300" fill="#2b3a55"/><circle cx="320" cy="60" r="22" fill="#fff3c4"/>${[[40,30],[120,70],[230,40],[370,120]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join("")}
    <path d="M0 190 L90 100 L170 180 L250 90 L400 200 L400 300 L0 300Z" fill="#3e5a4c"/><rect x="0" y="236" width="400" height="64" fill="#2f4a3d"/><path d="M120 240 L200 120 L280 240Z" fill="${c}"/><path d="M200 120 L180 240 L220 240Z" fill="${shade(c,.6)}"/><circle cx="90" cy="236" r="10" fill="#f2a516"/>`; },
  tractor(c){ return `<rect x="0" y="232" width="400" height="68" fill="#a3cf7c"/>${SH(200,240,160)}<rect x="110" y="120" width="160" height="70" rx="6" fill="${c}"/><rect x="180" y="60" width="90" height="70" rx="6" fill="${shade(c,.85)}"/><rect x="192" y="72" width="66" height="44" fill="#d7ecf7"/>
    <rect x="96" y="132" width="20" height="40" rx="3" fill="#2a2d33"/><circle cx="250" cy="196" r="52" fill="#1f2326"/><circle cx="250" cy="196" r="22" fill="#f5c518"/><circle cx="128" cy="210" r="30" fill="#1f2326"/><circle cx="128" cy="210" r="12" fill="#f5c518"/>`; },
  beauty(){ return `${SH(200,256,140)}${[[110,"#e5484d"],[170,"#d6336c"],[230,"#7b5cff"]].map(([x,c])=>`<rect x="${x}" y="130" width="50" height="110" rx="12" fill="${c}"/><rect x="${x+12}" y="84" width="26" height="48" rx="4" fill="#2a2d33"/>`).join("")}<rect x="296" y="150" width="34" height="90" rx="6" fill="#d4a017"/><path d="M300 150 L300 112 Q313 96 326 112 L326 150Z" fill="#c92a5a"/>`; },
  box(){ return `${SH(200,258,140)}<path d="M80 110 L200 70 L320 110 L200 150Z" fill="#e3c08e"/><path d="M80 110 L200 150 L200 260 L80 220Z" fill="#c9a26b"/><path d="M320 110 L200 150 L200 260 L320 220Z" fill="#d8b47e"/><path d="M140 90 L260 130 L260 160" fill="none" stroke="#f4e3c3" stroke-width="12"/><path d="M234 196 q12 -16 24 0 q12 -16 24 0 q0 20 -24 34 q-24 -14 -24 -34z" fill="#e5484d"/>`; },
  ticket(){ return `${SH(200,236,150)}<g transform="rotate(-8 200 150)"><path d="M50 90 L350 90 L350 130 Q330 150 350 170 L350 210 L50 210 L50 170 Q70 150 50 130Z" fill="#7b5cff"/><line x1="270" y1="96" x2="270" y2="204" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/>
    <text x="160" y="146" text-anchor="middle" font-family="Arial" font-size="30" font-weight="800" fill="#fff">CONCERT</text><text x="160" y="178" text-anchor="middle" font-family="Arial" font-size="16" fill="#e3dbf5">Chișinău</text><path d="M310 132 l6 14 l15 1 l-12 9 l4 15 l-13 -8 l-13 8 l4 -15 l-12 -9 l15 -1z" fill="#c6f24e"/></g>`; },
  briefcase(c){ return `${SH(200,252,140)}<rect x="160" y="70" width="80" height="40" rx="10" fill="none" stroke="${shade(c,.7)}" stroke-width="12"/><rect x="70" y="100" width="260" height="150" rx="16" fill="${c}"/><rect x="70" y="160" width="260" height="10" fill="${shade(c,.75)}"/><rect x="184" y="152" width="32" height="26" rx="5" fill="#d4a017"/>`; },
  coin(){ return `${SH(200,256,120)}${[[150,210],[200,190],[250,210],[200,150]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="60" ry="20" fill="#d4a017"/><ellipse cx="${x}" cy="${y-6}" rx="60" ry="20" fill="#f2c94c"/>`).join("")}<circle cx="200" cy="80" r="46" fill="#f2c94c" stroke="#d4a017" stroke-width="6"/><text x="200" y="96" text-anchor="middle" font-family="Georgia" font-size="40" font-weight="700" fill="#a07400">★</text>`; }
});
DRAW.bird = () => `<rect x="190" y="40" width="8" height="220" fill="#8a6a4a" opacity=".0"/><path d="M60 230 L340 230" stroke="#8a6a4a" stroke-width="10" stroke-linecap="round"/>
  ${[[150,"#5fd16f","#3aa34d"],[250,"#5aa9f2","#2f7fd0"]].map(([x,c,d])=>`<ellipse cx="${x}" cy="178" rx="36" ry="48" fill="${c}"/><circle cx="${x}" cy="118" r="30" fill="${c}"/><path d="M${x-6} 210 L${x-16} 262 L${x+8} 262 Z" fill="${d}"/>
  <path d="M${x+20} 150 Q${x+52} 180 ${x+26} 214" fill="${d}"/><circle cx="${x+10}" cy="112" r="6" fill="#fff"/><circle cx="${x+11}" cy="112" r="3" fill="#1f2326"/><path d="M${x+26} 118 l14 6 l-14 6z" fill="#f5a524"/>
  <path d="M${x-14} 228 l-4 8 M${x+8} 228 l4 8" stroke="#f5a524" stroke-width="4"/>`).join("")}`;
const _illCache = {};
function illCached(key, name, ...args){ return _illCache[key] ||= illustrate(name, ...args); }
