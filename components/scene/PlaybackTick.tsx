"use client";

import { useFrame } from "@react-three/fiber";
import { useMissionStore } from "@/lib/store";

export default function PlaybackTick() {
  useFrame((_, delta) => {
    useMissionStore.getState().tick(delta);
  });
  return null;
}
