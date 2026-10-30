"""Generate narration WAV + timing JSON from narration/script.json using Piper (id_ID-news_tts-medium).
Usage: python3 scripts/make_voice.py <path-to-id_ID-news_tts-medium.onnx> [length_scale]
Writes public/audio/voice.wav and src/timeline.json (seconds)."""
import json, subprocess, sys, wave, os, tempfile
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model = sys.argv[1]
length_scale = sys.argv[2] if len(sys.argv) > 2 else "0.9"
LEAD_IN = 0.5
lines = json.load(open(os.path.join(ROOT, "narration/script.json"), encoding="utf-8"))["lines"]

sr = None
chunks, timeline, t = [], [], LEAD_IN
with tempfile.TemporaryDirectory() as tmp:
    for i, line in enumerate(lines):
        out = os.path.join(tmp, f"{i}.wav")
        subprocess.run([sys.executable, "-m", "piper", "-m", model, "-f", out,
                        "--length-scale", length_scale, "--sentence-silence", "0"],
                       input=line["say"].encode("utf-8"), check=True, capture_output=True)
        with wave.open(out) as w:
            sr = w.getframerate()
            a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
        # trim leading/trailing near-silence so timings hug the speech
        idx = np.where(np.abs(a) > 120)[0]
        a = a[max(idx[0] - int(0.02 * sr), 0): idx[-1] + int(0.14 * sr)]
        dur = len(a) / sr
        timeline.append({"scene": line["scene"], "text": line["text"], "start": round(t, 3), "end": round(t + dur, 3)})
        chunks.append(a)
        chunks.append(np.zeros(int(line["pause"] * sr), dtype=np.float32))
        t += dur + line["pause"]

audio = np.concatenate([np.zeros(int(LEAD_IN * sr), dtype=np.float32)] + chunks)
audio = audio / (np.abs(audio).max() + 1e-6) * 0.89 * 32767
os.makedirs(os.path.join(ROOT, "public/audio"), exist_ok=True)
with wave.open(os.path.join(ROOT, "public/audio/voice.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(audio.astype(np.int16).tobytes())
json.dump({"voiceEnd": round(t, 3), "lines": timeline},
          open(os.path.join(ROOT, "src/timeline.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"voice ends at {t:.2f}s")
for l in timeline: print(f'{l["start"]:6.2f}-{l["end"]:6.2f} [{l["scene"]}] {l["text"]}')
