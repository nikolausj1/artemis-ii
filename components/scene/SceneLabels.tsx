"use client";

import { Html } from "@react-three/drei";
import { EARTH_MOON_DISTANCE } from "@/lib/constants";

export default function SceneLabels() {
  return (
    <>
      {/* Earth label */}
      <Html position={[0, 3.2, 0]} center distanceFactor={20} style={{ pointerEvents: "none" }}>
        <div className="text-center">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400/50">
            Earth
          </div>
          <div className="text-[8px] font-mono text-white/20 mt-0.5">
            R = 6,371 km
          </div>
        </div>
      </Html>

      {/* Moon label */}
      <Html position={[EARTH_MOON_DISTANCE, 1.2, 0]} center distanceFactor={15} style={{ pointerEvents: "none" }}>
        <div className="text-center">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400/50">
            Moon
          </div>
          <div className="text-[8px] font-mono text-white/20 mt-0.5">
            R = 1,737 km
          </div>
        </div>
      </Html>
    </>
  );
}
