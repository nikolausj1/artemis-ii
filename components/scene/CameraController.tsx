"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMissionStore } from "@/lib/store";
import { CAMERA_PRESETS } from "@/lib/constants";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

export default function CameraController() {
  const controlsRef = useRef<OrbitControlsType>(null);
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const transitioning = useRef(false);
  const transitionProgress = useRef(1);
  const startPos = useRef(new THREE.Vector3());
  const startLookAt = useRef(new THREE.Vector3());
  const lastPresetId = useRef("");
  const idleTimer = useRef(0);

  const activeCameraPreset = useMissionStore((s) => s.activeCameraPreset);
  const setIsTransitioning = useMissionStore((s) => s.setIsTransitioning);

  // Detect preset changes and start transition
  useEffect(() => {
    if (activeCameraPreset === lastPresetId.current) return;
    lastPresetId.current = activeCameraPreset;

    const preset = CAMERA_PRESETS[activeCameraPreset];
    if (!preset) return;

    startPos.current.copy(camera.position);
    if (controlsRef.current) {
      startLookAt.current.copy(controlsRef.current.target);
    }
    targetPos.current.set(...preset.position);
    targetLookAt.current.set(...preset.target);

    transitioning.current = true;
    transitionProgress.current = 0;
    setIsTransitioning(true);
  }, [activeCameraPreset, camera, setIsTransitioning]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (transitioning.current) {
      transitionProgress.current += delta * 0.5; // ~2 second transition
      const t = Math.min(1, transitionProgress.current);
      // Smooth easing
      const ease = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerpVectors(startPos.current, targetPos.current, ease);
      controlsRef.current.target.lerpVectors(
        startLookAt.current,
        targetLookAt.current,
        ease
      );

      if (t >= 1) {
        transitioning.current = false;
        setIsTransitioning(false);
      }

      controlsRef.current.update();
      idleTimer.current = 0;
    } else {
      // Auto-rotate when idle
      idleTimer.current += delta;
      if (idleTimer.current > 5) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 0.3;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={200}
      autoRotate={false}
      onStart={() => {
        // User interaction - stop auto-rotate
        if (controlsRef.current) {
          controlsRef.current.autoRotate = false;
        }
        idleTimer.current = 0;
      }}
    />
  );
}
