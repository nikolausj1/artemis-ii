"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
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
      {/* Outer glow marker */}
      <mesh>
        <icosahedronGeometry args={[0.12, 1]} />
        <meshBasicMaterial color="#88eeff" toneMapped={false} />
      </mesh>

      {/* Bright inner core */}
      <mesh>
        <icosahedronGeometry args={[0.06, 1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Point light */}
      <pointLight color="#aaeeff" intensity={1.5} distance={3} decay={2} />

      {/* ORION label */}
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.12}
        color="#88eeff"
        anchorX="center"
        anchorY="bottom"
        fillOpacity={0.5}
      >
        ORION
      </Text>
    </group>
  );
}
