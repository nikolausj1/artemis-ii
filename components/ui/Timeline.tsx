"use client";

import { useCallback } from "react";
import { useMissionStore } from "@/lib/store";
import { MISSION_PHASES } from "@/lib/mission-data";
import { TOTAL_MISSION_DURATION_HOURS, PLAYBACK_SPEEDS } from "@/lib/constants";

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
      <div className="mx-4 mb-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 px-4 py-3">
        {/* Phase segments bar */}
        <div
          className="relative h-8 rounded-md overflow-hidden cursor-pointer mb-3"
          onClick={handleScrub}
          onMouseMove={handleScrubDrag}
        >
          {/* Phase color segments */}
          <div className="absolute inset-0 flex">
            {MISSION_PHASES.map((phase) => {
              const width =
                ((phase.endMET - phase.startMET) / TOTAL_MISSION_DURATION_HOURS) * 100;
              return (
                <button
                  key={phase.id}
                  className="h-full relative group transition-opacity hover:opacity-100"
                  style={{
                    width: `${width}%`,
                    backgroundColor: phase.color,
                    opacity: phase.id === activePhase.id ? 1 : 0.4,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhase(phase);
                  }}
                  title={phase.name}
                >
                  {width > 8 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-white/90 truncate px-1">
                      D{phase.day}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] z-10"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between gap-4">
          {/* Play/Pause + Speed */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <div className="flex gap-1">
              {PLAYBACK_SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeed(speed)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                    playbackSpeed === speed
                      ? "bg-white/20 text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* MET display */}
          <div className="font-mono text-sm text-white/80 tracking-wider">
            <span className="text-white/40 text-xs mr-2">MET</span>
            {formatMET(met)}
          </div>

          {/* Current phase label */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activePhase.color }}
            />
            <span className="text-xs text-white/70 max-w-[180px] truncate">
              {activePhase.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
