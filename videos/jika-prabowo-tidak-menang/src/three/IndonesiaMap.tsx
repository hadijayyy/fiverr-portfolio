import React, { useMemo } from "react";
import * as THREE from "three";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { Clay } from "./common";

// Natural Earth 1:50m outline of Indonesia (ISO numeric 360), extruded into a diorama.
const SCALE = 0.1;
const LON0 = 118;
const LAT0 = -2.5;
export const project = (lon: number, lat: number): [number, number] => [(lon - LON0) * SCALE, -(lat - LAT0) * SCALE];

const shapes = (() => {
  const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
  const fc = feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection;
  const idn = fc.features.find((f) => String(f.id) === "360");
  if (!idn || idn.geometry.type !== "MultiPolygon") throw new Error("Indonesia not found in world-atlas");
  const out: THREE.Shape[] = [];
  for (const poly of idn.geometry.coordinates) {
    const ring = poly[0];
    const pts = ring.map(([lon, lat]) => {
      const [x, z] = project(lon, lat);
      return new THREE.Vector2(x, -z);
    });
    const area = Math.abs(THREE.ShapeUtils.area(pts));
    if (area < 0.0004) continue; // drop specks
    out.push(new THREE.Shape(pts));
  }
  return out;
})();

export const IndonesiaMap: React.FC<{ rise?: number; color?: string; position?: [number, number, number] }> = ({
  rise = 1,
  color = "#BCD0BE",
  position = [0, 0, 0],
}) => {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.01,
      bevelSegments: 2,
    });
    g.rotateX(-Math.PI / 2);
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group position={position}>
      <mesh geometry={geo} scale={[1, Math.max(rise, 0.001), 1]} castShadow receiveShadow>
        <Clay color={color} />
      </mesh>
    </group>
  );
};
