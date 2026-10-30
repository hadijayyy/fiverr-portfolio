import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Footnote, ModeBadge, SectionChip } from "../overlays";
import { Clay, GrowPath, Label, RoundedBox, Stage, lerp, pop, prog } from "../three/common";
import { at, C, FPS, SCENES } from "../theme";

/** Generic, faceless figure — represents the office, not any real person. */
export const Figure: React.FC<{ position: [number, number, number]; color?: string; scale?: number }> = ({
  position,
  color = C.ink,
  scale = 1,
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.42, 0]} castShadow>
      <capsuleGeometry args={[0.2, 0.42, 8, 24]} />
      <Clay color={color} />
    </mesh>
    <mesh position={[0, 0.98, 0]} castShadow>
      <sphereGeometry args={[0.17, 32, 24]} />
      <Clay color={color} />
    </mesh>
  </group>
);

const DPRBuilding: React.FC<{ glow: number }> = ({ glow }) => (
  <group>
    <RoundedBox size={[1.5, 0.16, 1.0]} radius={0.04} position={[0, 0.08, 0]} color={C.white} />
    {[-0.55, -0.27, 0, 0.27, 0.55].map((x) => (
      <mesh key={x} position={[x, 0.42, 0.32]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.52, 16]} />
        <Clay color={C.white} />
      </mesh>
    ))}
    <RoundedBox size={[1.5, 0.12, 1.0]} radius={0.04} position={[0, 0.74, 0]} color={C.white} />
    {/* low dome, generic parliament motif */}
    <mesh position={[0, 0.8, -0.05]} scale={[1.55, 0.6, 1.0]} castShadow>
      <sphereGeometry args={[0.42, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <Clay color="#A9C2A9" emissive="#C65D3B" emissiveIntensity={0.2 * glow} />
    </mesh>
  </group>
);

const Rulebook: React.FC<{ glow: number }> = ({ glow }) => (
  <group>
    {[0, 1, 2].map((i) => (
      <RoundedBox
        key={i}
        size={[0.9 - i * 0.08, 0.16, 0.65]}
        radius={0.03}
        position={[0, 0.08 + i * 0.17, 0]}
        rotation={[0, i * 0.18, 0]}
        color={i === 1 ? "#8EA6C8" : i === 2 ? "#C9B79C" : "#A7BFA8"}
        emissive="#ffffff"
        emissiveIntensity={0.12 * glow}
      />
    ))}
  </group>
);

const Bureaucracy: React.FC<{ glow: number }> = ({ glow }) => (
  <group>
    {[
      [-0.42, 0.7],
      [0, 1.0],
      [0.42, 0.55],
    ].map(([x, h]) => (
      <RoundedBox key={x} size={[0.36, h, 0.5]} radius={0.04} position={[x, h / 2, 0]} color={C.white} emissive="#6C63A6" emissiveIntensity={0.1 * glow} />
    ))}
    {[0.25, 0.5, 0.75].map((y) => (
      <RoundedBox key={y} size={[0.3, 0.05, 0.02]} radius={0.005} position={[0, y, 0.26]} color={C.muted} />
    ))}
  </group>
);

const Economy: React.FC<{ glow: number; squeeze: number }> = ({ glow, squeeze }) => (
  <group>
    {[
      [-0.3, 5],
      [0.05, 7],
      [0.38, 4],
    ].map(([x, n]) => (
      <group key={x} position={[x, 0, 0]}>
        {Array.from({ length: n }).map((_, i) => (
          <mesh key={i} position={[0, 0.05 + i * 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
            <Clay color="#D9B55B" emissive="#D9B55B" emissiveIntensity={0.1 * glow} />
          </mesh>
        ))}
      </group>
    ))}
    {/* narrowing gate = limited fiscal room */}
    <RoundedBox size={[0.12, 0.8, 0.12]} radius={0.03} position={[lerp(-0.75, -0.45, squeeze), 0.4, 0.55]} color={C.ink} />
    <RoundedBox size={[0.12, 0.8, 0.12]} radius={0.03} position={[lerp(0.75, 0.45, squeeze), 0.4, 0.55]} color={C.ink} />
  </group>
);

const R = 2.15;
const STATIONS = {
  dpr: new THREE.Vector3(-R * 0.95, 0, -0.9),
  rules: new THREE.Vector3(R * 0.95, 0, -0.9),
  bureau: new THREE.Vector3(-R * 0.75, 0, 1.25),
  econ: new THREE.Vector3(R * 0.75, 0, 1.25),
};
const CENTER = new THREE.Vector3(0, 0, 0.05);

const arc = (a: THREE.Vector3, b: THREE.Vector3, h = 0.9): [number, number, number][] => {
  const m = a.clone().add(b).multiplyScalar(0.5);
  return [
    [a.x, 0.5, a.z],
    [m.x, h, m.z],
    [b.x, 0.5, b.z],
  ];
};

export const Limits: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + SCENES.limits.from;
  const s = SCENES.limits.from;
  const tLaw = at("Undang-undang dan APBN");
  const tBureau = at("birokrasi menjalankan");
  const tEcon = tBureau + 1.3;

  const pDpr = prog(t, tLaw, tLaw + 1.0);
  const pRules = prog(t, tLaw + 0.6, tLaw + 1.6);
  const pBureau = prog(t, tBureau - 0.1, tBureau + 0.9);
  const pEcon = prog(t, tEcon, tEcon + 0.9);
  const squeeze = prog(t, tEcon + 0.6, tEcon + 1.6);

  // The policy block travels president → DPR → bureaucracy → economy, shrinking at the fiscal gate.
  const route = [CENTER, STATIONS.dpr, STATIONS.bureau, STATIONS.econ];
  const legs = [pDpr, pBureau, pEcon];
  let pos = CENTER.clone();
  for (let i = 0; i < legs.length; i++) {
    if (legs[i] > 0) pos = route[i].clone().lerp(route[i + 1], legs[i]);
  }
  const blockScale = lerp(1, 0.6, squeeze);
  const blockIn = pop(t, s + 0.6);

  return (
    <AbsoluteFill>
      <Stage cam={[0, 6.0, 7.2]} look={[0, 0.35, 0.1]} fov={36}>
        {/* dais + generic president figure */}
        <RoundedBox size={[1.2, 0.18, 1.2]} radius={0.12} position={[0, 0.09, 0.05]} color={C.white} />
        <Figure position={[0, 0.18, -0.15]} scale={pop(t, s + 0.1)} />
        <Label position={[0, 1.45, 0.1]} tone="dark" size={22} opacity={pop(t, s + 0.3)}>
          PRESIDEN (siapa pun)
        </Label>
        {/* stations */}
        <group position={STATIONS.dpr}>
          <DPRBuilding glow={pDpr} />
          <Label position={[0, 1.45, 0]} opacity={pop(t, s + 0.5)} accent={C.hypo} size={24}>
            DPR
          </Label>
        </group>
        <group position={STATIONS.rules}>
          <Rulebook glow={pRules} />
          <Label position={[0, 1.05, 0]} opacity={pop(t, s + 0.6)} accent={C.p03} size={24}>
            Aturan & UU
          </Label>
        </group>
        <group position={STATIONS.bureau}>
          <Bureaucracy glow={pBureau} />
          <Label position={[0, 1.4, 0]} opacity={pop(t, s + 0.7)} accent={C.p03} size={24}>
            Birokrasi
          </Label>
        </group>
        <group position={STATIONS.econ}>
          <Economy glow={pEcon} squeeze={squeeze} />
          <Label position={[0, 1.1, 0]} opacity={pop(t, s + 0.8)} accent={C.p02} size={24}>
            Kondisi ekonomi
          </Label>
        </group>
        {/* links */}
        <GrowPath points={arc(CENTER, STATIONS.dpr)} progress={pDpr} color={C.fact} radius={0.03} />
        <GrowPath points={arc(STATIONS.dpr, STATIONS.rules, 2.1)} progress={pRules} color={C.fact} radius={0.03} dashed />
        <GrowPath points={arc(STATIONS.dpr, STATIONS.bureau)} progress={pBureau} color={C.fact} radius={0.03} />
        <GrowPath points={arc(STATIONS.bureau, STATIONS.econ)} progress={pEcon} color={C.fact} radius={0.03} />
        {/* policy block */}
        <group position={[pos.x, 0.75 + Math.sin(Math.PI * ((pDpr + pBureau + pEcon) % 1)) * 0.3, pos.z]} scale={blockIn * blockScale}>
          <RoundedBox size={[0.42, 0.42, 0.42]} radius={0.06} color={C.hypo} />
          {squeeze < 0.05 ? (
            <Label position={[0, 0.5, 0]} tone="accent" accent={C.hypo} size={20}>
              Kebijakan
            </Label>
          ) : null}
        </group>
      </Stage>
      <ModeBadge mode="konteks" from={0} />
      <SectionChip text="BATAS PERUBAHAN" from={0} />
      <Footnote from={0} to={Math.round((SCENES.limits.to - s) * FPS) + 8}>
        UUD 1945 Pasal 20 & 23: rancangan UU dan APBN dibahas Presiden bersama DPR.
      </Footnote>
    </AbsoluteFill>
  );
};
