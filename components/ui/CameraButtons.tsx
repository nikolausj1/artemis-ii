"use client";

import { useMissionStore } from "@/lib/store";
import { CameraPresetId } from "@/lib/mission-data";

const VIEWS: { id: CameraPresetId; label: string; icon: string }[] = [
  { id: "wide_shot", label: "Overview", icon: "◎" },
  { id: "earth_closeup", label: "Earth", icon: "⊕" },
  { id: "departure", label: "Departure", icon: "↗" },
  { id: "deep_space", label: "Deep Space", icon: "◇" },
  { id: "lunar_approach", label: "Approach", icon: "◐" },
  { id: "lunar_flyby", label: "Flyby", icon: "☾" },
  { id: "return_overview", label: "Return", icon: "↙" },
];

export default function CameraButtons() {
  const activePreset = useMissionStore((s) => s.activeCameraPreset);
  const setCameraPreset = useMissionStore((s) => s.setCameraPreset);

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto">
      <div className="flex flex-col gap-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-2">
        <div className="text-[8px] font-mono text-white/25 uppercase tracking-widest text-center mb-1 px-1">
          Views
        </div>
        {VIEWS.map((view) => {
          const isActive = activePreset === view.id;
          return (
            <button
              key={view.id}
              onClick={() => setCameraPreset(view.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-all ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/20"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className="text-xs w-4 text-center">{view.icon}</span>
              <span className="text-[10px] font-mono tracking-wide">{view.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
