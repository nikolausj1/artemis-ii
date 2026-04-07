"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail, Text } from "@react-three/drei";
import * as THREE from "three";
import { useMissionStore } from "@/lib/store";
import { getPositionAtMET } from "@/lib/trajectory";
import { TOTAL_MISSION_DURATION_HOURS } from "@/lib/constants";

export default function Spacecraft() {
  const groupRef = useRef<THREE.Group>(null);
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const met = useMissionStore.getState().met;
    if (!groupRef.current) return;

    const pos = getPositionAtMET(met, TOTAL_MISSION_DURATION_HOURS);
    groupRef.current.position.copy(pos);
  });

  const phaseColor = useMissionStore((s) => s.activePhase.color);

  return (
    <group ref={groupRef}>
      {/* Trail effect */}
      <Trail
        width={0.5}
        length={20}
        color={phaseColor}
        attenuation={(t) => t * t}
      >
        {/* Glowing marker */}
        <mesh ref={markerRef}>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshBasicMaterial color="#88eeff" toneMapped={false} />
        </mesh>
      </Trail>

      {/* Bright inner core */}
      <mesh>
        <icosahedronGeometry args={[0.15, 1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Point light for local illumination */}
      <pointLight color="#aaeeff" intensity={2} distance={5} decay={2} />

      {/* ORION label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.25}
        color="#88eeff"
        anchorX="center"
        anchorY="bottom"
        fillOpacity={0.6}
        font={undefined}
      >
        ORION
      </Text>
    </group>
  );
}
