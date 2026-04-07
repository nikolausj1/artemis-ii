"use client";

import { EARTH_RADIUS } from "@/lib/constants";
import { Sphere } from "@react-three/drei";

export default function Atmosphere() {
  return (
    <Sphere args={[EARTH_RADIUS * 1.08, 64, 64]}>
      <meshBasicMaterial
        color="#4488ff"
        transparent
        opacity={0.08}
        depthWrite={false}
        side={2} // DoubleSide
      />
    </Sphere>
  );
}
