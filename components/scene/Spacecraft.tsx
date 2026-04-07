"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { useMissionStore } from "@/lib/store";
import { getPositionAtMET } from "@/lib/trajectory";
import { TOTAL_MISSION_DURATION_HOURS } from "@/lib/constants";

function formatMET(hours: number): string {
  const totalSeconds = Math.floor(hours * 3600);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(d).padStart(2, "0")}:${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function OrionHUD() {
  const met = useMissionStore((s) => s.met);
  const phase = useMissionStore((s) => s.activePhase);

  return (
    <Html distanceFactor={8} style={{ pointerEvents: "none" }} position={[0, 0.6, 0]} center>
      <div className="relative" style={{ width: 200 }}>
        {/* Callout line */}
        <div className="absolute left-1/2 bottom-0 w-px h-6 bg-cyan-400/30" />

        {/* Technical label card */}
        <div
          className="border border-cyan-400/20 rounded px-3 py-2 mb-6"
          style={{
            background: "rgba(0, 10, 20, 0.85)",
            backdropFilter: "blur(4px)",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-300 uppercase">
              Orion MPCV
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-cyan-400/15 mb-1.5" />

          {/* Data grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>
              <div className="text-[7px] text-cyan-400/40 uppercase tracking-wider">Phase</div>
              <div className="text-[9px] text-white/70 truncate">{phase.name}</div>
            </div>
            <div>
              <div className="text-[7px] text-cyan-400/40 uppercase tracking-wider">MET</div>
              <div className="text-[9px] text-white/70 tabular-nums">{formatMET(met)}</div>
            </div>
            <div>
              <div className="text-[7px] text-cyan-400/40 uppercase tracking-wider">Velocity</div>
              <div className="text-[9px] text-white/70">{phase.stats.velocity}</div>
            </div>
            <div>
              <div className="text-[7px] text-cyan-400/40 uppercase tracking-wider">Alt</div>
              <div className="text-[9px] text-white/70">{phase.stats.distanceFromEarth}</div>
            </div>
            <div>
              <div className="text-[7px] text-cyan-400/40 uppercase tracking-wider">Earth Dist</div>
              <div className="text-[9px] text-white/70">{phase.stats.distanceFromEarth}</div>
            </div>
            <div>
              <div className="text-[7px] text-cyan-400/40 uppercase tracking-wider">Moon Dist</div>
              <div className="text-[9px] text-white/70">{phase.stats.distanceFromMoon}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="h-px bg-cyan-400/15 mt-1.5 mb-1" />
          <div className="text-[7px] text-cyan-400/25 tracking-wider">
            DAY {phase.day} &middot; {phase.date}
          </div>
        </div>
      </div>
    </Html>
  );
}

export default function Spacecraft() {
  const groupRef = useRef<THREE.Group>(null);
  const orionRef = useRef<THREE.Group>(null);
  const prevPos = useRef(new THREE.Vector3());

  const { scene: capsuleModel } = useGLTF("/models/orion-capsule.glb");

  useFrame(() => {
    const met = useMissionStore.getState().met;
    if (!groupRef.current || !orionRef.current) return;

    const pos = getPositionAtMET(met, TOTAL_MISSION_DURATION_HOURS);
    groupRef.current.position.copy(pos);

    const dir = pos.clone().sub(prevPos.current);
    if (dir.lengthSq() > 0.000001) {
      dir.normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const mat = new THREE.Matrix4().lookAt(new THREE.Vector3(), dir, up);
      orionRef.current.quaternion.setFromRotationMatrix(mat);
    }
    prevPos.current.copy(pos);
  });

  const S = 0.15;

  return (
    <group ref={groupRef}>
      <group ref={orionRef} scale={S}>
        {/* NASA Orion capsule (crew module) */}
        <group position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]} scale={1.8}>
          <primitive object={capsuleModel.clone()} />
        </group>

        {/* Service Module (ESM) */}
        <mesh position={[0, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 1.1, 16]} />
          <meshStandardMaterial color="#c4b078" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Adapter ring */}
        <mesh position={[0, 0, 0.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.39, 0.37, 0.12, 16]} />
          <meshStandardMaterial color="#999999" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Solar Arrays */}
        <group position={[-1.8, 0, -0.55]}>
          <mesh>
            <boxGeometry args={[2.6, 0.02, 0.65]} />
            <meshStandardMaterial color="#1a2744" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        <mesh position={[-0.5, 0, -0.55]}>
          <boxGeometry args={[0.65, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
        </mesh>
        <group position={[1.8, 0, -0.55]}>
          <mesh>
            <boxGeometry args={[2.6, 0.02, 0.65]} />
            <meshStandardMaterial color="#1a2744" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        <mesh position={[0.5, 0, -0.55]}>
          <boxGeometry args={[0.65, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Engine nozzle */}
        <mesh position={[0, 0, -1.15]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 0.2, 8]} />
          <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Fill light */}
      <pointLight color="#ffffff" intensity={0.5} distance={2} decay={2} />

      {/* Technical HUD label */}
      <OrionHUD />
    </group>
  );
}
