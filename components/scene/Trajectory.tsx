"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TRAJECTORY_CURVE } from "@/lib/trajectory";
import { MISSION_PHASES } from "@/lib/mission-data";
import { TOTAL_MISSION_DURATION_HOURS } from "@/lib/constants";
import { useMissionStore } from "@/lib/store";

export default function Trajectory() {
  const tubeRef = useRef<THREE.Mesh>(null);
  const futureRef = useRef<THREE.Mesh>(null);

  const { fullPoints, phaseColors } = useMemo(() => {
    const fullPoints = TRAJECTORY_CURVE.getPoints(500);
    const phaseColors: string[] = [];
    for (let i = 0; i <= 500; i++) {
      const t = i / 500;
      const phase = MISSION_PHASES.find(
        (p) => t >= p.curveStart && t < p.curveEnd
      ) ?? MISSION_PHASES[MISSION_PHASES.length - 1];
      phaseColors.push(phase.color);
    }
    return { fullPoints, phaseColors };
  }, []);

  // Use a tube geometry for the full path, two passes for completed/future
  const fullCurve = useMemo(
    () => new THREE.CatmullRomCurve3(fullPoints, false, "catmullrom", 0.5),
    [fullPoints]
  );

  useFrame(() => {
    const met = useMissionStore.getState().met;
    const progress = met / TOTAL_MISSION_DURATION_HOURS;

    // Update material opacity for the completed tube (visible) and future (faded)
    if (tubeRef.current) {
      const mat = tubeRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.8;
    }
    if (futureRef.current) {
      const mat = futureRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12;
      // Clip the rendered portion by adjusting draw range
      const geo = futureRef.current.geometry;
      const totalVertices = geo.attributes.position.count;
      const startVertex = Math.floor(progress * totalVertices);
      geo.setDrawRange(startVertex, totalVertices - startVertex);
    }
    if (tubeRef.current) {
      const geo = tubeRef.current.geometry;
      const totalVertices = geo.attributes.position.count;
      const endVertex = Math.floor(progress * totalVertices);
      geo.setDrawRange(0, endVertex);
    }
  });

  // Get current phase color for the main tube
  const met = useMissionStore((s) => s.met);
  const currentPhase = useMissionStore((s) => s.activePhase);

  return (
    <group>
      {/* Completed trajectory - bright, triggers bloom */}
      <mesh ref={tubeRef}>
        <tubeGeometry args={[fullCurve, 500, 0.03, 8, false]} />
        <meshBasicMaterial
          color={currentPhase.color}
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
