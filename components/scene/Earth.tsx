"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { EARTH_RADIUS, TEXTURE_PATHS } from "@/lib/constants";

export default function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  // drei's useTexture handles loading via Suspense - no manual loading needed
  const [dayMap, cloudMap] = useTexture([
    TEXTURE_PATHS.earthDay,
    TEXTURE_PATHS.earthClouds,
  ]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.01;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.011;
  });

  return (
    <group rotation={[0, 0, (23.5 * Math.PI) / 180]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial map={dayMap} />
      </mesh>

      <mesh ref={cloudRef}>
        <sphereGeometry args={[EARTH_RADIUS * 1.01, 64, 64]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
