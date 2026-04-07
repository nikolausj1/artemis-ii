"use client";

import { useCallback } from "react";
import { useMissionStore } from "@/lib/store";
import { MISSION_PHASES } from "@/lib/mission-data";
import { TOTAL_MISSION_DURATION_HOURS, PLAYBACK_SPEEDS } from "@/lib/constants";

// Clean phase labels
const PHASE_LABELS: Record<string, string> = {
  launch: "Launch",
  tli: "TLI",
  outbound_coast_1: "Coast",
  outbound_coast_2: "Coast",
  lunar_influence: "Approach",
  lunar_flyby: "Flyby",
  return_coast_1: "Return",
  return_coast_2: "Return",
  return_coast_3: "Return",
  reentry: "Splashdown",
};

function formatMET(hours: number): string {
  const totalSeconds = Math.floor(hours * 3600);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(d).padStart(2, "0")}:${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Timeline() {
  const met = useMissionStore((s) => s.met);
  const isPlaying = useMissionStore((s) => s.isPlaying);
  const playbackSpeed = useMissionStore((s) => s.playbackSpeed);
  const activePhase = useMissionStore((s) => s.activePhase);
  const togglePlayback = useMissionStore((s) => s.togglePlayback);
  const setSpeed = useMissionStore((s) => s.setSpeed);
  const setMET = useMissionStore((s) => s.setMET);
  const setActivePhase = useMissionStore((s) => s.setActivePhase);

  const progress = (met / TOTAL_MISSION_DURATION_HOURS) * 100;

  const handleScrub = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      setMET(x * TOTAL_MISSION_DURATION_HOURS);
    },
    [setMET]
  );

  const handleScrubDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return;
      handleScrub(e);
    },
    [handleScrub]
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
      <div className="mx-4 mb-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 px-5 py-4">

        {/* Phase labels row */}
        <div className="flex mb-1.5">
          {MISSION_PHASES.map((phase) => {
            const width =
              ((phase.endMET - phase.startMET) / TOTAL_MISSION_DURATION_HOURS) * 100;
            const isActive = phase.id === activePhase.id;
            return (
              <div
                key={phase.id}
                className="text-center overflow-hidden"
                style={{ width: `${width}%` }}
              >
                {width > 6 && (
                  <span
                    className={`text-[9px] tracking-wide uppercase transition-colors ${
                      isActive ? "text-cyan-300" : "text-white/30"
                    }`}
                  >
                    {PHASE_LABELS[phase.id] || phase.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          className="relative h-2 rounded-full bg-white/5 cursor-pointer mb-1"
          onClick={handleScrub}
          onMouseMove={handleScrubDrag}
        >
          {/* Filled progress */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-none"
            style={{ width: `${progress}%` }}
          />

          {/* Phase boundary markers */}
          {MISSION_PHASES.slice(1).map((phase) => {
            const pos = (phase.startMET / TOTAL_MISSION_DURATION_HOURS) * 100;
            return (
              <div
                key={phase.id + "_mark"}
                className="absolute top-0 bottom-0 w-px bg-white/10"
                style={{ left: `${pos}%` }}
              />
            );
          })}

          {/* Playhead */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)] z-10 -ml-1.5"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Day markers */}
        <div className="flex mb-3">
          {MISSION_PHASES.map((phase) => {
            const width =
              ((phase.endMET - phase.startMET) / TOTAL_MISSION_DURATION_HOURS) * 100;
            const isActive = phase.id === activePhase.id;
            return (
              <button
                key={phase.id + "_day"}
                className={`text-center overflow-hidden transition-colors ${
                  isActive ? "text-white/60" : "text-white/15"
                }`}
                style={{ width: `${width}%` }}
                onClick={() => setActivePhase(phase)}
              >
                <span className="text-[8px] font-mono">
                  Apr {phase.day}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          {/* Play/Pause + Speed */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <div className="flex gap-0.5 bg-white/5 rounded-md p-0.5">
              {PLAYBACK_SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeed(speed)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                    playbackSpeed === speed
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* MET display */}
          <div className="font-mono text-white/70 tracking-wider">
            <span className="text-white/30 text-[10px] mr-2 uppercase tracking-widest">MET</span>
            <span className="text-sm">{formatMET(met)}</span>
          </div>

          {/* Active phase name */}
          <div className="text-xs text-white/40">
            Day {activePhase.day} &mdash; {activePhase.name}
          </div>
        </div>
      </div>
    </div>
  );
}
