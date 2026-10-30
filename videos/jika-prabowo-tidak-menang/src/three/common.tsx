import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Easing, interpolate } from "remotion";
import { C, FONT } from "../theme";

export const STAGE = { top: 170, width: 1080, height: 1010 };

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** 0→1 progress between two times (seconds), eased. */
export const prog = (t: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const pop = (t: number, a: number, d = 0.45) => prog(t, a, a + d, Easing.out(Easing.back(1.6)));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const CameraRig: React.FC<{ pos: [number, number, number]; look: [number, number, number]; fov: number }> = ({
  pos,
  look,
  fov,
}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...pos);
  camera.fov = fov;
  camera.updateProjectionMatrix();
  camera.lookAt(...look);
  return null;
};

/** Light, soft diorama stage: paper backdrop, floor with soft shadows, warm key light. */
export const Stage: React.FC<{
  children: React.ReactNode;
  cam: [number, number, number];
  look?: [number, number, number];
  fov?: number;
  floor?: boolean;
}> = ({ children, cam, look = [0, 0, 0], fov = 32, floor = true }) => {
  const labels: PlacedLabel[] = [];
  collectLabels(children, [0, 0, 0], [1, 1, 1], labels);
  const camera = new THREE.PerspectiveCamera(fov, STAGE.width / STAGE.height, 0.1, 200);
  camera.position.set(...cam);
  camera.lookAt(...look);
  camera.updateMatrixWorld();
  const placed = labels
    .map((l) => {
      const v = new THREE.Vector3(...l.world);
      const dist = v.distanceTo(camera.position);
      v.project(camera);
      return { ...l, x: ((v.x + 1) / 2) * STAGE.width, y: ((1 - v.y) / 2) * STAGE.height, dist, front: v.z < 1 };
    })
    .filter((l) => l.front)
    .sort((a, b) => b.dist - a.dist);
  return (
    <div style={{ position: "absolute", top: STAGE.top, left: 0, width: STAGE.width, height: STAGE.height }}>
      <ThreeCanvas
        width={STAGE.width}
        height={STAGE.height}
        shadows
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        style={{ background: "transparent" }}
      >
        <CameraRig pos={cam} look={look} fov={fov} />
        <hemisphereLight args={["#ffffff", "#d9cfbd", 1.1]} />
        <directionalLight
          position={[4, 9, 6]}
          intensity={1.9}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          shadow-bias={-0.0004}
          shadow-radius={6}
        />
        <directionalLight position={[-6, 4, -3]} intensity={0.45} color="#fff3e0" />
        {floor ? (
          <mesh rotation-x={-Math.PI / 2} position-y={-0.001} receiveShadow>
            <circleGeometry args={[14, 64]} />
            <shadowMaterial opacity={0.16} />
          </mesh>
        ) : null}
        {children}
      </ThreeCanvas>
      {placed.map((l, i) => (
        <div
          key={i}
          style={{ position: "absolute", left: l.x, top: l.y, transform: "translate(-50%, -50%)", pointerEvents: "none" }}
        >
          <LabelBox {...l.props} />
        </div>
      ))}
    </div>
  );
};

type Vec3 = [number, number, number];
type PlacedLabel = { props: LabelProps; world: Vec3 };

const toVec = (v: unknown, fallback: Vec3): Vec3 => {
  if (v === undefined || v === null) return fallback;
  if (typeof v === "number") return [v, v, v];
  if (Array.isArray(v)) return [v[0], v[1], v[2]];
  if (v instanceof THREE.Vector3) return [v.x, v.y, v.z];
  return fallback;
};

/** Walk the scene's JSX, accumulating group position/scale, and record every <Label>'s world position. */
function collectLabels(node: React.ReactNode, offset: Vec3, scale: Vec3, out: PlacedLabel[]) {
  if (Array.isArray(node)) {
    node.forEach((n) => collectLabels(n, offset, scale, out));
    return;
  }
  if (!React.isValidElement(node)) return;
  const props = node.props as Record<string, unknown> & { children?: React.ReactNode };
  if (node.type === Label) {
    const p = toVec(props.position, [0, 0, 0]);
    out.push({
      props: props as unknown as LabelProps,
      world: [offset[0] + p[0] * scale[0], offset[1] + p[1] * scale[1], offset[2] + p[2] * scale[2]],
    });
    return;
  }
  const p = toVec(props.position, [0, 0, 0]);
  const sc = toVec(props.scale, [1, 1, 1]);
  const nextOffset: Vec3 = [offset[0] + p[0] * scale[0], offset[1] + p[1] * scale[1], offset[2] + p[2] * scale[2]];
  const nextScale: Vec3 = [scale[0] * sc[0], scale[1] * sc[1], scale[2] * sc[2]];
  if (props.visible === false) return;
  collectLabels(props.children, nextOffset, nextScale, out);
}

/** Matte "clay" material used everywhere for a consistent look. */
export const Clay: React.FC<{ color?: string; opacity?: number; emissive?: string; emissiveIntensity?: number }> = ({
  color = C.clay,
  opacity = 1,
  emissive = "#000000",
  emissiveIntensity = 0,
}) => (
  <meshStandardMaterial
    color={color}
    roughness={0.78}
    metalness={0}
    transparent={opacity < 1}
    opacity={opacity}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
  />
);

