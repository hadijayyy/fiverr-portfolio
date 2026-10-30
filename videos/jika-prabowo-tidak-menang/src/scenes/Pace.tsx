import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Footnote, ModeBadge, SectionChip } from "../overlays";
import { Label, RoundedBox, Stage, lerp, pop, prog } from "../three/common";
import { at, C, FPS, PAIRS, SCENES } from "../theme";

type PairId = keyof typeof PAIRS;

/** Small office-tower stack standing in for the Ibu Kota Nusantara project. */
const ProjectIKN: React.FC<{ position: [number, number, number]; color: string; opacity?: number }> = ({
  position,
  color,
  opacity = 1,
}) => (
  <group position={position}>
    <RoundedBox size={[0.7, 0.14, 0.7]} radius={0.04} position={[0, 0.07, 0]} color={C.white} opacity={opacity} />
    <RoundedBox size={[0.26, 0.7, 0.26]} radius={0.04} position={[-0.14, 0.49, -0.08]} color={color} opacity={opacity} />
    <RoundedBox size={[0.22, 0.5, 0.22]} radius={0.04} position={[0.16, 0.39, 0.1]} color={color} opacity={opacity} />
  </group>
);

/** Clinic/school block standing in for "kebutuhan dasar" (health, education). */
const ProjectBasic: React.FC<{ position: [number, number, number]; color: string }> = ({ position, color }) => (
  <group position={position}>
    <RoundedBox size={[0.7, 0.14, 0.7]} radius={0.04} position={[0, 0.07, 0]} color={C.white} />
    <RoundedBox size={[0.6, 0.36, 0.44]} radius={0.05} position={[0, 0.32, 0]} color={color} />
    <RoundedBox size={[0.08, 0.26, 0.04]} radius={0.01} position={[0, 0.34, 0.23]} color={C.white} />
    <RoundedBox size={[0.26, 0.08, 0.04]} radius={0.01} position={[0, 0.34, 0.23]} color={C.white} />
  </group>
);

const LANE_LEN = 4.2;
const laneX = (i: number) => (i - 1) * 1.45;

export const Pace: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + SCENES.pace.from;
  const s = SCENES.pace.from;
  const t02 = at("berjanji melanjutkan") + 1.0;
  const t03 = at("secara bertahap");
  const t01 = t03 + 1.6;
  const end = SCENES.pace.to;
  const lanesIn = prog(t, s, s + 0.6);

  // 02: continuous advance. 03: stop-and-go (bertahap). 01: basic-needs block goes first; IKN waits in queue.
  const p02 = prog(t, t02, end + 0.3);
  const steps = 3;
  const raw03 = Math.min(1, Math.max(0, (t - t03) / (end - t03)));
  const k = raw03 * steps;
  const p03 = (Math.floor(k) + prog(k - Math.floor(k), 0, 0.45)) / steps;
  const p01 = prog(t, t01, end + 0.3);

  const lanes: { id: PairId; caption: string; when: number }[] = [
    { id: "01", caption: "Dahulukan kebutuhan dasar", when: t01 },
    { id: "02", caption: "Lanjutkan IKN", when: t02 },
    { id: "03", caption: "IKN bertahap", when: t03 },
  ];

  return (
    <AbsoluteFill>
      <Stage cam={[0, 5.0, 6.2]} look={[0, 0.2, -1.2]} fov={36}>
        {lanes.map((l, i) => {
          const x = laneX(i);
          const color = PAIRS[l.id].color;
          return (
            <group key={l.id}>
              {/* lane */}
              <RoundedBox
                size={[1.05, 0.06, LANE_LEN * lanesIn + 0.001]}
                radius={0.03}
                position={[x, 0.03, 1.4 - (LANE_LEN * lanesIn) / 2]}
                color={C.white}
              />
              {/* distance ticks */}
              {[0.25, 0.5, 0.75].map((f) => (
                <RoundedBox key={f} size={[1.05, 0.065, 0.03]} radius={0.01} position={[x, 0.035, 1.4 - LANE_LEN * f]} color={C.paper2} opacity={lanesIn} />
              ))}
              {/* priority card at the start of each lane decides which project moves first */}
              <RoundedBox size={[0.9, 0.08, 0.34]} radius={0.04} position={[x, 0.1, 1.65]} color={color} />
              <Label position={[x, 0.18, 1.9]} tone="accent" accent={color} size={22} opacity={lanesIn}>
                {l.id}
              </Label>
              <Label position={[x, 1.35, lerp(0.9, 0.4, 0)]} opacity={pop(t, l.when - 0.3)} accent={color} size={22} width={210}>
                {l.caption}
              </Label>
            </group>
          );
        })}
        {/* 01: basic needs first, IKN queued behind */}
        <ProjectBasic position={[laneX(0), 0.06, lerp(1.0, 1.0 - LANE_LEN * 0.8, p01)]} color={PAIRS["01"].color} />
        <ProjectIKN position={[laneX(0), 0.06, 1.0 + 0.85]} color={C.neutralBlock} opacity={0.9} />
        {/* 02 */}
        <ProjectIKN position={[laneX(1), 0.06, lerp(1.0, 1.0 - LANE_LEN * 0.8, p02)]} color={PAIRS["02"].color} />
        {/* 03 */}
        <ProjectIKN position={[laneX(2), 0.06, lerp(1.0, 1.0 - LANE_LEN * 0.8, p03)]} color={PAIRS["03"].color} />
        <Label position={[0, 0.9, -3.1]} tone="dark" size={22} opacity={lanesIn}>
          Laju proyek →
        </Label>
      </Stage>
      <ModeBadge mode="hipotetis" from={0} />
      <SectionChip text="3/3 · KECEPATAN" from={0} />
      <Footnote from={0} to={Math.round((SCENES.pace.to - s) * FPS) + 8}>
        Ilustrasi urutan prioritas, bukan prediksi jadwal. IKN tidak tercantum di visi-misi 01; timnya menyatakan IKN tidak
        dibatalkan.
      </Footnote>
    </AbsoluteFill>
  );
};
