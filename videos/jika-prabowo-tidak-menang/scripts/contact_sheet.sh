#!/usr/bin/env bash
# Render stills at the given seconds and tile them into out/sheet-<name>.png for review.
set -e
name=$1; shift
mkdir -p out/qa
files=()
for s in "$@"; do
  f=$(python3 -c "print(round($s*30))")
  npx remotion still Explainer out/qa/f$f.png --frame=$f --log=error >/dev/null
  files+=(out/qa/f$f.png)
done
python3 - "$name" "${files[@]}" <<'PY'
import sys
from PIL import Image, ImageDraw
name, files = sys.argv[1], sys.argv[2:]
w, h = 360, 640
cols = min(4, len(files)); rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h), "white")
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((w, h))
    ImageDraw.Draw(im).text((8, 8), f.split("/")[-1], fill="red")
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
sheet.save(f"out/sheet-{name}.png")
PY
