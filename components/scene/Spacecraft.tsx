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
  const orionRef = useRef<THREE.Group>(null);
  const prevPos = useRef(new THREE.Vector3());

  useFrame(() => {
    const met = useMissionStore.getState().met;
    if (!groupRef.current || !orionRef.current) return;

    const pos = getPositionAtMET(met, TOTAL_MISSION_DURATION_HOURS);
    groupRef.current.position.copy(pos);

    // Orient Orion along its direction of travel
    if (prevPos.current.lengthSq() > 0) {
      const dir = pos.clone().sub(prevPos.current);
      if (dir.lengthSq() > 0.00001) {
        dir.normalize();
        // Point the spacecraft's local +Z along the travel direction
        const up = new THREE.Vector3(0, 1, 0);
        const matrix = new THREE.Matrix4().lookAt(
          new THREE.Vector3(0, 0, 0),
          dir,
          up
        );
        orionRef.current.quaternion.setFromRotationMatrix(matrix);
      }
    }
    prevPos.current.copy(pos);
  });

  return (
    <group ref={groupRef}>
      {/* Orion spacecraft model - simplified but recognizable */}
      <group ref={orionRef} scale={0.06}>
        {/* Crew Module - conical capsule (the iconic shape) */}
        <mesh position={[0, 0, 1.2]}>
          <coneGeometry args={[0.7, 1.4, 12]} />
          <meshStandardMaterial color="#c8c8c8" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Heat shield - dark disc at the base of the capsule */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 12]} />
          <meshStandardMaterial color="#333333" metalness={0.4} roughness={0.7} />
        </mesh>

        {/* Service Module (European Service Module) - gold-ish cylinder */}
        <group position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.65, 0.65, 2.0, 12]} />
            <meshStandardMaterial color="#d4c896" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>

        {/* Solar Array - Left wing */}
        <mesh position={[-3.0, 0, -0.8]} rotation={[0, 0, 0]}>
          <boxGeometry args={[4.5, 0.03, 1.2]} />
          <meshStandardMaterial
            color="#1a2744"
            metalness={0.7}
            roughness={0.2}
            emissive="#0a1530"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Solar Array - Right wing */}
        <mesh position={[3.0, 0, -0.8]} rotation={[0, 0, 0]}>
          <boxGeometry args={[4.5, 0.03, 1.2]} />
          <meshStandardMaterial
            color="#1a2744"
            metalness={0.7}
            roughness={0.2}
            emissive="#0a1530"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Solar array mounting struts */}
        <mesh position={[-0.8, 0, -0.8]}>
          <boxGeometry args={[1.0, 0.04, 0.04]} />
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.8, 0, -0.8]}>
          <boxGeometry args={[1.0, 0.04, 0.04]} />
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Engine nozzle */}
        <mesh position={[0, 0, -1.85]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.35, 0.3, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Subtle glow around spacecraft for visibility at distance */}
      <mesh>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#aaeeff" toneMapped={false} transparent opacity={0.7} />
      </mesh>

      {/* Point light so it's visible in shadow */}
      <pointLight color="#aaeeff" intensity={1} distance={3} decay={2} />

      {/* ORION label */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.1}
        color="#88eeff"
        anchorX="center"
        anchorY="bottom"
        fillOpacity={0.4}
      >
        ORION
      </Text>
    </group>
  );
}