export const RoundedBox: React.FC<{
  size: [number, number, number];
  radius?: number;
  color?: string;
  opacity?: number;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  emissive?: string;
  emissiveIntensity?: number;
}> = ({ size, radius = 0.06, color, opacity, position, scale, rotation, emissive, emissiveIntensity }) => {
  const geo = useMemo(() => roundedBoxGeometry(size[0], size[1], size[2], radius), [size, radius]);
  return (
    <mesh geometry={geo} position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <Clay color={color} opacity={opacity} emissive={emissive} emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
};

function roundedBoxGeometry(w0: number, h: number, d0: number, r: number) {
  // ExtrudeGeometry's bevel grows the outline outward, so shrink the base shape to keep outer size exact.
  const bevel = Math.min(r * 0.6, h / 4, w0 / 6, d0 / 6);
  const bs = bevel * 0.6;
  const w = w0 - 2 * bs;
  const d = d0 - 2 * bs;
  const rr = Math.max(0.0005, Math.min(r - bs, w / 2 - 0.0005, d / 2 - 0.0005));
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + rr, -d / 2);
  shape.lineTo(w / 2 - rr, -d / 2);
  shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + rr);
  shape.lineTo(w / 2, d / 2 - rr);
  shape.quadraticCurveTo(w / 2, d / 2, w / 2 - rr, d / 2);
  shape.lineTo(-w / 2 + rr, d / 2);
  shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - rr);
  shape.lineTo(-w / 2, -d / 2 + rr);
  shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + rr, -d / 2);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(h - bevel * 2, 0.0005),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bs,
    bevelSegments: 3,
    curveSegments: 6,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -h / 2 + bevel, 0);
  g.computeVertexNormals();
  return g;
}

type LabelProps = {
  position: [number, number, number];
  children: React.ReactNode;
  opacity?: number;
  tone?: "light" | "dark" | "accent";
  accent?: string;
  size?: number;
  dashed?: boolean;
  width?: number;
};

/**
 * Screen-space label pinned to a 3D point. Declared inside <Stage>; Stage projects it with the
 * scene camera and draws it as DOM above the canvas (deterministic per frame, no async layout).
 */
export const Label: React.FC<LabelProps> = () => null;

const LabelBox: React.FC<LabelProps> = ({ children, opacity = 1, tone = "light", accent = C.ink, size = 30, dashed, width }) => {
  if (opacity <= 0.001) return null;
  const bg = tone === "dark" ? C.ink : tone === "accent" ? accent : "rgba(255,255,255,0.94)";
  const fg = tone === "light" ? C.ink : C.white;
  return (
    <div
      style={{
        opacity: Math.min(1, opacity),
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.15,
        color: fg,
        background: bg,
        padding: `${size * 0.32}px ${size * 0.55}px`,
        borderRadius: size * 0.45,
        whiteSpace: width ? "normal" : "nowrap",
        width,
        textAlign: "center",
        border: dashed ? `3px dashed ${accent}` : tone === "light" ? `3px solid ${accent}22` : "none",
        boxShadow: "0 6px 18px rgba(31,35,40,0.12)",
        transform: `scale(${0.85 + 0.15 * Math.min(1, opacity)})`,
      }}
    >
      {children}
    </div>
  );
};

/** A tube that grows along a curve from 0 → progress. Dashed tubes mark hypothetical paths. */
export const GrowPath: React.FC<{
  points: [number, number, number][];
  progress: number;
  color: string;
  radius?: number;
  dashed?: boolean;
  opacity?: number;
}> = ({ points, progress, color, radius = 0.05, dashed = false, opacity = 1 }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  const p = clamp01(progress);
  const pieces = useMemo(() => {
    if (p <= 0.001) return [];
    const ranges: [number, number][] = [];
    if (dashed) {
      const dash = 0.045;
      for (let u = 0; u < p; u += dash * 2) ranges.push([u, Math.min(u + dash, p)]);
    } else {
      ranges.push([0, p]);
    }
    return ranges.map(([a, b]) => subTube(curve, a, b, radius));
  }, [curve, p, dashed, radius]);
  return (
    <>
      {pieces.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <Clay color={color} opacity={opacity} />
        </mesh>
      ))}
    </>
  );
};

function subTube(curve: THREE.Curve<THREE.Vector3>, a: number, b: number, r: number) {
  const n = Math.max(2, Math.ceil((b - a) * 120));
  const pts = Array.from({ length: n + 1 }, (_, i) => curve.getPointAt(a + ((b - a) * i) / n));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, r, 10, false);
}

/** Small cone arrowhead placed at the tip of a path. */
export const PathTip: React.FC<{ points: [number, number, number][]; progress: number; color: string; size?: number }> = ({
  points,
  progress,
  color,
  size = 0.14,
}) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  const p = clamp01(progress);
  if (p < 0.02) return null;
  const pos = curve.getPointAt(p);
  const tan = curve.getTangentAt(p);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan.normalize());
  return (
    <mesh position={pos} quaternion={q} castShadow>
      <coneGeometry args={[size, size * 2, 16]} />
      <Clay color={color} />
    </mesh>
  );
};
