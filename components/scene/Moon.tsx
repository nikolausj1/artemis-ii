"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MOON_RADIUS, EARTH_MOON_DISTANCE, TEXTURE_PATHS } from "@/lib/constants";
import {
  generateMoonColorTexture,
  generateMoonDisplacementTexture,
} from "@/lib/procedural-textures";

export default function Moon() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { colorMap, displacementMap } = useMemo(() => {
    const loader = new THREE.TextureLoader();

    const colorMap = loader.load(
      TEXTURE_PATHS.moonColor,
      undefined,
      undefined,
      () => {
        const canvas = generateMoonColorTexture();
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        if (meshRef.current) {
          (meshRef.current.material as THREE.MeshStandardMaterial).map = tex;
          (meshRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
      }
    );
    colorMap.colorSpace = THREE.SRGBColorSpace;

    const displacementMap = loader.load(
      TEXTURE_PATHS.moonDisplacement,
      undefined,
      undefined,
      () => {
        const canvas = generateMoonDisplacementTexture();
        const tex = new THREE.CanvasTexture(canvas);
        if (meshRef.current) {
          (meshRef.current.material as THREE.MeshStandardMaterial).displacementMap = tex;
          (meshRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
      }
    );

    return { colorMap, displacementMap };
  }, []);

  return (
    <mesh ref={meshRef} position={[EARTH_MOON_DISTANCE, 0, 0]}>
      <sphereGeometry args={[MOON_RADIUS, 48, 48]} />
      <meshStandardMaterial
        map={colorMap}
        displacementMap={displacementMap}
        displacementScale={MOON_RADIUS * 0.03}
        bumpMap={displacementMap}
        bumpScale={0.02}
      />
    </mesh>
  );
}
