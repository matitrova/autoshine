"""Genera las fotos de la web en public/fotos/ a partir de fotos-originales/.

Las originales vienen del celular de Facundo (4096 px, con GPS en el EXIF).
Acá se achican, se pasan a WebP y se guardan SIN EXIF: Pillow no escribe
metadatos salvo que se le pidan, así que la ubicación no llega a la web.

Uso:  ../Test1_Inmo/.venv/bin/python scripts/fotos.py
Para sumar o cambiar fotos, editar FOTOS (el código es el final del nombre
del archivo original, por ejemplo 2734 = 1791399642734.jpg).
"""
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "fotos-originales"
DESTINO = RAIZ / "public" / "fotos"

# nombre de salida: (código de la original, tipo)
#   portada  -> 1920 px de ancho, tal cual
#   servicio -> dos recortes: -h 1920x1080 (compu) y -v 1080x1920 (celular)
#   galeria  -> 600 px de ancho, vertical
#   ancho    -> 1600 px de ancho, tal cual
FOTOS = {
    "portada": ("2734", "portada"),
    "og": ("2734", "og"),
    "taller": ("3105", "ancho"),
    "mesa": ("2307", "ancho"),
    "lavado": ("2426", "servicio"),
    "pulido": ("2688", "servicio"),
    "ceramico": ("3072", "servicio"),
    "opticas": ("2533", "servicio"),
    "camionetas": ("3007", "servicio"),
    "motos": ("2780", "servicio"),
    **{f"trabajo-{i:02d}": (c, "galeria") for i, c in enumerate([
        "2634", "2659", "2712", "2756", "2857", "2888", "2969", "3042",
        "3136", "3159", "3221", "3252", "3278", "3308", "3337", "3371",
        "2368", "2400", "2475", "2843",
    ], 1)},
}


def original(codigo: str) -> Image.Image:
    (ruta,) = ORIGEN.glob(f"*{codigo}.jpg")
    # exif_transpose aplica la rotación del celular antes de descartar el EXIF
    return ImageOps.exif_transpose(Image.open(ruta)).convert("RGB")


def guardar(im: Image.Image, nombre: str) -> None:
    im.save(DESTINO / f"{nombre}.webp", "WEBP", quality=78, method=6)


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    for nombre, (codigo, tipo) in FOTOS.items():
        im = original(codigo)
        if tipo == "servicio":
            guardar(ImageOps.fit(im, (1920, 1080), centering=(0.5, 0.55)), f"{nombre}-h")
            guardar(ImageOps.fit(im, (1080, 1920), centering=(0.5, 0.5)), f"{nombre}-v")
        elif tipo == "og":
            # Vista previa al compartir el link: WhatsApp y Facebook leen mejor JPG
            ImageOps.fit(im, (1200, 630)).save(RAIZ / "public" / "og.jpg", "JPEG", quality=82)
        else:
            ancho = {"portada": 1920, "ancho": 1600, "galeria": 600}[tipo]
            im.thumbnail((ancho, ancho * 4))
            guardar(im, nombre)
        print("ok", nombre)


if __name__ == "__main__":
    main()
