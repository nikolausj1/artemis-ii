"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Timeline from "@/components/ui/Timeline";
import PhaseCard from "@/components/ui/PhaseCard";
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

      {/* UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left: Phase card */}
        <div className="hidden sm:block">
          <PhaseCard />
        </div>

        {/* Top-right: HUD + LiveTracker stacked */}
        <div className="absolute top-4 right-4 pointer-events-none flex flex-col gap-3 items-end">
          <div className="pointer-events-auto">
            <HUD />
          </div>
          <div className="pointer-events-auto">
            <LiveTracker />
          </div>
        </div>

        {/* Bottom: Timeline */}
        <Timeline />
      </div>
    </main>
  );
}
