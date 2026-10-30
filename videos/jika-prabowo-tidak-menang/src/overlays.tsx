import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FPS, LINES, Line } from "./theme";

// Instagram Reels UI covers roughly the top ~170px, the bottom ~380px and a ~120px
// strip on the right (like/comment/share). Everything readable stays inside SAFE.
export const SAFE = { top: 190, bottom: 1540, left: 70, right: 950 };

export const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 70% at 50% 35%, ${C.paper} 0%, ${C.paper2} 100%)`,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(31,35,40,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(31,35,40,0.035) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(80% 60% at 50% 40%, black, transparent)",
      }}
    />
  </AbsoluteFill>
);

const fadeIn = (frame: number, start: number, dur = 8) =>
  interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** "FAKTA" vs "SKENARIO HIPOTETIS" badge — always visible so the hypothetical label is never ambiguous. */
export const ModeBadge: React.FC<{ mode: "fakta" | "hipotetis" | "konteks"; from: number }> = ({ mode, from }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, from);
  const isFact = mode !== "hipotetis";
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top,
        left: SAFE.left,
        opacity: o,
        transform: `translateY(${(1 - o) * -12}px)`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 22px",
        borderRadius: 999,
        background: isFact ? C.fact : C.hypo,
        color: C.white,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 28,
        letterSpacing: 2,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          background: C.white,
          opacity: isFact ? 1 : 0.9,
          border: isFact ? "none" : "3px dashed rgba(255,255,255,0.0)",
        }}
      />
      {mode === "fakta" ? "FAKTA · DATA RESMI" : mode === "konteks" ? "KONTEKS SISTEM" : "SKENARIO HIPOTETIS"}
    </div>
  );
};

export const SectionChip: React.FC<{ text: string; from: number }> = ({ text, from }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, from + 4);
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top,
        right: 1080 - SAFE.right,
        opacity: o,
        padding: "12px 22px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.85)",
        color: C.ink,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 28,
        letterSpacing: 1.5,
        boxShadow: "0 4px 14px rgba(31,35,40,0.08)",
      }}
    >
      {text}
    </div>
  );
};

export const Footnote: React.FC<{ children: React.ReactNode; from: number; to: number }> = ({ children, from, to }) => {
  const frame = useCurrentFrame();
  const o = Math.min(fadeIn(frame, from), 1 - fadeIn(frame, to - 8));
  return (
    <div
      style={{
        position: "absolute",
        top: 1452,
        left: SAFE.left + 20,
        width: SAFE.right - SAFE.left - 40,
        textAlign: "center",
        opacity: o,
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 27,
        lineHeight: 1.3,
        color: C.inkSoft,
      }}
    >
      {children}
    </div>
  );
};

// ---- Subtitles ---------------------------------------------------------------

const MAX_CHARS = 46; // ≈ two lines at 54px inside the safe width

type Cue = { text: string; start: number; end: number };

// Keep paired names like "Ganjar–Mahfud" on one line (word joiners around the dash).
const glue = (s: string) => s.replace(/–/g, "\u2060–\u2060");

/** Best place to split a line in two: after punctuation or before a conjunction, as balanced as possible. */
const splitOnce = (text: string): [string, string] => {
  const words = text.split(" ");
  let best: [string, string] | null = null;
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const natural = /[,;:]$/.test(words[i - 1]) || /^(dan|atau|tetapi|tapi)$/.test(words[i]);
    const score = Math.abs(a.length - b.length) + (natural ? 0 : 18) + (a.length > MAX_CHARS || b.length > MAX_CHARS ? 1000 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = [a, b];
    }
  }
  return best ?? [text, ""];
};

/** Split long narration lines into ≤2-line cues; time is shared in proportion to characters. */
export const buildCues = (lines: Line[]): Cue[] =>
  lines.flatMap((l) => {
    const chunks = l.text.length <= MAX_CHARS ? [l.text] : splitOnce(l.text).filter(Boolean);
    const total = chunks.reduce((s, c) => s + c.length, 0);
    let t = l.start;
    return chunks.map((c) => {
      const d = ((l.end - l.start) * c.length) / total;
      const cue = { text: glue(c), start: t, end: t + d };
      t += d;
      return cue;
    });
  });

const CUES = buildCues(LINES);
// The final question is shown as a large card instead (see scenes/Outro.tsx).
const QUESTION_START = LINES[LINES.length - 1].start;

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // Keep a cue on screen through short pauses so the box doesn't flicker.
  const idx = CUES.findIndex((c, i) => t >= c.start - 0.05 && t < (CUES[i + 1]?.start ?? c.end + 1.5) - 0.05);
  if (idx < 0) return null;
  const cue = CUES[idx];
  if (cue.start >= QUESTION_START - 0.01) return null;
  const local = (t - cue.start) * FPS;
  const enter = interpolate(local, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top: 1215,
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: SAFE.right - SAFE.left,
          padding: "18px 30px 20px",
          borderRadius: 26,
          background: "rgba(31,35,40,0.93)",
          color: C.white,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 52,
          lineHeight: 1.22,
          textWrap: "balance",
          textAlign: "center",
          letterSpacing: -0.3,
          transform: `translateY(${(1 - enter) * 10}px)`,
          opacity: 0.75 + 0.25 * enter,
          boxShadow: "0 10px 30px rgba(31,35,40,0.25)",
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

export const subtitleCues = CUES;
