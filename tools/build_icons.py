"""Собирает assets/js/icons.js — только используемые иконки Lucide (ISC license).
Запуск: npm i lucide-static && python3 tools/build_icons.py [путь к node_modules/lucide-static/icons]"""
import re, json, os, sys, glob
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
icdir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, "node_modules/lucide-static/icons")
src = open(os.path.join(root, "index.html")).read()
for f in glob.glob(os.path.join(root, "assets/js/*.js")):
    if not f.endswith("icons.js"): src += open(f).read()
names = set(re.findall(r'data-lucide="([a-z0-9-]+)"', src)) | set(re.findall(r'\bic:"([a-z0-9-]+)"', src))
m = re.search(r"const SIC=\{(.*?)\};", src, re.S)
if m: names |= set(re.findall(r'"([a-z0-9-]+)"', m.group(1)))
icons = {}
for n in sorted(names):
    p = os.path.join(icdir, n + ".svg")
    if not os.path.exists(p): print("нет иконки:", n); continue
    icons[n] = re.sub(r"\s+", " ", re.search(r"<svg[^>]*>(.*)</svg>", open(p).read(), re.S).group(1)).strip()
js = ("/* Gata.md — иконки Lucide (https://lucide.dev, ISC). Файл генерируется tools/build_icons.py */\n"
      "const ICONS=" + json.dumps(icons, ensure_ascii=False) + ";\n"
      "const icons=()=>document.querySelectorAll('i[data-lucide]').forEach(el=>{const n=el.dataset.lucide;if(!ICONS[n])return;"
      "const st=el.getAttribute('style')||'';el.outerHTML=`<svg class=\"lucide\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" "
      "stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"${st}\">${ICONS[n]}</svg>`;});\n")
open(os.path.join(root, "assets/js/icons.js"), "w").write(js)
print(len(icons), "иконок записано")
