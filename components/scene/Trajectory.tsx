"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TRAJECTORY_CURVE } from "@/lib/trajectory";
import { MISSION_PHASES } from "@/lib/mission-data";
import { TOTAL_MISSION_DURATION_HOURS } from "@/lib/constants";
import { useMissionStore } from "@/lib/store";

export default function Trajectory() {
  const completedRef = useRef<THREE.Mesh>(null);
  const futureRef = useRef<THREE.Mesh>(null);

  // Build the curve once
  const fullCurve = useMemo(() => {
    const points = TRAJECTORY_CURVE.getPoints(500);
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  // Update draw ranges each frame (no geometry recreation)
  useFrame(() => {
    const met = useMissionStore.getState().met;
    const progress = met / TOTAL_MISSION_DURATION_HOURS;

    if (completedRef.current) {
      const geo = completedRef.current.geometry;
      const total = geo.index ? geo.index.count : geo.attributes.position.count;
      geo.setDrawRange(0, Math.floor(progress * total));
    }
    if (futureRef.current) {
      const geo = futureRef.current.geometry;
      const total = geo.index ? geo.index.count : geo.attributes.position.count;
      const start = Math.floor(progress * total);
      geo.setDrawRange(start, total - start);
    }
  });

  // Get the current phase color reactively for material
  const phaseColor = useMissionStore((s) => s.activePhase.color);

  return (
    <group>
      {/* Completed trajectory - bright, triggers bloom */}
      <mesh ref={completedRef}>
        <tubeGeometry args={[fullCurve, 500, 0.03, 8, false]} />
        <meshBasicMaterial
          color={phaseColor}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Future trajectory - faded */}
      <mesh ref={futureRef}>
        <tubeGeometry args={[fullCurve, 500, 0.025, 8, false]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}
