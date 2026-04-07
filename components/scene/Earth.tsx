"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH_RADIUS, TEXTURE_PATHS } from "@/lib/constants";
import { generateEarthDayTexture } from "@/lib/procedural-textures";

export default function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    // Try loading real texture, fall back to procedural
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      TEXTURE_PATHS.earthDay,
      undefined,
      undefined,
      () => {
        // On error, use procedural texture
        const canvas = generateEarthDayTexture();
        const proceduralTex = new THREE.CanvasTexture(canvas);
        proceduralTex.colorSpace = THREE.SRGBColorSpace;
        if (meshRef.current) {
          (meshRef.current.material as THREE.MeshStandardMaterial).map = proceduralTex;
          (meshRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
      }
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Axial tilt and slow rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01; // ~0.1 RPM
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, (23.5 * Math.PI) / 180]}>
      <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
