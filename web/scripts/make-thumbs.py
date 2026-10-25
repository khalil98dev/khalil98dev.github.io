"""Generate lightweight WebP thumbnails for certificate PNGs (used by galleries/cards).

Usage:  python scripts/make-thumbs.py      (requires Pillow)
Reads  ../certificates/images/*.png  ->  writes  ../certificates/thumbs/*.webp
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
src = root / "certificates" / "images"
dst = root / "certificates" / "thumbs"
dst.mkdir(parents=True, exist_ok=True)

for png in sorted(src.glob("*.png")):
    out = dst / f"{png.stem}.webp"
    if out.exists() and out.stat().st_mtime >= png.stat().st_mtime:
        continue
    with Image.open(png) as im:
        im = im.convert("RGB")
        im.thumbnail((900, 900), Image.LANCZOS)
        im.save(out, "WEBP", quality=82, method=6)
    print("thumb:", out.name)
