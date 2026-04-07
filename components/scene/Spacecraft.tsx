"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { useMissionStore } from "@/lib/store";
import { getPositionAtMET } from "@/lib/trajectory";
import { TOTAL_MISSION_DURATION_HOURS } from "@/lib/constants";

export default function Spacecraft() {
  const groupRef = useRef<THREE.Group>(null);
  const orionRef = useRef<THREE.Group>(null);
  const prevPos = useRef(new THREE.Vector3());

  // Load NASA Orion capsule GLB
  const { scene: capsuleModel } = useGLTF("/models/orion-capsule.glb");

  useFrame(() => {
    const met = useMissionStore.getState().met;
    if (!groupRef.current || !orionRef.current) return;

    const pos = getPositionAtMET(met, TOTAL_MISSION_DURATION_HOURS);
    groupRef.current.position.copy(pos);

    // Orient along direction of travel
    const dir = pos.clone().sub(prevPos.current);
    if (dir.lengthSq() > 0.000001) {
      dir.normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const mat = new THREE.Matrix4().lookAt(
        new THREE.Vector3(0, 0, 0),
        dir,
        up
      );
      orionRef.current.quaternion.setFromRotationMatrix(mat);
    }
    prevPos.current.copy(pos);
  });

  const S = 0.15;

  return (
    <group ref={groupRef}>
      <group ref={orionRef} scale={S}>
        {/* NASA Orion capsule (crew module) - GLB model */}
        <group position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]} scale={1.8}>
          <primitive
            object={capsuleModel.clone()}
            // Override material to white/silver capsule look
          />
        </group>

        {/* === Service Module (ESM) - primitives since NASA model is capsule only === */}
        <mesh position={[0, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 1.1, 16]} />
          <meshStandardMaterial color="#c4b078" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Adapter ring */}
        <mesh position={[0, 0, 0.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.39, 0.37, 0.12, 16]} />
          <meshStandardMaterial color="#999999" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* === Solar Arrays === */}
        <group position={[-1.8, 0, -0.55]}>
          <mesh>
            <boxGeometry args={[2.6, 0.02, 0.65]} />
            <meshStandardMaterial color="#1a2744" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        <mesh position={[-0.5, 0, -0.55]}>
          <boxGeometry args={[0.65, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
        </mesh>

        <group position={[1.8, 0, -0.55]}>
          <mesh>
            <boxGeometry args={[2.6, 0.02, 0.65]} />
            <meshStandardMaterial color="#1a2744" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        <mesh position={[0.5, 0, -0.55]}>
          <boxGeometry args={[0.65, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Engine nozzle */}
        <mesh position={[0, 0, -1.15]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 0.2, 8]} />
          <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Subtle fill light */}
      <pointLight color="#ffffff" intensity={0.5} distance={2} decay={2} />

      {/* ORION label */}
      <Text
        position={[0, S * 1.2, 0]}
        fontSize={0.08}
        color="#88ccee"
        anchorX="center"
        anchorY="bottom"
        fillOpacity={0.35}
      >
        ORION
      </Text>
    </group>
  );
}
