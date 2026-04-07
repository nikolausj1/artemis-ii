"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Earth from "./Earth";
import Moon from "./Moon";
import Starfield from "./Starfield";
import Lighting from "./Lighting";
import Trajectory from "./Trajectory";
import Spacecraft from "./Spacecraft";
import PlaybackTick from "./PlaybackTick";

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#88eeff" wireframe />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [20, 25, 45], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: "#000008" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Lighting />
          <Earth />
          <Moon />
          <Trajectory />
          <Spacecraft />
          <Starfield />
          <PlaybackTick />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={200}
          />
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette offset={0.3} darkness={0.7} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
