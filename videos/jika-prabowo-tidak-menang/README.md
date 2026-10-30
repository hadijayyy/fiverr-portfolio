# Jika Prabowo Tidak Menang? — Remotion + Three.js

A 59.5-second Indonesian explainer for Instagram Reels (1080×1920, 30 fps) with 3D animation. The finished files are in [`deliverables/`](deliverables/): MP4, cover, SRT, caption, script, storyboard and sources.

## Structure

```
narration/script.json   narration text (on-screen) + spelled-out TTS text + pauses
scripts/make_voice.py    Piper TTS → public/audio/voice.wav + src/timeline.json (exact per-line timing)
scripts/make_music.py    procedural, neutral documentary music bed → public/audio/music.wav
scripts/make_srt.py      deliverables/subtitle.srt from the timeline
scripts/contact_sheet.sh renders stills at given seconds into a review sheet
src/theme.ts             palette, fonts, scene boundaries derived from the timeline
src/overlays.tsx         background, FAKTA/HIPOTETIS badge, subtitles (≤2 lines, Reels-safe), footnotes
src/three/common.tsx     Stage (ThreeCanvas + lights + projected DOM labels), clay materials, growing paths
src/three/*.tsx          ballot box, Indonesia map (Natural Earth via world-atlas)
src/scenes/*.tsx         Hook · Branch · Budget · Coalition · Pace · Limits · Outro
src/Cover.tsx            Reels cover still
```

Scene timing comes from the measured voice track. If you edit `narration/script.json` and regenerate the voice, the subtitles and scene cuts follow automatically.

## Rebuild

```bash
npm i
# voice (needs the Piper voice id_ID-news_tts-medium from the sherpa-onnx tts-models release)
pip install piper-tts numpy
python3 scripts/make_voice.py path/to/id_ID-news_tts-medium.onnx 0.66
python3 scripts/make_music.py 59.5
python3 scripts/make_srt.py

npx remotion studio                               # preview
npx remotion render Explainer out/video.mp4 --crf=18
npx remotion still Cover out/cover.png
```

`remotion.config.ts` points Remotion at the pre-installed headless Chromium and SwiftShader (`swangle`) WebGL. Set the `REMOTION_BROWSER` environment variable, or remove those lines, to use Remotion's own browser.

## Rules for editing the content

- Every frame shows a mode badge: **FAKTA**, **SKENARIO HIPOTETIS** or **KONTEKS SISTEM**.
- Hypothetical paths are dashed. Official data paths are solid.
- Do not invent numbers. The only figures in the video are official KPU results and DPR seat counts.
- Programme blocks in the budget scene are deliberately the same size, because they show priority, not money.
- People appear only as faceless, generic figures. Pairs are shown by ballot number and written name.
