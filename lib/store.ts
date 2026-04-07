import { create } from "zustand";
import {
  MissionPhase,
  MissionActivity,
  CameraPresetId,
  MISSION_PHASES,
  MISSION_ACTIVITIES,
} from "./mission-data";
import {
  MISSION_LAUNCH_TIME,
  MISSION_SPLASHDOWN_TIME,
  TOTAL_MISSION_DURATION_HOURS,
} from "./constants";

function getMissionStatus(): "pre-launch" | "live" | "post-mission" {
  const now = new Date();
  if (now < MISSION_LAUNCH_TIME) return "pre-launch";
  if (now > MISSION_SPLASHDOWN_TIME) return "post-mission";
  return "live";
}

function getRealTimeMET(): number {
  const now = new Date();
  const elapsed = (now.getTime() - MISSION_LAUNCH_TIME.getTime()) / (1000 * 60 * 60);
  return Math.max(0, Math.min(TOTAL_MISSION_DURATION_HOURS, elapsed));
}

function getPhaseForMET(met: number): MissionPhase {
  return (
    MISSION_PHASES.find((p) => met >= p.startMET && met < p.endMET) ??
    MISSION_PHASES[MISSION_PHASES.length - 1]
  );
}

function getCurrentActivity(): MissionActivity | null {
  const now = new Date();
  return (
    MISSION_ACTIVITIES.find(
      (a) => now >= new Date(a.startTime) && now < new Date(a.endTime)
    ) ?? null
  );
}

function getNextActivity(): MissionActivity | null {
  const now = new Date();
  return (
    MISSION_ACTIVITIES.find((a) => new Date(a.startTime) > now) ?? null
  );
}

interface MissionStore {
  met: number;
  isPlaying: boolean;
  playbackSpeed: number;
  setMET: (met: number) => void;
  togglePlayback: () => void;
  setSpeed: (speed: number) => void;
  tick: (deltaSeconds: number) => void;

  activePhase: MissionPhase;
  setActivePhase: (phase: MissionPhase) => void;

  activeCameraPreset: CameraPresetId;
  setCameraPreset: (id: CameraPresetId) => void;
  isTransitioning: boolean;
  setIsTransitioning: (v: boolean) => void;

  crewPanelOpen: boolean;
  toggleCrewPanel: () => void;

  missionStatus: "pre-launch" | "live" | "post-mission";
  currentActivity: MissionActivity | null;
  nextActivity: MissionActivity | null;
  realTimeMET: number;
  syncToRealTime: () => void;
  updateLiveStatus: () => void;
}

export const useMissionStore = create<MissionStore>((set, get) => {
  const status = getMissionStatus();
  const initialMET = status === "live" ? getRealTimeMET() : 0;
  const initialPhase = getPhaseForMET(initialMET);

  return {
    met: initialMET,
    isPlaying: false,
    playbackSpeed: 100,
    setMET: (met) => {
      const clamped = Math.max(0, Math.min(TOTAL_MISSION_DURATION_HOURS, met));
      set({ met: clamped, activePhase: getPhaseForMET(clamped) });
    },
    togglePlayback: () => set((s) => ({ isPlaying: !s.isPlaying })),
    setSpeed: (speed) => set({ playbackSpeed: speed }),
    tick: (deltaSeconds) => {
      const state = get();
      if (!state.isPlaying) return;
      const hoursPerSecond = state.playbackSpeed / 3600;
      const newMET = Math.min(
        TOTAL_MISSION_DURATION_HOURS,
        state.met + deltaSeconds * hoursPerSecond
      );
      const newPhase = getPhaseForMET(newMET);
      const updates: Partial<MissionStore> = { met: newMET };
      if (newPhase.id !== state.activePhase.id) {
        updates.activePhase = newPhase;
        updates.activeCameraPreset = newPhase.cameraPreset;
      }
      if (newMET >= TOTAL_MISSION_DURATION_HOURS) {
        updates.isPlaying = false;
      }
      set(updates);
    },

    activePhase: initialPhase,
    setActivePhase: (phase) =>
      set({ activePhase: phase, met: phase.startMET, activeCameraPreset: phase.cameraPreset }),

    activeCameraPreset: initialPhase.cameraPreset,
    setCameraPreset: (id) => set({ activeCameraPreset: id }),
    isTransitioning: false,
    setIsTransitioning: (v) => set({ isTransitioning: v }),

    crewPanelOpen: false,
    toggleCrewPanel: () => set((s) => ({ crewPanelOpen: !s.crewPanelOpen })),

    missionStatus: status,
    currentActivity: getCurrentActivity(),
    nextActivity: getNextActivity(),
    realTimeMET: getRealTimeMET(),
    syncToRealTime: () => {
      const realMET = getRealTimeMET();
      set({
        met: realMET,
        activePhase: getPhaseForMET(realMET),
        activeCameraPreset: getPhaseForMET(realMET).cameraPreset,
      });
    },
    updateLiveStatus: () => {
      set({
        missionStatus: getMissionStatus(),
        currentActivity: getCurrentActivity(),
        nextActivity: getNextActivity(),
        realTimeMET: getRealTimeMET(),
      });
    },
  };
});
