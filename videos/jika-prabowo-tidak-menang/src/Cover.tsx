import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, SAFE } from "./overlays";
import { HookStage } from "./scenes/Hook";
import { C, FONT } from "./theme";

/** Reels cover. Key text sits in the centre 3:4 area so the profile-grid crop keeps it. */
export const Cover: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, bottom: 0 }}>
      <HookStage t={4.2} showLabels={false} cover />
    </div>
    <div
      style={{
        position: "absolute",
        top: 300,
        left: SAFE.left,
        width: 940,
        fontFamily: FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "12px 22px",
          borderRadius: 999,
          background: C.hypo,
          color: C.white,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
          marginBottom: 26,
        }}
      >
        SKENARIO HIPOTETIS · PILPRES 2024
      </div>
      <div style={{ fontWeight: 800, fontSize: 118, lineHeight: 0.98, letterSpacing: -4 }}>
        JIKA PRABOWO
        <br />
        <span style={{ color: C.hypo }}>TIDAK MENANG?</span>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 905,
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 40,
        lineHeight: 1.25,
        color: C.inkSoft,
      }}
    >
      Anggaran · Koalisi · Kecepatan kebijakan
    </div>
  </AbsoluteFill>
);
