"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Earth from "./Earth";
import Moon from "./Moon";
import Starfield from "./Starfield";
import Lighting from "./Lighting";
import Trajectory from "./Trajectory";
import Spacecraft from "./Spacecraft";
import Atmosphere from "./Atmosphere";
import CameraController from "./CameraController";
import PlaybackTick from "./PlaybackTick";

export default function Scene() {
  // Ensure client-only rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [20, 25, 45], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          antialias: true,
        }}
        style={{ background: "#000008" }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <Earth />
          <Atmosphere />
          <Moon />
          <Trajectory />
          <Spacecraft />
          <Starfield />
          <CameraController />
          <PlaybackTick />
          <EffectComposer multisampling={0}>
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
