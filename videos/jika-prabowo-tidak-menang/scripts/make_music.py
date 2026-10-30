"""Synthesize a calm, neutral documentary music bed (soft piano arpeggios + warm pad).
Usage: python3 scripts/make_music.py [seconds]. Writes public/audio/music.wav (44.1 kHz stereo)."""
import sys, os, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 60.0
BPM = 84
beat = 60 / BPM
n = int(DUR * SR)
L = np.zeros(n); R = np.zeros(n)

def midi(m): return 440 * 2 ** ((m - 69) / 12)

def piano(f, dur, vel):
    t = np.arange(int(dur * SR)) / SR
    env = np.exp(-t * 2.8) * (1 - np.exp(-t * 200))
    tone = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * k * 0.6) for k, a in [(1, 1), (2, .35), (3, .12), (4, .05)])
    return vel * env * tone

def pad(freqs, dur):
    t = np.arange(int(dur * SR)) / SR
    env = np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 1.5)
    s = sum(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * 0.2 * t) * 0.3) + 0.3 * np.sin(2 * np.pi * f * 2.003 * t) for f in freqs)
    return env * s / len(freqs)

# I – vi – IV – V in F major, two bars each; open, unresolved but calm
prog = [(53, [65, 69, 72, 77]), (50, [62, 65, 69, 74]), (46, [62, 65, 70, 74]), (48, [64, 67, 72, 76])]
bar = beat * 4
t0, i = 0.0, 0
pattern = [0, 2, 1, 3, 2, 1, 3, 2]
while t0 < DUR:
    root, notes = prog[(i // 2) % 4]
    seg = pad([midi(root), midi(root + 7), midi(notes[1])], bar + 1.5)
    s = int(t0 * SR); e = min(n, s + len(seg))
    L[s:e] += 0.10 * seg[:e - s]; R[s:e] += 0.10 * seg[:e - s]
    for k, p in enumerate(pattern):
        ts = t0 + k * beat / 2
        if ts >= DUR: break
        note = piano(midi(notes[p]), 2.5, 0.16 if k % 4 == 0 else 0.11)
        s = int(ts * SR); e = min(n, s + len(note)); pan = 0.35 + 0.3 * (p / 3)
        L[s:e] += (1 - pan) * note[:e - s]; R[s:e] += pan * note[:e - s]
    t0 += bar; i += 1

# simple room reverb (feedback delays) for softness
for d, g in [(0.031, .25), (0.047, .2), (0.071, .16), (0.113, .12)]:
    k = int(d * SR)
    L[k:] += g * R[:-k]; R[k:] += g * L[:-k]
fade = np.ones(n); fi, fo = int(1.0 * SR), int(3.0 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
st = np.stack([L * fade, R * fade], 1)
st = st / np.abs(st).max() * 0.8
os.makedirs(os.path.join(ROOT, "public/audio"), exist_ok=True)
with wave.open(os.path.join(ROOT, "public/audio/music.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("music", DUR, "s")
