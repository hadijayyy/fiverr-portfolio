import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BallotBox } from "../three/BallotBox";
import { GrowPath, Label, PathTip, Stage, lerp, pop, prog } from "../three/common";
import { C, FONT, FPS, SCENES } from "../theme";

export const TRUNK: [number, number, number][] = [
  [0, 1.65, 0],
  [0, 2.4, -0.4],
  [0, 3.0, -1.4],
];
export const FACT_BRANCH: [number, number, number][] = [
  [0, 3.0, -1.4],
  [-0.6, 3.3, -2.2],
  [-1.7, 3.5, -3.0],
];
export const HYPO_BRANCH: [number, number, number][] = [
  [0, 3.0, -1.4],
  [0.6, 3.3, -2.2],
  [1.7, 3.5, -3.0],
];

/** Ballot box whose result line splits into "history" and "what if" branches. Also used by the cover. */
export const HookStage: React.FC<{ t: number; showLabels?: boolean; cover?: boolean }> = ({
  t,
  showLabels = true,
  cover = false,
}) => {
  const drop = prog(t, 0.2, 1.1);
  const trunk = prog(t, 1.1, 2.0);
  const branches = prog(t, 2.0, 3.2);
  const camZ = lerp(11.2, 10.2, prog(t, 0, 5));
  return (
    <Stage cam={cover ? [2.0, 3.2, 7.6] : [2.6, 3.4, camZ]} look={cover ? [0, 2.0, -1.2] : [0, 2.75, -1.2]} fov={34}>
      <BallotBox drop={drop} />
      <GrowPath points={TRUNK} progress={trunk} color={C.fact} radius={0.07} />
      <GrowPath points={FACT_BRANCH} progress={branches} color={C.fact} radius={0.07} />
      <PathTip points={FACT_BRANCH} progress={branches} color={C.fact} size={0.13} />
      <GrowPath points={HYPO_BRANCH} progress={branches} color={C.hypo} radius={0.07} dashed />
      <PathTip points={HYPO_BRANCH} progress={branches} color={C.hypo} size={0.13} />
      {showLabels ? (
        <>
          <Label position={[0, 0.8, 0.95]} size={22} opacity={pop(t, 0.1)}>
            KOTAK SUARA
          </Label>
          <Label position={[-1.75, 4.05, -3.0]} opacity={pop(t, 2.8)} accent={C.fact} size={28}>
            Sejarah: hasil resmi
          </Label>
          <Label position={[1.75, 4.05, -3.0]} opacity={pop(t, 3.1)} accent={C.hypo} size={28} dashed>
            Bagaimana jika…?
          </Label>
        </>
      ) : null}
    </Stage>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + SCENES.hook.from;
  const titleIn = pop(t, 0.05, 0.5);
  return (
    <AbsoluteFill>
      <HookStage t={t} />
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 70,
          width: 880,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 1.02,
          letterSpacing: -2,
          color: C.ink,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 20}px)`,
        }}
      >
        Jika Prabowo
        <br />
        <span style={{ color: C.hypo }}>tidak menang?</span>
      </div>
    </AbsoluteFill>
  );
};
