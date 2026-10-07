"""Recorre la build de AutoShine (dist/) en celular y compu, sin servidor: Playwright
sirve los archivos desde el disco. Saca capturas y falla si algo no anda.

Uso:  npm run build && ../Test1_Inmo/.venv/bin/python scripts/verificar.py /carpeta/capturas"""
import mimetypes, sys
from pathlib import Path
from urllib.parse import urlparse, unquote, parse_qs
from playwright.sync_api import sync_playwright

DIST = Path(__file__).resolve().parent.parent / "dist"
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
BASE = "http://autoshine.test/"
problemas = []


def servir(route):
    ruta = unquote(urlparse(route.request.url).path).lstrip("/") or "index.html"
    f = DIST / ruta
    if f.is_file():
        route.fulfill(status=200, body=f.read_bytes(), content_type=mimetypes.guess_type(str(f))[0] or "application/octet-stream")
    else:
        route.fulfill(status=404, body=b"no existe")


def recorrer(p, nombre, opciones):
    nav = p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    ctx = nav.new_context(**opciones)
    pg = ctx.new_page()
    pg.route(f"{BASE}**", servir)
    errores, caidos = [], []
    pg.on("console", lambda m: m.type == "error" and errores.append(m.text))
    pg.on("pageerror", lambda e: errores.append(str(e)))
    pg.on("response", lambda r: r.status >= 400 and caidos.append(f"{r.status} {r.url}"))
    pg.goto(BASE, wait_until="networkidle")
    pg.wait_for_timeout(800)
    cap = lambda n: pg.screenshot(path=str(OUT / f"{nombre}-{n}.png"))
    cap("1-portada")

    # Expandir la portada como lo haría el teclado (End = expandir todo)
    pg.mouse.move(5, 400)
    pg.keyboard.press("End")
    pg.wait_for_timeout(900)
    cap("2-portada-abierta")
    pg.evaluate("window.scrollBy(0, innerHeight * 1.05)")
    pg.wait_for_timeout(900)
    cap("2b-pilares")

    pg.evaluate("document.getElementById('servicios').scrollIntoView()")
    pg.wait_for_timeout(2500)
    cap("3-servicios")
    webgl = pg.evaluate("!!document.querySelector('#servicios canvas.opacity-100')")
    pg.locator("#servicios nav button").nth(3).click()
    pg.wait_for_timeout(1000)
    cap("4-servicios-transicion")
    pg.wait_for_timeout(2300)
    cap("5-servicios-opticas")
    titulo = pg.locator("#servicios h2").get_attribute("aria-label")
    if titulo != "Restauración de ópticas":
        problemas.append(f"{nombre}: al tocar el 4.º servicio quedó '{titulo}'")

    top = pg.evaluate("document.getElementById('trabajos').offsetTop")
    alto = pg.evaluate("document.getElementById('trabajos').offsetHeight - innerHeight")
    for i, f in enumerate([0.0, 0.35, 0.9]):
        pg.evaluate(f"window.scrollTo(0, {top + alto * f})")
        pg.wait_for_timeout(1300)
        cap(f"6-trabajos-{i}")

    pg.get_by_text("Productos profesionales,").scroll_into_view_if_needed()
    pg.wait_for_timeout(700)
    cap("6b-taller")
    for sel, n in [("#preguntas", "7-preguntas"), ("#turno", "8-turno")]:
        pg.evaluate(f"document.querySelector('{sel}').scrollIntoView()")
        pg.wait_for_timeout(700)
        cap(n)
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    pg.wait_for_timeout(500)
    cap("9-taller-y-pie")

    # Textos que se salen de la pantalla aunque la sección los recorte (fuera de la galería 3D y del título de la portada)
    salidos = pg.evaluate("""[...document.querySelectorAll('main h2, main h3, main p, main li, main a, footer *')]
      .filter(e => !e.closest('#trabajos') && e.getClientRects().length && getComputedStyle(e).opacity !== '0')
      .filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1 })
      .map(e => e.tagName + ': ' + e.textContent.trim().slice(0, 40))""")
    problemas.extend(f"{nombre}: se sale de la pantalla -> {x}" for x in salidos)
    ancho = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
    if ancho[0] > ancho[1]:
        problemas.append(f"{nombre}: scroll horizontal ({ancho[0]} > {ancho[1]})")

    # Formulario: se intercepta window.open para leer el link armado
    pg.evaluate("window.open = (u) => { window.__abierto = u }")
    pg.select_option("select[name=servicio]", "Tratamiento cerámico")
    pg.fill("input[name=modelo]", "Toyota Hilux")
    pg.fill("input[name=nombre]", "Prueba")
    pg.locator("#turno button[type=submit]").click()
    link = pg.evaluate("window.__abierto") or ""
    texto = parse_qs(urlparse(link).query).get("text", [""])[0]
    if not link.startswith("https://wa.me/5492665111306?text=") or "Tratamiento cerámico" not in texto or "Toyota Hilux" not in texto:
        problemas.append(f"{nombre}: el formulario armó {link[:120]}")
    flotante = pg.get_attribute("a[aria-label='Escribir a AutoShine por WhatsApp']", "href") or ""
    if not flotante.startswith("https://wa.me/5492665111306"):
        problemas.append(f"{nombre}: botón flotante con href {flotante}")

    for e in errores:
        problemas.append(f"{nombre}: consola: {e[:200]}")
    for c in caidos:
        problemas.append(f"{nombre}: {c}")
    print(f"{nombre}: webgl={webgl} ancho={ancho} mensaje={texto.splitlines()[:3]}")
    nav.close()


with sync_playwright() as p:
    recorrer(p, "movil", dict(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True))
    recorrer(p, "pc", dict(viewport={"width": 1440, "height": 900}))

pesadas = [f"{f.name} {f.stat().st_size // 1024} KB" for f in (DIST / "fotos").glob("*") if f.stat().st_size > 400_000]
problemas += [f"foto pesada: {x}" for x in pesadas]
print("PROBLEMAS:" if problemas else "TODO OK", *problemas, sep="\n  ")
sys.exit(1 if problemas else 0)
