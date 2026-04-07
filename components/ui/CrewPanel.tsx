"use client";

import { useMissionStore } from "@/lib/store";
import { CREW } from "@/lib/mission-data";

export default function CrewPanel() {
  const isOpen = useMissionStore((s) => s.crewPanelOpen);
  const toggle = useMissionStore((s) => s.toggleCrewPanel);

  return (
    <div className="absolute bottom-24 left-4 pointer-events-auto max-w-xs">
      <button
        onClick={toggle}
        className="flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white transition-colors mb-2"
      >
        <span>{isOpen ? "▾" : "▸"}</span>
        <span>Crew ({CREW.length})</span>
        <div className="flex -space-x-1 ml-1">
          {CREW.map((c) => (
            <div
              key={c.initials}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-black/50"
              style={{ backgroundColor: c.color }}
            >
              {c.initials}
            </div>
          ))}
        </div>
      </button>

      {isOpen && (
        <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-3 space-y-3">
          {CREW.map((member) => (
            <div key={member.name} className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">
                    {member.name}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {member.country === "CA" ? "🇨🇦" : "🇺🇸"}
                  </span>
                </div>
                <p className="text-[10px] text-white/50 mb-0.5">
                  {member.role} &middot; {member.agency}
                </p>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
