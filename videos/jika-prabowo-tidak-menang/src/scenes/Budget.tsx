import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Footnote, ModeBadge, SectionChip } from "../overlays";
import { Clay, Label, RoundedBox, Stage, lerp, pop, prog } from "../three/common";
import { at, C, FPS, PAIRS, SCENES } from "../theme";

type PairId = keyof typeof PAIRS;

// Equal-sized blocks on purpose: the video shows *which* programme a pair puts first,
// not how much money it would get (no budget figures are invented).
const BLOCKS: { key: string; label?: string; pair?: PairId; slot: number }[] = [
  { key: "mbg", label: "Makan siang & susu gratis", pair: "02", slot: 0 },
  { key: "rumah", label: "Perumahan rakyat", pair: "01", slot: 1 },
  { key: "ktp", label: "KTP Sakti", pair: "03", slot: 2 },
  { key: "faskes", label: "1 desa, 1 faskes, 1 nakes", pair: "03", slot: 3 },
  { key: "n1", slot: 4 },
  { key: "n2", slot: 5 },
];
const shiftLabelHidden = (t: number, tShift: number) => t < tShift - 0.1;
const SLOT_POS = (slot: number): [number, number] => [((slot % 3) - 1) * 1.3, slot < 3 ? -0.55 : 0.55];

export const Budget: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + SCENES.budget.from;
  const t02 = at("mengusung makan siang");
  const t01 = at("menonjolkan perumahan");
  const t03 = at("KTP Sakti");
  const tShift = at("Porsi anggaran");
  const active: PairId | null = t >= t03 - 0.1 ? "03" : t >= t01 - 0.1 ? "01" : t >= t02 - 0.1 ? "02" : null;
  const shift = prog(t, tShift, tShift + 1.2);
  const trayIn = pop(t, SCENES.budget.from + 0.1, 0.6);

  const tokenDrop = (pair: PairId, when: number) => prog(t, when - 0.35, when + 0.25);

  return (
    <AbsoluteFill>
      <Stage cam={[0, 6.2, 6.6]} look={[0, 0.3, -0.1]} fov={34}>
        {/* APBN tray */}
        <group scale={[1, trayIn, 1]}>
          <RoundedBox size={[4.4, 0.22, 2.6]} radius={0.14} position={[0, 0.11, 0]} color={C.white} />
        </group>
        {BLOCKS.map((b) => {
          const isActive = b.pair && b.pair === active && shift < 0.5;
          const lift = isActive ? prog(t, (b.pair === "02" ? t02 : b.pair === "01" ? t01 : t03) - 0.05, (b.pair === "02" ? t02 : b.pair === "01" ? t01 : t03) + 0.45) : 0;
          // On "porsi anggaran berpotensi bergeser" the blocks trade places: priorities reshuffle.
          const targetSlot = (b.slot + 2) % 6;
          const [x0, z0] = SLOT_POS(b.slot);
          const [x1, z1] = SLOT_POS(targetSlot);
          const x = lerp(x0, x1, shift);
          const z = lerp(z0, z1, shift);
          const hop = Math.sin(Math.PI * shift) * 0.6;
          const seen = b.pair ? t >= (b.pair === "02" ? t02 : b.pair === "01" ? t01 : t03) - 0.1 : false;
          const color = b.pair && seen ? PAIRS[b.pair].color : C.neutralBlock;
          const y = 0.22 + 0.25 + lift * 0.55 + hop;
          return (
            <group key={b.key}>
              <RoundedBox
                size={[1.1, 0.5, 0.9]}
                radius={0.08}
                position={[x, y * trayIn, z]}
                color={color}
                emissive={isActive ? PAIRS[b.pair as PairId].color : "#000000"}
                emissiveIntensity={isActive ? 0.15 * lift : 0}
              />

            </group>
          );
        })}
        {/* pair tokens drop onto the tray edge: the cause that lifts the matching block */}
        {(["02", "01", "03"] as PairId[]).map((p, i) => {
          const when = p === "02" ? t02 : p === "01" ? t01 : t03;
          const d = tokenDrop(p, when);
          if (d <= 0) return null;
          const x = (i - 1) * 1.3;
          return (
            <group key={p} position={[x, lerp(2.6, 0.32, d), 1.75]}>
              <mesh castShadow rotation-x={Math.PI / 2}>
                <cylinderGeometry args={[0.32, 0.32, 0.12, 40]} />
                <Clay color={PAIRS[p].color} />
              </mesh>
              <Label position={[0, 0.0, 0.25]} tone="accent" accent={PAIRS[p].color} size={24} opacity={d}>
                {p}
              </Label>
            </group>
          );
        })}
        {active && shiftLabelHidden(t, tShift) ? (
          <Label position={[0, 2.25, -0.2]} tone="accent" accent={PAIRS[active].color} size={30}>
            {active} · {BLOCKS.filter((b) => b.pair === active).map((b) => b.label).join(" + ")}
          </Label>
        ) : null}
        <Label position={[0, 0.25, 1.45]} tone="dark" size={24} opacity={trayIn}>
          APBN
        </Label>
        {shift > 0 ? (
          <Label position={[0, 2.0, 0]} opacity={shift} tone="accent" accent={C.hypo} size={30}>
            Prioritas berpotensi bergeser
          </Label>
        ) : null}
      </Stage>
      <ModeBadge mode="hipotetis" from={0} />
      <SectionChip text="1/3 · ANGGARAN" from={0} />
      <Footnote from={0} to={Math.round((SCENES.budget.to - SCENES.budget.from) * FPS) + 8}>
        Program unggulan dari visi-misi & kampanye 2023–2024. Blok berukuran sama — ilustrasi prioritas, bukan angka
        anggaran.
      </Footnote>
    </AbsoluteFill>
  );
};
