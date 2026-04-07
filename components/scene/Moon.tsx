"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MOON_RADIUS, EARTH_MOON_DISTANCE, TEXTURE_PATHS } from "@/lib/constants";
import {
  generateMoonColorTexture,
  generateMoonDisplacementTexture,
} from "@/lib/procedural-textures";

export default function Moon() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { colorMap, displacementMap } = useMemo(() => {
    // Start with procedural textures
    const colorCanvas = generateMoonColorTexture();
    const colorMap = new THREE.CanvasTexture(colorCanvas);
    colorMap.colorSpace = THREE.SRGBColorSpace;

    const dispCanvas = generateMoonDisplacementTexture();
    const displacementMap = new THREE.CanvasTexture(dispCanvas);

    // Try loading real textures
    const loader = new THREE.TextureLoader();
    loader.load(TEXTURE_PATHS.moonColor, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.map = t;
        mat.needsUpdate = true;
      }
    });

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
