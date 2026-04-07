"use client";

import { useMissionStore } from "@/lib/store";
import { TOTAL_MISSION_DURATION_HOURS } from "@/lib/constants";

function formatMET(hours: number): string {
  const totalSeconds = Math.floor(hours * 3600);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `T+${String(d).padStart(2, "0")}:${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function HUD() {
  const met = useMissionStore((s) => s.met);
  const activePhase = useMissionStore((s) => s.activePhase);

  const progressPercent = ((met / TOTAL_MISSION_DURATION_HOURS) * 100).toFixed(1);

  return (
    <div>
      <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-5 w-64">
        {/* MET - large and prominent */}
        <div className="mb-4">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5">
            Mission Elapsed Time
          </p>
          <p className="font-mono text-2xl text-white tracking-wider leading-none">
            {formatMET(met)}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
              From Earth
            </p>
            <p className="font-mono text-[11px] text-white/70">
              {activePhase.stats.distanceFromEarth}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
              From Moon
            </p>
            <p className="font-mono text-[11px] text-white/70">
              {activePhase.stats.distanceFromMoon}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
              Velocity
            </p>
            <p className="font-mono text-[11px] text-white/70">
              {activePhase.stats.velocity}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
              Progress
            </p>
            <p className="font-mono text-[11px] text-white/70">{progressPercent}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
