import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Footnote, ModeBadge, SAFE } from "../overlays";
import { Clay, GrowPath, Label, PathTip, Stage, lerp, pop, prog } from "../three/common";
import { at, C, FONT, FPS, SCENES } from "../theme";

const FACT_PATH: [number, number, number][] = [
  [-1.7, 0.4, 1.7],
  [-1.2, 0.6, 0.5],
  [-0.2, 0.9, -0.6],
  [0, 1.0, -1.2],
];
const HYPO_PATH: [number, number, number][] = [
  [1.7, 0.4, 1.7],
  [1.2, 0.6, 0.5],
  [0.2, 0.9, -0.6],
  [0, 1.0, -1.2],
];
const AFTER: [number, number, number][] = [
  [0, 1.0, -1.2],
  [0, 1.1, -2.2],
  [0, 1.3, -3.4],
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + SCENES.outro.from;
  const s = SCENES.outro.from;
  const tExec = at("hasilnya bergantung");
  const tQ = at("Menurutmu");
  const paths = prog(t, s + 0.1, s + 1.6);
  const gate = pop(t, tExec - 0.2, 0.6);
  const after = prog(t, tExec + 0.3, tExec + 1.5);
  const q = interpolate(t, [tQ - 0.15, tQ + 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const camY = lerp(6.2, 6.8, prog(t, s, s + 6));

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - 0.9 * q }}>
        <Stage cam={[0, camY, 7.6]} look={[0, 0.8, -0.6]} fov={36}>
          <GrowPath points={FACT_PATH} progress={paths} color={C.fact} radius={0.07} />
          <GrowPath points={HYPO_PATH} progress={paths} color={C.hypo} radius={0.07} dashed />
          {/* "Pelaksanaan" gate both paths must pass through */}
          <group position={[0, 1.0, -1.2]} scale={Math.max(0.001, gate)}>
            <mesh castShadow>
              <torusGeometry args={[0.62, 0.11, 24, 64]} />
              <Clay color={C.white} />
            </mesh>
            <mesh position={[0, -0.7, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.1, 0.8, 16]} />
              <Clay color={C.white} />
            </mesh>
          </group>
          <GrowPath points={AFTER} progress={after} color={C.ink} radius={0.07} />
          <PathTip points={AFTER} progress={after} color={C.ink} size={0.15} />
          <Label position={[-1.55, 1.15, 1.6]} opacity={pop(t, s + 0.6)} accent={C.fact} size={26}>
            Arah prioritas
          </Label>
          <Label position={[1.55, 1.15, 1.6]} opacity={pop(t, s + 0.8)} accent={C.hypo} size={26} dashed>
            bisa berubah
          </Label>
          <Label position={[0, 2.15, -1.2]} opacity={gate} tone="dark" size={30}>
            PELAKSANAAN
          </Label>
          <Label position={[0, 2.0, -3.4]} opacity={after} accent={C.ink} size={24}>
            Hasil
          </Label>
        </Stage>
      </div>

      {/* closing question */}
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.right - SAFE.left,
          top: 520,
          opacity: q,
          transform: `translateY(${(1 - q) * 30}px)`,
          fontFamily: FONT,
          color: C.ink,
          textAlign: "left",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 2, color: C.hypo, marginBottom: 18 }}>
          PERTANYAAN UNTUKMU
        </div>
        <div style={{ fontWeight: 800, fontSize: 86, lineHeight: 1.04, letterSpacing: -2 }}>
          Menurutmu, kebijakan apa yang paling mungkin berbeda?
        </div>
      </div>
      <ModeBadge mode="hipotetis" from={0} />
      <Footnote from={0} to={Math.round((SCENES.outro.to - s) * FPS) + 30}>
        Skenario hipotetis, bukan prediksi. Sumber lengkap ada di caption.
      </Footnote>
    </AbsoluteFill>
  );
};
