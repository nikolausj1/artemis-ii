"use client";

import { useEffect, useState } from "react";
import { useMissionStore } from "@/lib/store";
import { MISSION_LAUNCH_TIME, MISSION_SPLASHDOWN_TIME } from "@/lib/constants";

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export default function LiveTracker() {
  const missionStatus = useMissionStore((s) => s.missionStatus);
  const currentActivity = useMissionStore((s) => s.currentActivity);
  const nextActivity = useMissionStore((s) => s.nextActivity);
  const updateLiveStatus = useMissionStore((s) => s.updateLiveStatus);
  const syncToRealTime = useMissionStore((s) => s.syncToRealTime);

  const [collapsed, setCollapsed] = useState(false);
  const [, setTick] = useState(0);

  // Update live status every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateLiveStatus();
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [updateLiveStatus]);

  // Auto-sync to real time on first load during mission
  useEffect(() => {
    if (missionStatus === "live") {
      syncToRealTime();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const now = new Date();

  if (collapsed) {
    return (
      <div className="absolute top-4 right-64 pointer-events-auto">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2"
        >
          {missionStatus === "live" && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span className="text-xs text-white/70">
            {missionStatus === "live" ? "LIVE" : missionStatus === "pre-launch" ? "PRE-LAUNCH" : "COMPLETE"}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-64 pointer-events-auto w-72">
      <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {missionStatus === "live" && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              {missionStatus === "pre-launch" && "Pre-Launch"}
              {missionStatus === "live" && "Live Mission"}
              {missionStatus === "post-mission" && "Mission Complete"}
            </span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/30 hover:text-white/60 text-xs"
          >
            ✕
          </button>
        </div>

        {/* Pre-launch countdown */}
        {missionStatus === "pre-launch" && (
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              Countdown to Launch
            </p>
            <p className="font-mono text-lg text-cyan-400">
              T-{formatCountdown(MISSION_LAUNCH_TIME.getTime() - now.getTime())}
            </p>
            <p className="text-xs text-white/50 mt-2">
              Crew is preparing for launch from Kennedy Space Center LC-39B.
            </p>
          </div>
        )}

        {/* Live mission */}
        {missionStatus === "live" && (
          <div className="space-y-3">
            {currentActivity && (
              <div>
                <p className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold mb-1">
                  Happening Now
                </p>
                <p className="text-xs font-semibold text-white">
                  {currentActivity.icon} {currentActivity.title}
                </p>
                <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                  {currentActivity.description}
                </p>
                <p className="text-[10px] text-white/30 mt-1">
                  Crew: {currentActivity.crewInvolved.join(", ")}
                </p>
              </div>
            )}

            {!currentActivity && (
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  Between Activities
                </p>
                <p className="text-xs text-white/50">
                  The crew is currently between scheduled activities.
                </p>
              </div>
            )}

            {nextActivity && (
              <div className="border-t border-white/10 pt-2">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  Up Next
                </p>
                <p className="text-xs text-white/70">
                  {nextActivity.icon} {nextActivity.title}
                </p>
                <p className="text-[10px] text-white/40 font-mono">
                  in {formatCountdown(new Date(nextActivity.startTime).getTime() - now.getTime())}
                </p>
              </div>
            )}

            <button
              onClick={syncToRealTime}
              className="text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors"
            >
              Sync to real time →
            </button>
          </div>
        )}

        {/* Post-mission */}
        {missionStatus === "post-mission" && (
          <div>
            <p className="text-xs text-white/70 leading-relaxed">
              The Artemis II crew splashed down safely in the Pacific Ocean on April 10, 2026.
            </p>
            <p className="text-[10px] text-white/40 mt-2">
              Total mission duration:{" "}
              {formatCountdown(
                MISSION_SPLASHDOWN_TIME.getTime() - MISSION_LAUNCH_TIME.getTime()
              )}
            </p>
            <p className="text-[10px] text-white/30 mt-1">
              Use the timeline below to replay the mission.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
