import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Footnote, ModeBadge, SectionChip } from "../overlays";
import { Clay, GrowPath, Label, PathTip, RoundedBox, Stage, lerp, pop, prog } from "../three/common";
import { IndonesiaMap } from "../three/IndonesiaMap";
import { at, C, FPS, PAIRS, SCENES } from "../theme";

// Official KPU result (Keputusan KPU No. 360/2024): share of valid votes.
const RESULTS = [
  { id: "01" as const, pct: 24.95, label: "24,9%" },
  { id: "02" as const, pct: 58.59, label: "58,6%" },
  { id: "03" as const, pct: 16.47, label: "16,5%" },
];
const H = 0.042; // scene units per percentage point

export const Branch: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + SCENES.branch.from;
  const s = SCENES.branch.from;
  const tHypo = at("Dalam skenario lain");
  const tRunoff = at("mungkin lewat putaran kedua");
  const hypo = prog(t, tHypo - 0.2, tHypo + 0.4);
  const local = frame / FPS;
  const mapIn = prog(local, 0, 0.6);
  const bars = prog(t, at("dengan 58,6") - 0.6, at("dengan 58,6") + 0.6);
  const line = prog(t, s + 0.9, s + 1.5);
  const ghost = lerp(1, 0.22, hypo);
  const leftPath = prog(t, tHypo + 0.5, tHypo + 1.8);
  const rightPath = prog(t, tHypo + 1.6, tHypo + 2.9);
  const runoff = pop(t, tRunoff - 0.1);
  const cam: [number, number, number] = [lerp(0, 0.3, hypo), lerp(5.6, 6.4, hypo), lerp(8.6, 8.2, hypo)];

  return (
    <AbsoluteFill>
      <Stage cam={cam} look={[0, 1.15, -0.6]} fov={33}>
        <IndonesiaMap rise={mapIn} position={[0, 0, 0.9]} />
        {/* official result columns */}
        {RESULTS.map((r, i) => {
          const x = (i - 1) * 1.35;
          const h = Math.max(0.001, r.pct * H * bars);
          return (
            <group key={r.id} position={[x, 0, -1.0]}>
              <RoundedBox size={[0.8, 0.12, 0.8]} radius={0.05} position={[0, 0.06, 0]} color={C.paper2} opacity={ghost} />
              <RoundedBox
                size={[0.62, h, 0.62]}
                radius={0.05}
                position={[0, 0.12 + h / 2, 0]}
                color={PAIRS[r.id].color}
                opacity={ghost}
              />
              <Label position={[0, 0.25 + r.pct * H + 0.25, 0]} opacity={bars * ghost} accent={PAIRS[r.id].color} size={26}>
                {r.id} · {r.label}
              </Label>
            </group>
          );
        })}
        {/* 50% line */}
        <mesh position={[0, 0.12 + 50 * H, -1.0]} scale={[line, 1, 1]}>
          <boxGeometry args={[4.2, 0.02, 0.9]} />
          <Clay color={C.ink} opacity={0.35 * ghost} />
        </mesh>
        <Label position={[-2.65, 0.12 + 50 * H, -1.0]} opacity={line * ghost} tone="dark" size={22}>
          50%
        </Label>
        {/* hypothetical routes */}
        <GrowPath points={[[0, 0.35, 0.7], [-0.9, 0.9, 0.4], [-1.9, 1.1, -0.3]]} progress={leftPath} color={C.p01} dashed radius={0.05} />
        <PathTip points={[[0, 0.35, 0.7], [-0.9, 0.9, 0.4], [-1.9, 1.1, -0.3]]} progress={leftPath} color={C.p01} />
        <GrowPath points={[[0, 0.35, 0.7], [0.9, 0.9, 0.4], [1.9, 1.1, -0.3]]} progress={rightPath} color={C.p03} dashed radius={0.05} />
        <PathTip points={[[0, 0.35, 0.7], [0.9, 0.9, 0.4], [1.9, 1.1, -0.3]]} progress={rightPath} color={C.p03} />
        <Label position={[-2.0, 1.75, -0.3]} opacity={pop(t, tHypo + 1.6)} accent={C.p01} dashed size={28}>
          01 · {PAIRS["01"].name}?
        </Label>
        <Label position={[2.0, 1.75, -0.3]} opacity={pop(t, tHypo + 2.7)} accent={C.p03} dashed size={28}>
          03 · {PAIRS["03"].name}?
        </Label>
        <Label position={[0, 2.6, -0.6]} opacity={runoff} tone="accent" accent={C.hypo} size={30}>
          Putaran kedua?
        </Label>
      </Stage>

      {hypo > 0.5 ? (
        <ModeBadge mode="hipotetis" from={Math.round((tHypo - s) * FPS)} />
      ) : (
        <ModeBadge mode="fakta" from={0} />
      )}
      <SectionChip text="TITIK PERCABANGAN" from={0} />
      <Footnote from={0} to={Math.round((tHypo - s) * FPS)}>
        Hasil resmi Pilpres 2024 — Keputusan KPU No. 360/2024 (20 Maret 2024). Menang satu putaran: &gt;50% suara
        dan ≥20% suara di lebih dari separuh provinsi (UUD 1945 Pasal 6A).
      </Footnote>
      <Footnote from={Math.round((tHypo - s) * FPS)} to={Math.round((SCENES.branch.to - s) * FPS) + 8}>
        Ilustrasi skenario. Tidak ada angka simulasi — hasil alternatif tidak diketahui.
      </Footnote>
    </AbsoluteFill>
  );
};
