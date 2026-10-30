import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, ModeBadge, Subtitles } from "./overlays";
import { Branch } from "./scenes/Branch";
import { Budget } from "./scenes/Budget";
import { Coalition } from "./scenes/Coalition";
import { Hook } from "./scenes/Hook";
import { Limits } from "./scenes/Limits";
import { Outro } from "./scenes/Outro";
import { Pace } from "./scenes/Pace";
import { FPS, SCENES, SceneId } from "./theme";

const XFADE = 8;

const SceneSlot: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const from = Math.round(SCENES[id].from * FPS);
  const to = Math.round(SCENES[id].to * FPS);
  const isLast = id === "outro";
  const total = to - from + (isLast ? 0 : XFADE);
  return (
    <Sequence from={from} durationInFrames={total} name={id}>
      <Fade total={total} fadeOut={!isLast}>
        {children}
      </Fade>
    </Sequence>
  );
};

const Fade: React.FC<{ total: number; fadeOut: boolean; children: React.ReactNode }> = ({ total, fadeOut, children }) => {
  const f = useCurrentFrame();
  const o = fadeOut
    ? interpolate(f, [0, XFADE, total - XFADE, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(f, [0, XFADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Explainer: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <SceneSlot id="hook">
        <Hook />
        <ModeBadge mode="hipotetis" from={0} />
      </SceneSlot>
      <SceneSlot id="branch">
        <Branch />
      </SceneSlot>
      <SceneSlot id="budget">
        <Budget />
      </SceneSlot>
      <SceneSlot id="coalition">
        <Coalition />
      </SceneSlot>
      <SceneSlot id="pace">
        <Pace />
      </SceneSlot>
      <SceneSlot id="limits">
        <Limits />
      </SceneSlot>
      <SceneSlot id="outro">
        <Outro />
      </SceneSlot>
      <Subtitles />
      <Audio src={staticFile("audio/voice.wav")} />
      <Audio src={staticFile("audio/music.wav")} volume={0.16} />
    </AbsoluteFill>
  );
};
