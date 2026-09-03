#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageOps

IMAGE_DIR = Path(__file__).resolve().parents[1] / "public" / "assets" / "img" / "qwizzy"

for source in sorted(IMAGE_DIR.glob("*.jpg")):
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        full = source.with_suffix(".webp")
        image.save(full, "WEBP", quality=82, method=6)
        half_image = image.resize((660, round(image.height * 660 / image.width)), Image.Resampling.LANCZOS)
        half = source.with_name(f"{source.stem}-660.webp")
        half_image.save(half, "WEBP", quality=82, method=6)
        print(f"Optimized {source.name} -> {full.name}, {half.name}")
