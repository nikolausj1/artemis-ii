"use client";

// Day/night custom shader removed - was causing flashing with EffectComposer.
// Using MeshStandardMaterial with day texture + emissive night texture fallback.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH_RADIUS, TEXTURE_PATHS } from "@/lib/constants";
import {
  generateEarthDayTexture,
  generateCloudTexture,
} from "@/lib/procedural-textures";

export default function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const dayTex = useMemo(() => {
    const tex = new THREE.CanvasTexture(generateEarthDayTexture());
    tex.colorSpace = THREE.SRGBColorSpace;
    const loader = new THREE.TextureLoader();
    loader.load(TEXTURE_PATHS.earthDay, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.map = t;
        mat.needsUpdate = true;
      }
    });
    return tex;
  }, []);

  const cloudTex = useMemo(() => {
    const tex = new THREE.CanvasTexture(generateCloudTexture());
    const loader = new THREE.TextureLoader();
    loader.load(TEXTURE_PATHS.earthClouds, (t) => {
      if (cloudRef.current) {
        const mat = cloudRef.current.material as THREE.MeshStandardMaterial;
        mat.map = t;
        mat.needsUpdate = true;
      }
    });
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.01;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.011;
  });

  return (
    <group rotation={[0, 0, (23.5 * Math.PI) / 180]}>
      {/* Earth with standard material */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial map={dayTex} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[EARTH_RADIUS * 1.01, 64, 64]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
