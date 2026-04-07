"use client";

import dynamic from "next/dynamic";
import Timeline from "@/components/ui/Timeline";

const Scene = dynamic(() => import("@/components/scene/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Scene />
      <div className="absolute inset-0 pointer-events-none">
        <Timeline />
      </div>
    </main>
  );
}
