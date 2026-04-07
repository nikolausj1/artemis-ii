"use client";

import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { MOON_RADIUS, EARTH_MOON_DISTANCE, TEXTURE_PATHS } from "@/lib/constants";

export default function Moon() {
  const meshRef = useRef<THREE.Mesh>(null);

  const [colorMap] = useTexture([TEXTURE_PATHS.moonColor]);

  return (
    <mesh ref={meshRef} position={[EARTH_MOON_DISTANCE, 0, 0]}>
      <sphereGeometry args={[MOON_RADIUS, 48, 48]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
}
