"use client";

import { useMissionStore } from "@/lib/store";

export default function PhaseCard() {
  const phase = useMissionStore((s) => s.activePhase);

  return (
    <div className="absolute top-4 left-4 pointer-events-auto max-w-xs">
      <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: phase.color }}
          />
          <h2 className="text-sm font-semibold text-white">{phase.name}</h2>
        </div>

        <p className="text-xs text-white/50 mb-3">
          Day {phase.day} &middot; {phase.date}
        </p>

        <p className="text-xs text-white/70 leading-relaxed mb-3">
          {phase.description}
        </p>

        <div className="grid grid-cols-1 gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">From Earth</span>
            <span className="text-white/70 font-mono">{phase.stats.distanceFromEarth}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">From Moon</span>
            <span className="text-white/70 font-mono">{phase.stats.distanceFromMoon}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Velocity</span>
            <span className="text-white/70 font-mono">{phase.stats.velocity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
