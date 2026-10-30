"""Write deliverables/subtitle.srt from src/timeline.json (same ≤2-line split rule as the video)."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX = 46
lines = json.load(open(os.path.join(ROOT, "src/timeline.json"), encoding="utf-8"))["lines"]

def split_once(text):
    w = text.split(" "); best, score = (text, ""), 1e9
    for i in range(1, len(w)):
        a, b = " ".join(w[:i]), " ".join(w[i:])
        natural = bool(re.search(r"[,;:]$", w[i - 1])) or w[i] in ("dan", "atau", "tetapi", "tapi")
        s = abs(len(a) - len(b)) + (0 if natural else 18) + (1000 if max(len(a), len(b)) > MAX else 0)
        if s < score: best, score = (a, b), s
    return [c for c in best if c]

def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

cues = []
for l in lines:
    chunks = [l["text"]] if len(l["text"]) <= MAX else split_once(l["text"])
    total = sum(len(c) for c in chunks); t = l["start"]
    for c in chunks:
        d = (l["end"] - l["start"]) * len(c) / total
        cues.append((t, t + d, c)); t += d
with open(os.path.join(ROOT, "deliverables/subtitle.srt"), "w", encoding="utf-8") as f:
    for i, (a, b, c) in enumerate(cues, 1):
        f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{c}\n\n")
print(len(cues), "cues")
