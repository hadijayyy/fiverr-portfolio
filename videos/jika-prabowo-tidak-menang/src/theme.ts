import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import timelineData from "./timeline.json";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_S = 59.5;
export const DURATION = Math.round(DURATION_S * FPS);

export const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

// Neutral palette. Pair colours avoid any party's signature colour on purpose.
export const C = {
  paper: "#F4F1EA",
  paper2: "#E9E3D6",
  floor: "#E6DFD0",
  ink: "#1F2328",
  inkSoft: "#4A4F57",
  muted: "#8A8F98",
  white: "#FFFFFF",
  clay: "#F7F4EE",
  fact: "#3B4048",
  hypo: "#C65D3B",
  p01: "#2A9D8F",
  p02: "#D89A2B",
  p03: "#6C63A6",
  neutralBlock: "#CFC7B6",
};

export const PAIRS = {
  "01": { name: "Anies–Muhaimin", color: C.p01 },
  "02": { name: "Prabowo–Gibran", color: C.p02 },
  "03": { name: "Ganjar–Mahfud", color: C.p03 },
} as const;

export type Line = { scene: string; text: string; start: number; end: number };
export const LINES: Line[] = timelineData.lines;

const order = ["hook", "branch", "budget", "coalition", "pace", "limits", "outro"] as const;
export type SceneId = (typeof order)[number];

// Scene boundaries: each scene starts shortly before its first spoken line.
export const SCENES: Record<SceneId, { from: number; to: number }> = (() => {
  const starts = order.map((id, i) =>
    i === 0 ? 0 : Math.min(...LINES.filter((l) => l.scene === id).map((l) => l.start)) - 0.2,
  );
  const out = {} as Record<SceneId, { from: number; to: number }>;
  order.forEach((id, i) => {
    out[id] = { from: starts[i], to: i < order.length - 1 ? starts[i + 1] : DURATION_S };
  });
  return out;
})();

/** Start time (s, absolute) of the first line containing `needle`. */
export const at = (needle: string) => {
  const l = LINES.find((x) => x.text.includes(needle));
  if (!l) throw new Error(`No line contains "${needle}"`);
  return l.start;
};
