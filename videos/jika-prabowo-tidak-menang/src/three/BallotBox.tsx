import React from "react";
import { C } from "../theme";
import { RoundedBox } from "./common";

/** Generic ballot box (no official insignia). `drop` 0→1 animates a ballot sliding into the slot. */
export const BallotBox: React.FC<{ drop: number; position?: [number, number, number]; scale?: number }> = ({
  drop,
  position = [0, 0, 0],
  scale = 1,
}) => {
  const ballotY = 2.3 - drop * 1.25;
  const ballotVisible = drop < 0.98;
  return (
    <group position={position} scale={scale}>
      {/* body */}
      <RoundedBox size={[1.9, 1.5, 1.5]} radius={0.12} position={[0, 0.75, 0]} color={C.white} />
      {/* translucent upper rim */}
      <RoundedBox size={[2.0, 0.16, 1.6]} radius={0.06} position={[0, 1.52, 0]} color={C.paper2} />
      {/* slot */}
      <RoundedBox size={[1.0, 0.04, 0.12]} radius={0.02} position={[0, 1.61, 0]} color={C.ink} />
      {/* front band */}
      <RoundedBox size={[1.92, 0.36, 0.04]} radius={0.015} position={[0, 0.8, 0.76]} color={C.fact} />
      {/* ballot paper */}
      {ballotVisible ? (
        <group position={[0, ballotY, 0]}>
          <RoundedBox size={[0.86, 0.6, 0.02]} radius={0.01} color={C.white} />
          <RoundedBox size={[0.1, 0.1, 0.022]} radius={0.01} position={[-0.22, 0.12, 0]} color={C.hypo} />
          <RoundedBox size={[0.5, 0.04, 0.022]} radius={0.01} position={[0.12, 0.12, 0]} color={C.muted} />
          <RoundedBox size={[0.5, 0.04, 0.022]} radius={0.01} position={[0.12, -0.02, 0]} color={C.paper2} />
          <RoundedBox size={[0.5, 0.04, 0.022]} radius={0.01} position={[0.12, -0.14, 0]} color={C.paper2} />
        </group>
      ) : null}
    </group>
  );
};
