"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Timeline from "@/components/ui/Timeline";
import PhaseCard from "@/components/ui/PhaseCard";
import CrewPanel from "@/components/ui/CrewPanel";
import HUD from "@/components/ui/HUD";
import LiveTracker from "@/components/ui/LiveTracker";
import LoadingScreen from "@/components/ui/LoadingScreen";

const Scene = dynamic(() => import("@/components/scene/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <Scene />
      </Suspense>

      {/* UI overlay layer - pointer-events-none so clicks pass to 3D scene */}
      <div className="absolute inset-0 pointer-events-none">
        <PhaseCard />
        <HUD />
        <LiveTracker />
        <CrewPanel />
        <Timeline />
      </div>
    </main>
  );
}
