"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMissionStore } from "@/lib/store";
import { getPositionAtMET } from "@/lib/trajectory";
import { TOTAL_MISSION_DURATION_HOURS } from "@/lib/constants";

export default function Spacecraft() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const met = useMissionStore.getState().met;
    if (!groupRef.current) return;

    const pos = getPositionAtMET(met, TOTAL_MISSION_DURATION_HOURS);
    groupRef.current.position.copy(pos);
  });

  return (
    <group ref={groupRef}>
      {/* Glowing marker */}
      <mesh>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshBasicMaterial
          color="#88eeff"
          toneMapped={false}
        />
      </mesh>

      {/* Emissive inner glow */}
      <mesh>
        <icosahedronGeometry args={[0.15, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
        />
      </mesh>

      {/* Point light for local illumination */}
      <pointLight
        color="#aaeeff"
        intensity={2}
        distance={5}
        decay={2}
      />
    </group>
  );
}
