import React, { useLayoutEffect, useMemo, useRef } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Footnote, ModeBadge, SectionChip } from "../overlays";
import { Clay, GrowPath, Label, RoundedBox, Stage, lerp, pop, prog } from "../three/common";
import { at, C, FPS, PAIRS, SCENES } from "../theme";

// DPR 2024–2029 seats (Keputusan KPU No. 1205/2024), grouped by the parties that nominated each pair:
// 01 NasDem 69 + PKB 68 + PKS 53 = 190 · 02 Golkar 102 + Gerindra 86 + PAN 48 + Demokrat 44 = 280 ·
// 03 PDI-P 110 (PPP, Perindo, Hanura won no DPR seats). Total 580, majority 291.
const TOTAL = 580;
const MAJ = 291;
const BLOCS = [
  { id: "01" as const, seats: 190 },
  { id: "02" as const, seats: 280 },
  { id: "03" as const, seats: 110 },
];

const seatLayout = (() => {
  const rows = 9;
  const radii = Array.from({ length: rows }, (_, i) => 1.0 + i * 0.235);
  const sum = radii.reduce((a, b) => a + b, 0);
  const counts = radii.map((r) => Math.round((TOTAL * r) / sum));
  counts[rows - 1] += TOTAL - counts.reduce((a, b) => a + b, 0);
  const seats: { x: number; z: number; angle: number }[] = [];
  radii.forEach((r, i) => {
    for (let k = 0; k < counts[i]; k++) {
      const a = Math.PI - (Math.PI * (k + 0.5)) / counts[i];
      seats.push({ x: Math.cos(a) * r, z: -Math.sin(a) * r, angle: a });
    }
  });
  // Sort by angle (left → right) so each bloc forms one wedge.
  seats.sort((p, q) => q.angle - p.angle);
  return seats;
})();

const blocOf = (i: number) => (i < BLOCS[0].seats ? 0 : i < BLOCS[0].seats + BLOCS[1].seats ? 1 : 2);

const Seats: React.FC<{ appear: number; colorize: number }> = ({ appear, colorize }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.BoxGeometry(0.13, 0.12, 0.13), []);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const base = new THREE.Color(C.neutralBlock);
    seatLayout.forEach((s, i) => {
      const k = Math.min(1, Math.max(0, appear * 1.25 - (i / TOTAL) * 0.25));
      o.position.set(s.x, 0.06 + (1 - k) * 0.4, s.z);
      o.rotation.set(0, Math.PI / 2 - s.angle, 0);
      o.scale.setScalar(Math.max(0.001, k));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      const target = new THREE.Color(PAIRS[BLOCS[blocOf(i)].id].color);
      m.setColorAt(i, base.clone().lerp(target, colorize));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [appear, colorize]);
  return (
    <instancedMesh ref={ref} args={[geo, undefined, TOTAL]} castShadow receiveShadow>
      <meshStandardMaterial roughness={0.75} />
    </instancedMesh>
  );
};

const BAR_X0 = -1.45;
const BAR_SCALE = 3.3 / TOTAL; // scene units per seat
const majX = BAR_X0 + MAJ * BAR_SCALE;

export const Coalition: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + SCENES.coalition.from;
  const s = SCENES.coalition.from;
  const tMaj = at("menguasai mayoritas");
  const tHug = at("merangkul partai lain");
  const appear = prog(t, s + 0.1, s + 1.4);
  const colorize = prog(t, s + 1.2, s + 1.9);
  const bars = prog(t, tMaj - 0.5, tMaj + 0.5);
  const majLine = pop(t, tMaj - 0.2);
  const hug = prog(t, tHug, tHug + 1.0);
  const camY = lerp(5.4, 6.0, prog(t, s, s + 6));

  return (
    <AbsoluteFill>
      <Stage cam={[0, camY, 6.6]} look={[0, 0.15, -0.6]} fov={38}>
        <group position={[0, 0, -0.35]}>
          <Seats appear={appear} colorize={colorize} />
          <Label position={[0, 0.35, -0.5]} tone="dark" size={24} opacity={appear}>
            DPR · 580 kursi
          </Label>
        </group>
        {/* seat bars vs. majority */}
        <group position={[0, 0.02, 1.15]}>
          {BLOCS.map((b, i) => {
            const len = Math.max(0.001, b.seats * BAR_SCALE * bars);
            const z = (i - 1) * 0.42;
            return (
              <group key={b.id} visible={bars > 0.01}>
                <RoundedBox size={[len, 0.16, 0.26]} radius={0.04} position={[BAR_X0 + len / 2, 0.08, z]} color={PAIRS[b.id].color} />
                <Label position={[BAR_X0 - 0.45, 0.1, z]} opacity={bars} accent={PAIRS[b.id].color} size={22}>
                  {b.id} · {b.seats}
                </Label>
                {/* dashed extension: any winner must add partners to pass 291 */}
                <GrowPath
                  points={[
                    [BAR_X0 + b.seats * BAR_SCALE + 0.05, 0.1, z],
                    [majX + 0.32, 0.1, z],
                  ]}
                  progress={hug}
                  color={C.hypo}
                  radius={0.045}
                  dashed
                />
              </group>
            );
          })}
          <mesh position={[majX, 0.25, 0]} scale={[1, Math.max(0.001, majLine), 1]} visible={majLine > 0.01}>
            <boxGeometry args={[0.03, 0.5, 1.45]} />
            <Clay color={C.ink} />
          </mesh>
          <Label position={[majX, 0.7, -0.7]} tone="dark" size={22} opacity={majLine}>
            Mayoritas: 291
          </Label>
          <Label position={[majX + 0.75, 0.45, 0.8]} tone="accent" accent={C.hypo} size={24} opacity={hug}>
            + partai lain
          </Label>
        </group>
      </Stage>
      <ModeBadge mode="hipotetis" from={0} />
      <SectionChip text="2/3 · KOALISI" from={0} />
      <Footnote from={0} to={Math.round((SCENES.coalition.to - s) * FPS) + 8}>
        Kursi DPR 2024–2029 milik partai pengusung tiap pasangan (Keputusan KPU No. 1205/2024). PPP, Perindo, dan Hanura
        tidak meraih kursi.
      </Footnote>
    </AbsoluteFill>
  );
};
